const Sequelize = require('sequelize')
const db = require('../database/db')

module.exports = db.sequelize.define(
  'activity',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: Sequelize.STRING
    },
    text: {
      type: Sequelize.STRING
    },
    attachment: {
      type: Sequelize.STRING
    },
    expression: {
      type: Sequelize.STRING
    },
    activity_ref_id: {
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
