import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import User from './registerModel';

export interface GroupAttributes {
  id: string;
  userId: string;
  groupName: string;
  about: string;
  users: string[];
}

class Group extends Model<GroupAttributes> implements GroupAttributes {
  id!: string;
  userId!: string;
  groupName!: string;
  about!: string;
  users!: string[];
  createdAt!: Date;
  updatedAt!: Date;
}

Group.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    groupName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    users: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'Group',
    timestamps: true,
  }
);



export default Group;
