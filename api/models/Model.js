/**
 * @module Model
 *
 * @description
 *   Abstract representation of a Waterline Model.
 */
module.exports = {
  attributes: {
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
  associations: function() {
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
