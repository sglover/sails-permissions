/**
 * @module Role
 *
 * @description
 *   Roles endow Users with Permissions. Exposes Postgres-like API for
 *   resolving granted Permissions for a User.
 *
 * @see <http://www.postgresql.org/docs/9.3/static/sql-grant.html>
 */
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
      index: true,
      notNull: true,
      unique: true
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultsTo: true,
      index: true
    },
    resource_type: {
      type: Sequelize.STRING,
      index: true
    },
    resource_id: {
      type: Sequelize.INTEGER,
      index: true
    }
  },
  associations: function() {
  },
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
