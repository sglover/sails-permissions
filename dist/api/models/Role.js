/**
 * @module Role
 *
 * @description
 *   Roles endow Users with Permissions. Exposes Postgres-like API for
 *   resolving granted Permissions for a User.
 *
 * @see <http://www.postgresql.org/docs/9.3/static/sql-grant.html>
 */
'use strict';

module.exports = {
  attributes: {
    name: {
      type: Sequelize.STRING,
      index: true,
      notNull: true,
      unique: true
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultsTo: true,
      index: true
    }
    // permissions: {
    //   collection: 'Permission',
    //   via: 'role'
    // }
  },
  associations: function associations() {},
  options: {
    autoPK: true,
    autoCreatedBy: false,
    createdAt: false,
    updatedAt: false,
    tableName: 'roles',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};