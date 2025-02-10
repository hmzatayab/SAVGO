import Notification from "../models/notification.model.js";

export const getNotification = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.params.userId,
    }) // Change 'user' to 'receiver'
      .populate("sender", "name image username")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const notificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.notificationId, {
      isRead: true,
    });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { receiver, sender, type, message, link } = req.body;
    const notification = new Notification({
      receiver,
      sender,
      type,
      message,
      link,
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
