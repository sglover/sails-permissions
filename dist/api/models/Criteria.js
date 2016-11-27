/**
 * @module Criteria
 *
 * @description
 * Criteria specify limits on a permission, via a 'where' clause and an attribute blacklist.
 * For the blacklist, if the request action is update or create, and there is a blacklisted attribute in the request, 
 * the request will fail.  If the request action is read, the blacklisted attributes will be filtered.
 * The blacklist is not relevant for delete requests.
 * A where clause uses waterline query syntax to determine if a permission is allowed, ie where: { id: { '>': 5 } }
 */
'use strict';

module.exports = {
  attributes: {
    where: Sequelize.JSON,
    blacklist: Sequelize.ARRAY(Sequelize.TEXT)
  },
  associations: function associations() {
    Criteria.belongsToMany(Permission, {
      as: 'permission', foreignKey: 'permission'
    });
  },
  options: {
    autoCreatedBy: false,
    tableName: 'criteria',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};