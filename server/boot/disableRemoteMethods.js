import app from '../server';

//Models
const Person = app.models.person;
const Point = app.models.point;
const Review = app.models.review;
const Route = app.models.route;
const ScoreBoard = app.models.scoreBoard;
const Type = app.models.type;

// Type
Type.disableRemoteMethodByName('prototype.updateAttributes');
Type.disableRemoteMethodByName('upsert');
Type.disableRemoteMethodByName('count');
Type.disableRemoteMethodByName('exists');
Type.disableRemoteMethodByName('replaceOrCreate');
Type.disableRemoteMethodByName('replaceById');
Type.disableRemoteMethodByName('destroyById');
Type.disableRemoteMethodByName('createChangeStream');
Type.disableRemoteMethodByName('findOne');
Type.disableRemoteMethodByName('update');
Type.disableRemoteMethodByName('upsertWithWhere');

Type.disableRemoteMethodByName('prototype.__get__points');
Type.disableRemoteMethodByName('prototype.__create__points');
Type.disableRemoteMethodByName('prototype.__destroyById__points');
Type.disableRemoteMethodByName('prototype.__delete__points');
Type.disableRemoteMethodByName('prototype.__findById__points');
Type.disableRemoteMethodByName('prototype.__updateById__points');
Type.disableRemoteMethodByName('prototype.__count__points');

// Score Board
ScoreBoard.disableRemoteMethodByName('prototype.updateAttributes');
ScoreBoard.disableRemoteMethodByName('upsert');
ScoreBoard.disableRemoteMethodByName('count');
ScoreBoard.disableRemoteMethodByName('exists');
ScoreBoard.disableRemoteMethodByName('replaceOrCreate');
ScoreBoard.disableRemoteMethodByName('replaceById');
ScoreBoard.disableRemoteMethodByName('destroyById');
ScoreBoard.disableRemoteMethodByName('createChangeStream');
ScoreBoard.disableRemoteMethodByName('findOne');
ScoreBoard.disableRemoteMethodByName('update');
ScoreBoard.disableRemoteMethodByName('upsertWithWhere');

// Route
Route.disableRemoteMethodByName('find');
Route.disableRemoteMethodByName('prototype.updateAttributes');
Route.disableRemoteMethodByName('upsert');
Route.disableRemoteMethodByName('create');
Route.disableRemoteMethodByName('count');
Route.disableRemoteMethodByName('exists');
Route.disableRemoteMethodByName('replaceOrCreate');
Route.disableRemoteMethodByName('replaceById');
Route.disableRemoteMethodByName('destroyById');
Route.disableRemoteMethodByName('createChangeStream');
Route.disableRemoteMethodByName('findOne');
Route.disableRemoteMethodByName('update');
Route.disableRemoteMethodByName('upsertWithWhere');

Route.disableRemoteMethodByName('prototype.__get__points');
Route.disableRemoteMethodByName('prototype.__create__points');
Route.disableRemoteMethodByName('prototype.__destroyById__points');
Route.disableRemoteMethodByName('prototype.__delete__points');
Route.disableRemoteMethodByName('prototype.__findById__points');
Route.disableRemoteMethodByName('prototype.__updateById__points');
Route.disableRemoteMethodByName('prototype.__count__points');

Route.disableRemoteMethodByName('prototype.__get__reviewers');
Route.disableRemoteMethodByName('prototype.__create__reviewers');
Route.disableRemoteMethodByName('prototype.__destroyById__reviewers');
Route.disableRemoteMethodByName('prototype.__delete__reviewers');
Route.disableRemoteMethodByName('prototype.__findById__reviewers');
Route.disableRemoteMethodByName('prototype.__updateById__reviewers');
Route.disableRemoteMethodByName('prototype.__count__reviewers');

Route.disableRemoteMethodByName('prototype.__get__person');

Route.disableRemoteMethodByName('prototype.__link__reviewers');
Route.disableRemoteMethodByName('prototype.__unlink__reviewers');
Route.disableRemoteMethodByName('prototype.__exists__reviewers');

