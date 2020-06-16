const Sequelize = require('sequelize')
const db = require('../database/db')

module.exports = db.sequelize.define(
  'user',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    icon: {
      type: Sequelize.STRING
    },
    country: {
      type: Sequelize.STRING
    },
    timezone: {
      type: Sequelize.STRING
    },
    bio: {
      type: Sequelize.STRING
    },
    level: {
      type: Sequelize.INTEGER
    },
    state: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
)
