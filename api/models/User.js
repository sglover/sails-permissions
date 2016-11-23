var _ = require('lodash');
var _super = require('sails-auth-sequelize/api/models/User');

_.merge(exports, _super);
_.merge(exports, {
  attributes: {
  },

  associations: function() {
    User.belongsToMany(Role, {
      through: {
        model: UserRole,
        unique: false,
      },
      as: 'roles',
      foreignKey: 'user_id',
      otherKey: 'role_id'
    });
  },

  options: {
    autoCreatedBy: false,
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  },

  /**
   * Attach default Role to a new User
   */
  afterCreate: [
    function setOwner (user, next) {
      sails.log.verbose('User.afterCreate.setOwner', user);
      User
        .update({ id: user.id }, { owner: user.id })
        .then(function (user) {
          next();
        })
        .catch(function (e) {
          sails.log.error(e);
          next(e);
        });
    },
    function attachDefaultRole (user, next) {
      sails.log('User.afterCreate.attachDefaultRole', user);
      User.findOne({
          where: { id: user.id },
          include: [{ model: Role, as: 'roles' }]
        .then(function (_user) {
          user = _user;
          // return Role.findOne({ name: 'registered' });
          return Role.findOne({ where: { name: 'registered' } });
        })
        .then(function (role) {
          user.roles.add(role.id);
          return user.save();
        })
        .then(function (updatedUser) {
          sails.log.silly('role "registered" attached to user', user.username);
          next();
        })
        .catch(function (e) {
          sails.log.error(e);
          next(e);
        })
      });
    }
  ]
});
