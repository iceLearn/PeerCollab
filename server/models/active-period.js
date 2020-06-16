const Sequelize = require('sequelize')
const db = require('../database/db')

module.exports = db.sequelize.define(
  'active_period',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    time: {
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    community_id: {
      type: Sequelize.INTEGER
    }
  },
  {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  }
)
