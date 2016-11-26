/**
 * @module Permission
 *
 * @description
 *   The actions a Role is granted on a particular Model and its attributes
 */
import _ from 'lodash'
module.exports = {
  autoCreatedBy: false,

  description: [
    'Defines a particular `action` that a `Role` can perform on a `Model`.',
    'A `User` can perform an `action` on a `Model` by having a `Role` which',
    'grants the necessary `Permission`.'
  ].join(' '),

  attributes: {
    action: {
      type: Sequelize.STRING,
      index: true,
      notNull: true,
      /**
       * TODO remove enum and support permissions based on all controller
       * actions, including custom ones
       */
      enum: [
        'create',
        'read',
        'update',
        'delete'
      ]
    },

    relation: {
      type: Sequelize.STRING,
      enum: [
        'role',
        'owner',
        'user'
      ],
      defaultsTo: 'role',
      index: true
    }
  },

  associations: function() {
    /**
     * The Model that this Permission applies to.
     */
    Permission.belongsTo(Model, {
      as: 'model', foreignKey: 'id'
    });

    /**
     * The Role to which this Permission grants create, read, update, and/or
     * delete privileges.
     */
    Permission.belongsTo(Role, {
      as: 'role', foreignKey: 'id'
    });

    /**
     * The User to which this Permission grants create, read, update, and/or
     * delete privileges.
     */
    Permission.belongsTo(User, {
      as: 'user', foreignKey: 'id'
    });

    /**
     * A list of criteria.  If any of the criteria match the request, the action is allowed.
     * If no criteria are specified, it is ignored altogether.
     */
    Permission.hasMany(Criteria, {
      as: 'criteria', foreignKey: 'permission'
    });
  },

  options: {
    autoCreatedBy: false,    
    autoPK: true,
    createdAt: false,
    updatedAt: false,
    tableName: 'permission',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  },

  afterValidate: [
    function validateOwnerCreateTautology (permission, next) {
      if (permission.relation == 'owner' && permission.action == 'create') {
        next(new Error('Creating a Permission with relation=owner and action=create is tautological'));
      }

      if (permission.action === 'delete' &&
              _.filter(permission.criteria, function (criteria) { return !_.isEmpty(criteria.blacklist); }).length) {
        next(new Error('Creating a Permission with an attribute blacklist is not allowed when action=delete'));
      }

      if (permission.relation == 'user' && permission.user === "") {
        next(new Error('A Permission with relation user MUST have the user attribute set'));
      }

      if (permission.relation == 'role' && permission.role === "") {
        next(new Error('A Permission with relation role MUST have the role attribute set'));
      }

      next();
    }
  ]
};
