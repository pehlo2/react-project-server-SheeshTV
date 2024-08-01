const router = require('express').Router();

const notificationManager = require('../managers/notificationsManager.js');




router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = await notificationManager.getNotifications(userId);

        res.status(200).json(notifications);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});




router.delete('/:notificationId/delete', async (req, res) => {
    const { notificationId } = req.params;
       
    try {
      const notification =  await  notificationManager.deleteNotification(notificationId)

      res.status(200).send(notification);
    } catch (err) {
      res.status(500).json({message: err.message });
    }
  });
  
  router.put('/:notificationId/read', async (req, res) => {
    const { notificationId } = req.params;

    try {
      const notification =  await  notificationManager.markAsRead(notificationId)

      res.status(200).send(notification);
    } catch (err) {
      res.status(500).json({message: err.message });
    }
  });



router.delete('/:userId/deleteAll', async (req, res) => {
  const { userId } = req.params;
  try {
      const result = await notificationManager.deleteAllNotifications(userId);
      res.status(200).send(result);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


router.put('/:userId/readAll', async (req, res) => {
  const { userId } = req.params;
  try {
      const result = await notificationManager.markAllAsRead(userId);
      res.status(200).send(result);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

module.exports = router;


  module.exports = router;

