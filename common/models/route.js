import app from '../../server/server';
import {
  routePurpose,
  routeTypes,
  routeWeatherTypeEnum,
} from '../../general/enums';
import _ from 'lodash';
import proj4 from "proj4";
import JSZip from "jszip";
import {
  getDayTimestampInSeconds,
  getRouteDistance, getRouteEAverageSpeed,
} from '../../general/functions';
const axios = require('axios').default;

module.exports = function(Route) {

  /**
   *
   * @param {Function(Error, object)} callback
   */

  Route.statistics = async function(callback) {
    var statistics;
    const routes = await Route.find({include: "points"});

    let totalDistanceCoveredInMeters = 0;
    routes.forEach(route => {
      totalDistanceCoveredInMeters = totalDistanceCoveredInMeters + getRouteDistance(route);
    });
    const averageDistance = totalDistanceCoveredInMeters / routes.length;

    const personStats = {};
    const routesGroupedByPersonId = _.groupBy(routes, "personId");
    _.forEach(routesGroupedByPersonId, (personRoutes, key) => {
      const totalDistanceCoveredInMetersByPerson = personRoutes
        .reduce((acc, curr) => acc + getRouteDistance(curr), 0);
      const personAverageDistance = personRoutes.length ?
        (totalDistanceCoveredInMetersByPerson / personRoutes.length) : 0;
      const totalPersonRoutes = personRoutes.length;
      const routesByBicycle = personRoutes
        .filter( r => r.typeCode === "CYCLIST")
        .length;
      const totalRoutesDuringDay = personRoutes
        .filter( r => r.isDuringDay).length;
      const totalRoutesForWork = personRoutes
        .filter(r => r.purposeCode === "WORK").length;
      personStats[key] = {
        totalRoutes: totalPersonRoutes,
        totalDistanceCoveredInMeters: totalDistanceCoveredInMetersByPerson,
        averageDistance: personAverageDistance,
        byFootTotalRoutes: totalPersonRoutes - routesByBicycle,
        byBicycleTotalRoutes: routesByBicycle,
        totalRoutesDuringDay: totalRoutesDuringDay,
        totalRoutesDuringNight: totalPersonRoutes - totalRoutesDuringDay,
        totalRoutedForWork: totalRoutesForWork,
        totalRoutesForLeisure: totalPersonRoutes - totalRoutesForWork,
        personId: key
      }
    });

    return {
      totalRoutes: routes.length,
      totalDistanceCoveredInMeters,
      averageDistance,
      statisticsPerPerson: personStats
    };
  };


  /**
   *
   * @param {string} key
   * @param {object} filter
   */

  Route.getDirectionsToGeoJSON = async function(key, filter) {
    let directions = {};
    const filterToUse = filter ? filter : {
      include: 'points'
    };
    let routes = await app.models.route.find(filterToUse);
    routes = routes.filter(route => route.points().length > 1);
    const responses = await Promise.all(
      routes.map(async route => {
        const firstPoint = route.points()[0];
        const lastPoint = _.last(route.points());
        const type = route.typeCode === "CYCLIST" ? "bike" : "foot";
        const apiResponse = await axios({
          method: 'get',
          url: `https://graphhopper.com/api/1/route?point=${firstPoint.latitude},${firstPoint.longitude}&point=${lastPoint.latitude},${lastPoint.longitude}&vehicle=${type}&locale=en&key=${key}&type=json&points_encoded=false&instructions=false`,
        });
          if(apiResponse.status === 200) {
          return {
            type: "Feature",
            properties: {
              routeId: route.id
            },
            geometry: {
              type: "LineString",
              coordinates: apiResponse.data.paths[0].points.coordinates
            }
          }
        }
      })
    );

    // find the derired routes to get directions from
    const geoJson = {
      type: "FeatureCollection",
      features: responses
    };


    return geoJson;
  };

  /**
   *
   * @param {object} graph
   * @param {Function(Error, string)} callback
   */
  Route.graphToGeoJSON = async function(graph) {
    let  geojson = {};
    const FROM_PROJECTION = '+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=0 +datum=GGRS87 +units=m +no_defs';
    const PROJECTION = '+proj=longlat +datum=WGS84 +no_defs';

    const parsedVertices = graph.vertices
      .split("\n")
      .filter(i => i)
      .map(item => {
        const parsed = item.split(",");
        const proj = proj4(FROM_PROJECTION, PROJECTION,[
          parseFloat(parsed[1]), parseFloat(parsed[2])
        ]);
        return {
          id: parsed[0],
          longitude: proj[0],
          latitude: proj[1]
        }
      });
    const varticesById = _.keyBy(parsedVertices, (item) => item.id);
    const pardedEdges = graph.edges
      .split("\n")
      .filter(i => i)
      .map(item => {
        const parsed = item.split(",");
        return {
          id: parsed[0],
          startVertex: varticesById[parsed[1]],
          endVertex: varticesById[parsed[2]]
        }
      });

    geojson = {
      type: "FeatureCollection",
      features: pardedEdges.map(edge => ({
        type: "Feature",
        properties: {
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [
              edge.startVertex.longitude, edge.startVertex.latitude
            ],
            [
              edge.endVertex.longitude, edge.endVertex.latitude
            ]
          ]
        }
      }))
    };

    return geojson
  };


  /**
   *
   * @param {object} geojsonData
   * @param {object} res the filter object
   */

  Route.convertGeoJSONToGgrs87Format = async function(geojsonData, res) {
    var zip = new JSZip();
    const PROJECTION = '+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=0 +datum=GGRS87 +units=m +no_defs';

    geojsonData.features.forEach((feature, fIndex) => {

      const routeString = feature.geometry.coordinates.reduce((acc, curr, index) => {

        const proj = proj4(PROJECTION,[
          curr[0], curr[1]
        ]);
        const timeNow = new Date();
        timeNow.setSeconds(timeNow.getSeconds() + (120 * index));
        const timestamp = timeNow.toISOString();
        const dayTimestamp = new Date(timestamp);
        const dayTimestampInSeconds = getDayTimestampInSeconds(dayTimestamp);
        return acc + `${proj[0]} ${proj[1]} ${dayTimestampInSeconds}${index  + 1 ===  feature.geometry.coordinates.length?"": "\n"}`;
      }, "");

      zip.file(`route_${fIndex}.txt`, routeString);
    });

    const zipFile = await zip.generateAsync({type:"binarystring", streamFiles: true});

    const datetime = new Date();
    res.set('Expires', 'Tue, 03 Jul 2001 06:00:00 GMT');
    res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
    res.set('Last-Modified', datetime +'GMT');
    res.set('Content-Type','application/force-download');
    res.set('Content-Type','application/octet-stream');
    res.set('Content-Type','application/download');
    res.set('Content-Disposition','attachment;filename=ggrs.zip');
    res.set('Content-Transfer-Encoding','binary');
    res.send(Buffer.from(zipFile, 'binary'));

    return ;
  };




  /**
   * transforms data to ggrs87 format
   * @param {object} filter the filter object
   * @param {object} res the filter object
   */

  Route.ggrs87Format = async function(filter, res) {
    const filterToUse = filter ? filter : {
      include: 'points'
    };
    var zip = new JSZip();

    const routes = await app.models.route.find(filterToUse);
    const PROJECTION = '+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=0 +datum=GGRS87 +units=m +no_defs';
    routes
      .filter(route => route.points().length > 1)
      .forEach(route => {
        const routeString = route.points().reduce((acc, curr, index) => {
          const proj = proj4(PROJECTION,[
            curr.longitude, curr.latitude
          ]);
          const dayTimestamp = new Date(curr.timestamp);
          const dayTimestampInSeconds = getDayTimestampInSeconds(dayTimestamp);
          return acc + `${proj[0]} ${proj[1]} ${dayTimestampInSeconds}${index  + 1 ===  route.points().length?"": "\n"}`
        } , "");

        zip.file(`route_id_${route.id}.txt`, routeString);
      });

    const zipFile = await zip.generateAsync({type:"binarystring", streamFiles: true});

    const datetime = new Date();
    res.set('Expires', 'Tue, 03 Jul 2001 06:00:00 GMT');
    res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
    res.set('Last-Modified', datetime +'GMT');
    res.set('Content-Type','application/force-download');
    res.set('Content-Type','application/octet-stream');
    res.set('Content-Type','application/download');
    res.set('Content-Disposition','attachment;filename=ggrs.zip');
    res.set('Content-Transfer-Encoding','binary');
    res.send(Buffer.from(zipFile, 'binary'));

    return ;
    //return data;
  };


  /**
   * returns all the routes in geoJSON format
   * @param {object} filter the filter object
   * @param {Function(Error, object)} callback
   */

  Route.geoJsonFormat = async function(filter) {
    const filterToUse = filter ? filter : {
      include: 'points'
    };

    const routes = await app.models.route.find(filterToUse);

    const geoJsonFeatures = routes
      .filter(route => route.points().length > 1)
      .map(route => ({
      type: "Feature",
      properties: {
        ...route.toJSON(),
        points: null
      },
      geometry: {
        type: "LineString",
        coordinates: route.points().map(point => ([
          point.longitude, point.latitude
        ]))
      }
    }));

    const geoJson = {
      type: "FeatureCollection",
      features: geoJsonFeatures
    };

    return geoJson;
  };


  /**
   * route types
   */

  Route.findRouteTypes = async function() {
    return await _.map(routeTypes, type => type);
  };

  /**
   * route purposes
   */

  Route.findRoutePurposes = async function() {
    return await _.map(routePurpose, purpose => purpose);
  };


  /**
   * route weather types
   */

  Route.findRouteWeatherTypes = async function() {
    return await _.map(routeWeatherTypeEnum, type => type);
  };

  /**
   * custom find
   * @param {object} filter the filter object
   * @param {object} req the express http request object
   */

  Route.customFind = async function(filter, req) {
    try {
      const currentUserId =  req.accessToken.userId;
      const filterToUse = filter ? filter : {
        where: {personId: currentUserId},
        include: 'points'
      };
      let routes =  await app.models.route.find(filterToUse);

      routes = routes.map(route => ({
        ...route.toJSON(),
        weatherType: routeWeatherTypeEnum[route.weatherTypeCode],
        type: routeTypes[route.typeCode],
        purpose: routeTypes[route.purposeCode]
      }));

      return routes;
    } catch (e) {
      throw e;
    }
  };


  /**
   * creates many routes records
   * @param {array} routes the route records
   * @param {object} req the express http request object
   */

  Route.createRouteCollection = async function(routes, req) {
    try {
      const currentUserId =  req.accessToken.userId;
      let newRoutes = [];
      await app.datasources.mysql.transaction(async models => {
        //create the new routes
        newRoutes = await Promise.all(
          routes.map(async route => {
            const createdRoute = await models.route.create({
              personId: currentUserId,
              creationDate: new Date(),
              isDuringDay: route.isDuringDay,
              typeCode: route.type,
              weatherTypeCode: route.weatherType,
              purposeCode: route.purpose
            });
            const routePoints = route.points.map(location => ({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              altitude: location.coords.altitude,
              accuracy: location.coords.accuracy,
              altitudeAccuracy: location.coords.altitudeAccuracy,
              heading: location.coords.heading,
              speed: location.coords.speed,
              timestamp: location.timestamp,
              routeId: createdRoute.id
            }));
            await models.point.create(routePoints);
            return  {
              id: createdRoute.id,
              personId: createdRoute.personId,
              points: routePoints
            };
          })
        );

        //reward each route
        const pointsPerRoute = await Promise.all(
          newRoutes.map(async route => {
            return await models.service.routeReward(models, route.id);
          })
        );
        const totalPoints = pointsPerRoute.reduce((acc, current) => {
          if(!isNaN(current)){
            return acc + current;
          } else {
            return acc;
          }
        }, 0);

        //save points of the user
        const foundUser = await models.person.findById(currentUserId);
        const currentPoints = foundUser.points ? foundUser.points : 0 ;
        const newPoints = currentPoints + totalPoints;
        await models.person.update({id: foundUser.id}, {points: newPoints});

      });
      return newRoutes;
    } catch (e) {
      throw e;
    }
  };

};
