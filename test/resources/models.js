var GhostTrainBackbone = require('../..');

function createModels (gt, $) {
  var User = Backbone.Model.extend(GhostTrainBackbone(gt, $)).extend({
    urlRoot: '/users'
  });

  var Users = Backbone.Collection.extend(GhostTrainBackbone(gt, $)).extend({
    url: '/users',
    model: User
  });

  var LongURLUser = Backbone.Model.extend(GhostTrainBackbone(gt, $)).extend({
    urlRoot: '/users/long/user/'
  });

  return {
    User: User,
    Users: Users,
    LongURLUser: LongURLUser
  };
}
exports.createModels = createModels;
