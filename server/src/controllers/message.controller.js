import mongoose from 'mongoose';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { v2 as cloudinary } from 'cloudinary';
import { getReceiverSocketId, io } from '../lib/socket.js';

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password');
    res.status(200).json(filteredUser);
  } catch (error) {
    console.error('error in get all contacts', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error in getMessages controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if (!mongoose.isValidObjectId(receiverId)) {
      return res.status(400).json({ error: 'Invalid receiver id' });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    if (image) {
      //upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // todo : send message in realtime if the user is online - socket.io

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error in sendMessage controller', error);
    res.status(501).json({ error: 'Internal Server error' });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    //find all the messages where logged in user is either a sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select('-password');

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error('Error in getChatPartners:', error.message);
    res.status(500).json({ error: 'Internal Server error' });
  }
};
