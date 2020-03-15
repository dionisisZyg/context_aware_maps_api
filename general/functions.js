import {getPreciseDistance} from 'geolib';
import _ from 'lodash';
import moment from 'moment';

export const getDayTimestampInSeconds = (date) => {
  return (date.getHours() * 60 * 60) + (date.getMinutes() * 60) + (date.getSeconds());
};

export const getRouteDistance = (route) => {
  let distance = 0.0;
  if(route.length < 2) {
    return 0.0;
  }
  for(let i = 0; i < route.points().length - 1; i++){
    const distanceOfTwoPoints = getPreciseDistance(
      {
        latitude: route.points()[i].latitude,
        longitude: route.points()[i].longitude,
      },
      {
        latitude: route.points()[i + 1].latitude,
        longitude: route.points()[i + 1].longitude,
      },
      1,
      1
    );
    distance =  distance + distanceOfTwoPoints
  }
  return distance;
};

export const getRouteEAverageSpeed = (route) => {
  const distance = getRouteDistance(route);
  const time = getRouteDuration(route);
  const seconds = time / 1000;
  const speed = seconds ? distance / seconds : 0;
  return speed;
};

export const getRouteDuration= (route) => {
  if(route.points().length < 2){
    return 0;
  }

  const firstPoint = route.points()[0];
  const lastPoint = _.last(route.points());
  const x = new moment(firstPoint.timestamp);
  const y = new moment(lastPoint.timestamp);

  const totalHours = y.hours() - x.hours();
  const totalMinutes = y.minutes() - x.minutes();
  const totalSeconds = y.second() - x.second();
  const totalMilliSeconds = y.millisecond() - x.millisecond();

  const duration = (
    totalHours * 60 * 60 * 1000
    + totalMinutes * 60 * 1000
    + totalSeconds  * 1000
    + totalMilliSeconds
  );

  return duration > 0 ? duration : 0;

};
