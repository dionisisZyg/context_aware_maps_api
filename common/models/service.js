import app from '../../server/server';
import moment from "moment";
import _ from "lodash";

module.exports = function(Service) {

  /**
   * reward based on route review
   * @param {object} models the passed transact ion models
   * @param {number} reviewId the id of the review that the reward wil be based on
   */

  Service.reviewReward = async function(models, reviewId) {
    models = models.route ? models : app.models;
    let pointsToReward = 0;
    //find review
    const foundReview = await models.review.findById(reviewId);
    if(!foundReview){
      const error = new Error(
        `Not Found. Review with id: ${reviewId} was not found`
      );
      error.status = 404;
      throw error;
    }

    if(foundReview.rating === 1){
      pointsToReward = pointsToReward - 30;
    }

    if(foundReview.rating === 2){
      pointsToReward = pointsToReward - 15;
    }

    if(foundReview.rating === 4){
      pointsToReward = pointsToReward + 30;
    }

    if(foundReview.rating === 5){
      pointsToReward = pointsToReward + 60;
    }

    return pointsToReward;
  };

  /**
   * creates a list of offers that the client can redeem
   * @param {object} models the passed transact ion models
   * @param {number} routeId the route id
   */
  Service.routeReward = async function(models, routeId){
    models = models.route ? models : app.models;
    let pointsToAward = 0;
    const foundRoute = await models.route.findById(
      routeId,
      {include: "points"}
      );
    if(!foundRoute){
      const error = new Error(`Route with id: ${routeId} was not found`);
      error.status = 404;
      throw error
    }

    //reward the type of route rewording
    if(foundRoute.typeCode === "CYCLIST"){
      pointsToAward = pointsToAward + 2 ;
    }

    if(foundRoute.typeCode === "PEDESTRIAN"){
      pointsToAward = pointsToAward + 1;
    }

    //reward the type of the weather
    if(foundRoute.weatherTypeCode === "RAINY"){
      pointsToAward = pointsToAward + 5;
    }

    //reward the purpose of the route
    if(foundRoute.purposeCode === "WORK"){
      pointsToAward = pointsToAward + 5;
    }

    //reward points based on the total
    pointsToAward = pointsToAward + ( foundRoute.points().length * 0.05 );

    //reward points based on the last recorded route
    const previousRoutes = await models.route.find(
      {
        where: {
          and: [
            {personId: foundRoute.personId},
            {creationDate: {lt: foundRoute.creationDate}},
          ]},
        order: "creationDate DESC"
      },
    );
    const previousRoute = previousRoutes.length > 0 ? previousRoutes[0] : null;
    let daysDiff = null;
    if(previousRoute){
      const currentDate = moment(foundRoute.creationDate);
      const previousDate = moment(previousRoute.creationDate);
      daysDiff = currentDate.diff(previousDate, 'day');
    }

    if(
      (daysDiff !== null)
      && daysDiff < 7){
      pointsToAward = pointsToAward + 50;
    } else if(
      (daysDiff !== null)
      && (daysDiff >= 7)
      && (daysDiff < 15)
    ) {
      pointsToAward = pointsToAward + 10;
    } else if(
      (daysDiff !== null)
      && (daysDiff >= 15)
      && (daysDiff < 30)
    ) {
      pointsToAward = pointsToAward + 5;
    } else if(
      (daysDiff !== null)
      && (daysDiff >= 30 )
    ) {
      pointsToAward = pointsToAward + 1;
    }

    return pointsToAward;
  };


};
