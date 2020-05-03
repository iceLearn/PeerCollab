const Sequelize = require('sequelize')
const db = require('../database/db')

module.exports = db.sequelize.define(
  'course',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    icon: {
      type: Sequelize.STRING
    },
    max_communities: {
      type: Sequelize.INTEGER
    },
    max_students: {
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
