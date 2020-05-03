const Sequelize = require('sequelize')
const db = require('../database/db')

module.exports = db.sequelize.define(
  'notification',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: Sequelize.STRING
    },
    url: {
      type: Sequelize.STRING
    },
    ref_id: {
      type: Sequelize.INTEGER
    },
    type: {
      type: Sequelize.INTEGER
    },
    state: {
      type: Sequelize.STRING
    },
    user_id: {
      type: Sequelize.INTEGER
    }
  },
  {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  }
)
