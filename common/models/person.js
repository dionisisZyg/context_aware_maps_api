import app from '../../server/server';

module.exports = function(Person) {

  /**
   * find the findLeaderBoard
   * @param {number} limit how many records should be returned
   * @param {Function(Error, array)} callback
   */

  Person.findLeaderBoard = async function(limit) {
    const leaderBoard =  await app.models.person.find({
      order: "points DESC",
      limit: limit ? limit : 10
    });

    return leaderBoard;
  };

};
