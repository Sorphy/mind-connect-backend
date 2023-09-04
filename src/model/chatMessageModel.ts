import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import User from './registerModel'; // Import the User model
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 from the uuid package

export interface ChatMessageAttributes {
  id: string;
  message: string;
  sender_id: string;
  receiver_id: string;
  room: string;
}

class ChatMessage extends Model<ChatMessageAttributes> implements ChatMessageAttributes {
  id!: string;
  message!: string;
  sender_id!: string;
  receiver_id!: string;
  room!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

ChatMessage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: 'id',
      },
    },
    receiver_id: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: 'id',
      },
    },
    room: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: uuidv4(), // Generate a unique room identifier using uuidv4 during model creation
    },
  },
  {
    sequelize,
    modelName: 'ChatMessage',
    timestamps: true,
  }
);

ChatMessage.belongsTo(User, { foreignKey: 'sender_id' });
User.hasMany(ChatMessage, { foreignKey: 'sender_id' });
User.hasMany(ChatMessage, { foreignKey: 'receiver_id' }); // Add the association for receiver_id

export default ChatMessage;
