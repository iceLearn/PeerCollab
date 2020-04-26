const Sequelize = require('sequelize')
const db = require('../database/db')

module.exports = db.sequelize.define(
  'user_log',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    ref_id: {
      type: Sequelize.BIGINT
    },
    user_interface: {
      type: Sequelize.STRING
    },
    component: {
      type: Sequelize.STRING
    },
    message: {
      type: Sequelize.STRING
    },
    log_type_id: {
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    ip: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  }
)