//Review
Review.disableRemoteMethodByName('create');
Review.disableRemoteMethodByName('prototype.updateAttributes');
Review.disableRemoteMethodByName('upsert');
Review.disableRemoteMethodByName('count');
Review.disableRemoteMethodByName('exists');
Review.disableRemoteMethodByName('replaceOrCreate');
Review.disableRemoteMethodByName('replaceById');
Review.disableRemoteMethodByName('destroyById');
Review.disableRemoteMethodByName('createChangeStream');
Review.disableRemoteMethodByName('findOne');
Review.disableRemoteMethodByName('update');
Review.disableRemoteMethodByName('upsertWithWhere');

Review.disableRemoteMethodByName('prototype.__get__person');
Review.disableRemoteMethodByName('prototype.__get__route');

// Point
Point.disableRemoteMethodByName('prototype.updateAttributes');
Point.disableRemoteMethodByName('upsert');
Point.disableRemoteMethodByName('count');
Point.disableRemoteMethodByName('exists');
Point.disableRemoteMethodByName('replaceOrCreate');
Point.disableRemoteMethodByName('replaceById');
Point.disableRemoteMethodByName('destroyById');
Point.disableRemoteMethodByName('createChangeStream');
Point.disableRemoteMethodByName('findOne');
Point.disableRemoteMethodByName('update');
Point.disableRemoteMethodByName('upsertWithWhere');

Point.disableRemoteMethodByName('prototype.__get__type');
Point.disableRemoteMethodByName('prototype.__get__route');

// Person
Person.disableRemoteMethodByName('prototype.updateAttributes');
Person.disableRemoteMethodByName('upsert');
Person.disableRemoteMethodByName('count');
Person.disableRemoteMethodByName('exists');
Person.disableRemoteMethodByName('replaceOrCreate');
Person.disableRemoteMethodByName('replaceById');
Person.disableRemoteMethodByName('destroyById');
Person.disableRemoteMethodByName('createChangeStream');
Person.disableRemoteMethodByName('findOne');
Person.disableRemoteMethodByName('update');
Person.disableRemoteMethodByName('upsertWithWhere');

Person.disableRemoteMethodByName('prototype.verify');
Person.disableRemoteMethodByName('changePassword');
Person.disableRemoteMethodByName('confirm');

Person.disableRemoteMethodByName('resetPassword');
Person.disableRemoteMethodByName('setPassword');

Person.disableRemoteMethodByName('prototype.__get__accessTokens');
Person.disableRemoteMethodByName('prototype.__create__accessTokens');
Person.disableRemoteMethodByName('prototype.__destroyById__accessTokens');
Person.disableRemoteMethodByName('prototype.__delete__accessTokens');
Person.disableRemoteMethodByName('prototype.__findById__accessTokens');
Person.disableRemoteMethodByName('prototype.__updateById__accessTokens');
Person.disableRemoteMethodByName('prototype.__count__accessTokens');

Person.disableRemoteMethodByName('prototype.__get__routes');
Person.disableRemoteMethodByName('prototype.__create__routes');
Person.disableRemoteMethodByName('prototype.__destroyById__routes');
Person.disableRemoteMethodByName('prototype.__delete__routes');
Person.disableRemoteMethodByName('prototype.__findById__routes');
Person.disableRemoteMethodByName('prototype.__findById__routes');
Person.disableRemoteMethodByName('prototype.__updateById__routes');
Person.disableRemoteMethodByName('prototype.__count__routes');

Person.disableRemoteMethodByName('prototype.__get__routeReviews');
Person.disableRemoteMethodByName('prototype.__create__routeReviews');
Person.disableRemoteMethodByName('prototype.__destroyById__routeReviews');
Person.disableRemoteMethodByName('prototype.__delete__routeReviews');
Person.disableRemoteMethodByName('prototype.__findById__routeReviews');
Person.disableRemoteMethodByName('prototype.__updateById__routeReviews');
Person.disableRemoteMethodByName('prototype.__count__routeReviews');


Person.disableRemoteMethodByName('prototype.__link__routeReviews');
Person.disableRemoteMethodByName('prototype.__unlink__routeReviews');
Person.disableRemoteMethodByName('prototype.__exists__routeReviews');
