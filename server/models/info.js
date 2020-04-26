const Sequelize = require('sequelize')
const db = require('../database/db')

module.exports = db.sequelize.define(
  'info',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      type: Sequelize.STRING
    },
    value: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
)
