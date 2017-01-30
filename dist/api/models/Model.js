/**
 * @module Model
 *
 * @description
 *   Abstract representation of a Waterline Model.
 */
'use strict';

module.exports = {
  attributes: {
    id: {
      type: Sequelize.INTEGER,
      field: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      notNull: true,
      unique: true
    },
    identity: {
      type: Sequelize.STRING,
      notNull: true
    },
    attrs: {
      type: Sequelize.JSON
    }
  },
  associations: function associations() {
    Model.belongsToMany(Permission, {
      as: 'model', foreignKey: 'model'
    });
  },
  options: {
    autoCreatedBy: false,
    autoPK: true,
    createdAt: false,
    updatedAt: false,
    tableName: 'model',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};