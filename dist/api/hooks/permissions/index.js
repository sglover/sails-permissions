'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _marlinspike = require('marlinspike');

var _marlinspike2 = _interopRequireDefault(_marlinspike);

var _includeAll = require('include-all');

var includeAll = _interopRequireWildcard(_includeAll);

var _requireAll = require('require-all');

var _requireAll2 = _interopRequireDefault(_requireAll);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var permissionPolicies = ['passport', 'sessionAuth', 'ModelPolicy', 'OwnerPolicy', 'PermissionPolicy', 'RolePolicy'];

var Permissions = (function (_Marlinspike) {
  _inherits(Permissions, _Marlinspike);

  function Permissions(sails) {
    _classCallCheck(this, Permissions);

    _get(Object.getPrototypeOf(Permissions.prototype), 'constructor', this).call(this, sails, module);
  }

  _createClass(Permissions, [{
    key: 'configure',
    value: function configure() {
      if (!_lodash2['default'].isObject(sails.config.permissions)) sails.config.permissions = {};

      /**
       * Local cache of Model name -> id mappings to avoid excessive database lookups.
       */
      this.sails.config.blueprints.populate = false;
    }
  }, {
    key: 'initialize',
    value: function initialize(next) {
      var _this = this;

      var config = this.sails.config.permissions;

      this.installModelOwnership();
      this.sails.after(config.afterEvents, function () {
        if (!_this.validateDependencies()) {
          _this.sails.log.error('Cannot find sails-auth hook. Did you "npm install sails-auth --save"?');
          _this.sails.log.error('Please see README for installation instructions: https://github.com/tjwebb/sails-permissions');
          return _this.sails.lower();
        }

        if (!_this.validatePolicyConfig()) {
          _this.sails.log.warn('One or more required policies are missing.');
          _this.sails.log.warn('Please see README for installation instructions: https://github.com/tjwebb/sails-permissions');
        }

        _this.sails.after('hook:sequelize:initialized', function () {
          _this.bindModels();

          Model.count().then(function (count) {
            if (count === _lodash2['default'].keys(_this.sails.models).length) return next();

            return _this.initializeFixtures().then(function () {
              next();
            });
          })['catch'](function (error) {
            _this.sails.log.error(error);
            next(error);
          });
        });
      });
    }
  }, {
    key: 'validatePolicyConfig',
    value: function validatePolicyConfig() {
      var policies = this.sails.config.policies;
      return _lodash2['default'].all([_lodash2['default'].isArray(policies['*']), _lodash2['default'].intersection(permissionPolicies, policies['*']).length === permissionPolicies.length, policies.AuthController && _lodash2['default'].contains(policies.AuthController['*'], 'passport')]);
    }
  }, {
    key: 'installModelOwnership',
    value: function installModelOwnership() {
      var models = this.sails.models;
      if (this.sails.config.models.autoCreatedBy === true) {
        _lodash2['default'].each(models, function (model) {
          if (model.options.autoCreatedBy === true) {
            _lodash2['default'].defaults(model.attributes, {
              createdBy: {
                model: 'User',
                index: true
              },
              owner: {
                model: 'User',
                index: true
              }
            });
          }
        });
      }
    }

    // override
  }, {
    key: 'loadModels',
    value: function loadModels() {
      this.sails.log.debug('marlinspike (' + this.name + '): loading Models...');
      try {
        var models = (0, _requireAll2['default'])({
          dirname: _path2['default'].resolve(this.hookPath, '../../models'),
          filter: /(.+)\.js$/
        });
        this.mergeEntities('models', models);
        this.models = _lodash2['default'].merge(this.models || {}, _marlinspike2['default'].transformEntities(models));
      } catch (e) {
        this.sails.log.debug(e);
        this.sails.log.warn('marlinspike (' + this.name + '): no Models found. skipping');
      }
    }

    /*
     * bind the models into Sequelize
     */
  }, {
    key: 'bindModels',
    value: function bindModels() {
      var models = this.models;

      _lodash2['default'].keys(models).forEach(function (key) {
        sails.log.verbose('model=' + key);
        var model = models[key];
        global[model.globalId] = global['sequelize'].define(model.globalId, model.attributes, model.options);
      });
    }

    /**
    * Install the application. Sets up default Roles, Users, Models, and
    * Permissions, and creates an admin user.
    */
  }, {
    key: 'initializeFixtures',
    value: function initializeFixtures() {
      var _this2 = this;

      var fixturesPath = _path2['default'].resolve(__dirname, '../../../config/fixtures/');
      return require(_path2['default'].resolve(fixturesPath, 'model')).createModels().then(function (models) {
        _this2.models = models;
        _this2.sails.hooks.permissions._modelCache = _lodash2['default'].indexBy(models, 'identity');

        return require(_path2['default'].resolve(fixturesPath, 'role')).create();
      }).then(function (roles) {
        _this2.roles = roles;
        var userModel = _lodash2['default'].find(_this2.models, { name: 'User' });
        return require(_path2['default'].resolve(fixturesPath, 'user')).create(_this2.roles, userModel);
      }).then(function (admin) {
        return require(_path2['default'].resolve(fixturesPath, 'permission')).create(_this2.roles, _this2.models, _this2.sails.config.permissions);
      })['catch'](function (error) {
        _this2.sails.log.error(error);
      });
    }
  }, {
    key: 'validateDependencies',
    value: function validateDependencies() {
      return !!this.sails.hooks.auth;
    }
  }]);

  return Permissions;
})(_marlinspike2['default']);

exports['default'] = _marlinspike2['default'].createSailsHook(Permissions);
module.exports = exports['default'];