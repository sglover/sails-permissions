/**
* RequestLog.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    ipAddress: {
      type: Sequelize.STRING
    },
    method: {
      type: Sequelize.STRING
    },
    url: {
      type: Sequelize.STRING,
      url: true
    },
    body: {
      type: Sequelize.JSON
    },
    model: {
      type: Sequelize.STRING
    }
  },
  associations: function() {
    RequestLog.belongsTo(User, {
      as: 'user', foreignKey: 'user'
    });
  },

  options: {
    autoCreatedBy: false,
    autoPK: false,
    createdAt: false,
    updatedAt: false,
    tableName: 'requestlog',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};

