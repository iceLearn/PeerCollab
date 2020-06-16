
const Notification = require('../models/notification')

function getActiveNotifications(userId) {
  return new Promise((resolve, reject) => {
    Notification.findAll({
      attributes: ['id', 'type', 'text', 'url', 'ref_id', 'created_at'],
      where: {
        'user_id': userId,
        'state': 'NEW'
      },
      order: [
        ['id', 'DESC']
      ]
    }).then(results => {
      const data = results.map((node) => node.get({ plain: true }))
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
}

function addNotification(text, url, userId) {
  Notification.create({
    text: text,
    url: url,
    user_id: userId
  }).then(results => {
    return results.id
  }).catch(err => {
    console.log(err)
  })
}

function clickNotification(id) {
  return new Promise((resolve, reject) => {
    Notification.update(
      { state: 'CLICKED' },
      { where: { id: id } }
    ).then(results => {
      resolve(results.id)
    }).catch(err => {
      reject(err)
    })
  })
}

module.exports = { getActiveNotifications, addNotification, clickNotification }
