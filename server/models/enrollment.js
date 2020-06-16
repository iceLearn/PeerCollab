const Sequelize = require('sequelize')
const db = require('../database/db')

module.exports = db.sequelize.define(
  'enrollment',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    level: {
      type: Sequelize.INTEGER
    },
    time: {
      type: Sequelize.INTEGER
    },
    state: {
      type: Sequelize.STRING
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
