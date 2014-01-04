var GhostTrainBackbone = require('../..');

function createModels (gt, $) {
  var User = Backbone.Model.extend({
    urlRoot: '/users',
    sync: GhostTrainBackbone(gt, $)
  });

  var Users = Backbone.Collection.extend({
    url: '/users',
    sync: GhostTrainBackbone(gt, $),
    model: User
  });

  var LongURLUser = Backbone.Model.extend({
    urlRoot: '/users/long/user/',
    sync: GhostTrainBackbone(gt, $)
  });

  return {
    User: User,
    Users: Users,
    LongURLUser: LongURLUser
  };
}
exports.createModels = createModels;
