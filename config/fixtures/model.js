/**
 * Creates database representations of the Model types.
 *
 * @public
 */
import _ from 'lodash'
exports.createModels = function () {
  // for every model defined in the app, make sure there is a row in the models table for it
  var models = _.compact(_.map(sails.models, function (model, name) {
    return model && model.globalId && model.identity && {
      name: model.globalId,
      identity: model.identity,
      attributes: _.omit(model.attributes, _.functions(model.attributes))
    };
  }));

  return Promise.all(_.map(models, function (model) {
    return Model.findOrCreate({where: { name: model.name }, defaults: model}).spread((model, created) => model);
  }));
};
