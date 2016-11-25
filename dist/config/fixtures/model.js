/**
 * Creates database representations of the Model types.
 *
 * @public
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

exports.createModels = function () {
  // for every model defined in the app, make sure there is a row in the models table for it
  var models = _lodash2['default'].compact(_lodash2['default'].map(sails.models, function (model, name) {
    return model && model.globalId && model.identity && {
      name: model.globalId,
      identity: model.identity,
      attributes: _lodash2['default'].omit(model.attributes, _lodash2['default'].functions(model.attributes))
    };
  }));

  return Promise.all(_lodash2['default'].map(models, function (model) {
    return Model.findOrCreate({ where: { name: model.name }, defaults: model });
  }));
};