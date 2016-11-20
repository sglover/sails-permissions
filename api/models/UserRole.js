'use strict';

/**
 * UserRole.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    user_id: {
      type: Sequelize.INTEGER
    },
    role_id: {
      type: Sequelize.INTEGER
    }
  },
  associations: function() {
  },
  options: {
    autoCreatedBy: false,
    tableName: 'users_roles',
    createdAt: false,
    updatedAt: false,
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};