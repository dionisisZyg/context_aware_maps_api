import app from '../../server/server';

module.exports = function(Review) {
  Review.beforeRemote("create", async (ctx) => {
    ctx.req.body.creationDate = new Date();
    return;
  })

  /**
   * custom create
   * @param {object} review the review object
   * @param {Function(Error, object)} callback
   */

  Review.customCreate = async function(review) {

    let response = {};
    //transaction
    try {
      await app.datasources.mysql.transaction( async models => {
        //create review
        const newReview = await models.review.create({
          ...review,
          creationDate: new Date()
        });
        response = newReview;

        //reward the user of the reviewed route
        const pointsForReview = await models.service.reviewReward(models, newReview.id);

        //find user of route to update his points
        const reviewedRoute = await models.route.findById(
          newReview.routeId,
          {include: "person"}
          );
        const currentUserPoints = reviewedRoute.person().points ?
          reviewedRoute.person().points : 0;
        const newPoints = currentUserPoints + pointsForReview;

        await models.person.update({id: reviewedRoute.personId}, {points: newPoints});

      });

      } catch (e) {
      throw e;
    }
    return response;
  };

};
