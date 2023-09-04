import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import Group from './groupModel';

export interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mentalCondition: string;
  country: string;
  state: string;
  gender: string;
  password: string;
  otp: any | null;
  otp_expiry: Date | null;
  verify: boolean | null;
  blocked: string[];
  profilePhoto: string;
}

class User extends Model<UserAttributes, UserAttributes> implements UserAttributes {
  otp: any;
  otp_expiry: any;
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  mentalCondition!: string;
  country!: string;
  state!: string;
  gender!: string;
  password!: string;
  verify!: boolean | null;
  blocked: string[] = [];
  profilePhoto!: string;
}

User.init(
  {
    id: {
      type: DataTypes.STRING, // corrected type from DataTypes.UUIDV4 to DataTypes.STRING
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mentalCondition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    otp_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verify: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    blocked: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600', 
    },

  },
  {
    sequelize,
    modelName: 'User',
    timestamps: true,
  }
);

User.hasMany(Group, { foreignKey: 'userId', as: 'Groups' });
Group.belongsTo(User, {foreignKey: "userId", as: "User"})

export default User;