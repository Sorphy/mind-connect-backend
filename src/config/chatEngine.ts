import express, { Router, Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User, { UserAttributes } from '../model/registerModel';
import ChatMessage from '../model/chatMessageModel';
import { Op, WhereOptions } from 'sequelize';
import { auth } from '../middleware/auth';
import Pusher from 'pusher'
const jwtSecret = process.env.JWT_SECRET_KEY as string;



const router: Router = express.Router();
const io: Server = require('socket.io')();

const socketapi = {
  io: io,
};

// Event handler for new connections
io.on('connection', (socket: Socket) => {
  console.log('A new client connected', socket.id);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with Id ${socket.id} joined room: ${data}`);
  });

  socket.on('send_message', async (data) => {
    const { message, senderId } = data;
    const room = data.room;
  
    // Emit the message to the room via socket.io
    io.to(room).emit('receive_message', { message, senderId, room });
  
    // Find the receiver's socket and emit the message directly to that socket
    const receiverSocket = Array.from(io.sockets.sockets.values()).find(
      (socket) => socket.data.userId === data.receiverId
    );
  
    if (receiverSocket) {
      receiverSocket.emit('receive_message', { message, senderId, room });
    }
  
    // Store the message in the database
    try {
      const messageData = {
        message: message,
        sender_id: senderId,
        room: room,
        id: uuidv4(),
        receiver_id: data.receiverId,
      };
      const createdMessage = await ChatMessage.create(messageData);
      console.log('Message stored in the database:', createdMessage);
    } catch (error) {
      console.error('Failed to store message in the database:', error);
    }
  });
  
  // Event handler for disconnections
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Route for sending chat messages via HTTP
router.post('/message', async (req: Request, res: Response) => {
  const { message, receiverFirstName, receiverLastName } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  let senderId;

  try {
    const decodedToken = jwt.verify(token, jwtSecret);
    senderId = (decodedToken as JwtPayload).id;
  } catch (error) {
    console.error('Failed to verify token:', error);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  const room = uuidv4();

  try {
    // Get the receiver based on the first name and last name
    const receiver = await User.findOne({
      where: {
        firstName: receiverFirstName,
        lastName: receiverLastName,
      },
    });

    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Receiver not found' });
    }

    const receiverId = receiver.id;

    const messageData = {
      message: message,
      sender_id: senderId,
      room: room,
      id: uuidv4(),
      receiver_id: receiverId,
    };

    // Emit the message to the room via socket.io
    io.to(room).emit('receive_message', { message, senderId, room });

    // Store the message in the database
    const createdMessage = await ChatMessage.create(messageData);
    console.log('Message stored in the database:', createdMessage);

    res.json({ success: true, message: 'Message sent and stored successfully' });
  } catch (error) {
    console.error('Failed to send or store message:', error);
    res.status(500).json({ success: false, message: 'Failed to send or store message' });
  }
});

// Route for fetching messages for a specific receiver
router.get('/receiverMessages', async (req: Request, res: Response) => {
  const { receiverFirstName, receiverLastName } = req.query;

  try {
    // Retrieve the receiver based on the first name and last name
    const receiver = await User.findOne({
      where: {
        firstName: receiverFirstName as string,
        lastName: receiverLastName as string,
      } as WhereOptions<UserAttributes>,
    });

    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Receiver not found' });
    }

    const receiverId = receiver.id;

    // Retrieve all messages sent to or received by the receiver with associated user information
    const messages = await ChatMessage.findAll({
      where: {
        [Op.or]: [
          { receiver_id: receiverId }, // Messages received by the receiver
          { sender_id: receiverId }, // Messages sent by the receiver
        ],
      },
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'profilePhoto'],
        },
      ],
    });

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Failed to retrieve receiver messages:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve receiver messages' });
  }
});


router.get('/allMessages', async (req: Request, res: Response) => {
  try {
    // Retrieve all messages with associated user information
    const messages = await ChatMessage.findAll({
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'profilePhoto'],
        },
      ],
    });

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Failed to retrieve messages:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve messages' });
  }
});

export { router, socketapi };