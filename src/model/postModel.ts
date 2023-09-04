import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import User from './registerModel';
import Group from './groupModel';

export interface PostAttributes {
  id: string;
  userId: string;
  groupId: string | null;
  postContent: string;
  image: string[]; 
  video: string[];
  file: string[]; 
  like: string[];
  comment: number;
  reply:number;
  report: number;
  visible: any;
}

class Post extends Model<PostAttributes> implements PostAttributes {
  id!: string;
  userId!: string;
  groupId!: string | null; // New field for group association
  postContent!: string;
  image!:  string[];
  video!:  string[];
  file!: string[]; 
  like!: string[];
  comment!: number;
  reply!: number;
  report!: number;
  visible: any;

}

Post.init(
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
    groupId: {
      type: DataTypes.UUID, // Change the data type to UUID
      allowNull: true,
      references: {
        model: Group,
        key: 'id',
      },
    },
    postContent: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    video: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    file: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    like: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    comment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    reply: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    report: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Post',
    timestamps: true,
  }
);

User.hasMany(Post, { foreignKey: 'userId', as: 'Posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'User' });
export default Post;
