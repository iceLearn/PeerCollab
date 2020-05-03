const Sequelize = require('sequelize')
const db = require('../database/db')

module.exports = db.sequelize.define(
  'log_type',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  }
)
