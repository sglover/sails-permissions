/**
* SecurityLog.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

'use strict';

module.exports = {
  attributes: {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING
    }
  },
  associations: function associations() {
    SecurityLog.belongsTo(RequestLog, {
      as: 'request', foreignKey: 'id'
    });
  },
  options: {
    autoCreatedBy: false,
    autoPK: false,
    createdAt: false,
    updatedAt: false,
    tableName: 'accesses',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};