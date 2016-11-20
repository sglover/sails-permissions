var permissionPolicies = [
  'passport',
  'sessionAuth',
  'ModelPolicy',
  'OwnerPolicy',
  'PermissionPolicy',
  'RolePolicy'
]
import * as fs from 'fs'
import path from 'path'
import _ from 'lodash'
import Marlinspike from 'marlinspike'
import * as includeAll from 'include-all'
import requireAll from 'require-all'
import sequelize from 'sequelize'
import util from 'util'

class Permissions extends Marlinspike {
  constructor (sails) {
    super(sails, module)
  }

  configure () {
    if (!_.isObject(sails.config.permissions)) sails.config.permissions = { }

    /**
     * Local cache of Model name -> id mappings to avoid excessive database lookups.
     */
    this.sails.config.blueprints.populate = false
  }

  initialize (next) {
    let config = this.sails.config.permissions

    this.installModelOwnership()
    this.sails.after(config.afterEvent, () => {
      if (!this.validateDependencies()) {
        this.sails.log.error('Cannot find sails-auth hook. Did you "npm install sails-auth --save"?')
        this.sails.log.error('Please see README for installation instructions: https://github.com/tjwebb/sails-permissions')
        return this.sails.lower()
      }

      if (!this.validatePolicyConfig()) {
        this.sails.log.warn('One or more required policies are missing.')
        this.sails.log.warn('Please see README for installation instructions: https://github.com/tjwebb/sails-permissions')
      }

    })

    this.sails.after('hook:sequelize:loaded', () => {

      this.bindModels()

      Model.count()
        .then(count => {
          if (count === _.keys(this.sails.models).length) return next()

          return this.initializeFixtures()
            .then(() => {
              next()
            })
        })
        .catch(error => {
          this.sails.log.error(error)
          next(error)
        })
    })
  }

  validatePolicyConfig () {
    var policies = this.sails.config.policies
    return _.all([
      _.isArray(policies['*']),
      _.intersection(permissionPolicies, policies['*']).length === permissionPolicies.length,
      policies.AuthController && _.contains(policies.AuthController['*'], 'passport')
    ])
  }

  installModelOwnership () {
    var models = this.sails.models
    if (this.sails.config.models.autoCreatedBy === true) {
      _.each(models, model => {
        if (model.options.autoCreatedBy === true) {
          _.defaults(model.attributes, {
            createdBy: {
              model: 'User',
              index: true
            },
            owner: {
              model: 'User',
              index: true
            }
          })
        }
      })
    }
  }

  // override
  loadModels () {
    this.sails.log.debug(`marlinspike (${this.name}): loading Models...`)
    try {
      let models = requireAll({
        dirname: path.resolve(this.hookPath, '../../models'),
        filter: /(.+)\.js$/
      })
      this.mergeEntities('models', models)
      this.models = _.merge(this.models || { }, Marlinspike.transformEntities(models))
    }
    catch (e) {
      this.sails.log.debug(e)
      this.sails.log.warn(`marlinspike (${this.name}): no Models found. skipping`)
    }
  }

  /*
   * bind the models into Sequelize
   */
  bindModels() {
    const models = this.models

    _.keys(models).forEach(function(key) {
      sails.log.verbose('model=' + key)
      const model = models[key]
      global[model.globalId] = global['sequelize'].define(model.globalId, model.attributes, model.options)
    })
  }

  /**
  * Install the application. Sets up default Roles, Users, Models, and
  * Permissions, and creates an admin user.
  */
  initializeFixtures () {
    let fixturesPath = path.resolve(__dirname, '../../../config/fixtures/')
    return require(path.resolve(fixturesPath, 'model'))
      .createModels()
      .then(models => {
        this.models = models
        this.sails.hooks.permissions._modelCache = _.indexBy(models, 'identity')

        return require(path.resolve(fixturesPath, 'role')).create()
      })
      .then(roles => {
        this.roles = roles
        var userModel = _.find(this.models, { name: 'User' })
        return require(path.resolve(fixturesPath, 'user')).create(this.roles, userModel)
      })
      .then(() => {
        return sails.models.user.findOne({ email: this.sails.config.permissions.adminEmail })
      })
      .then(user => {
        this.sails.log('sails-permissions: created admin user:', user)
        user.createdBy = user.id
        user.owner = user.id
        return user.save()
      })
      .then(admin => {
        return require(path.resolve(fixturesPath, 'permission')).create(this.roles, this.models, admin, this.sails.config.permissions);
      })
      .catch(error => {
        this.sails.log.error(error)
      })
  }

  validateDependencies () {
    return !!this.sails.hooks.auth;
  }
}

export default Marlinspike.createSailsHook(Permissions)
