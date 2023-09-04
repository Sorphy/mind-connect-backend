import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import Post from './postModel'; // Import the Post model
import User from './registerModel'; // Import the User model
import Group from './groupModel';

export interface CommentAttributes {
  id: string;
  comment: string;
  like: string[];
  user_id: string;
  post_id: string;
  groupId: string | null;
}

class Comment extends Model<CommentAttributes> implements CommentAttributes {
  id!: string;
  comment!: string;
  like!: string[];
  user_id!: string;
  post_id!: string;
  groupId!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    like: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    user_id: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: 'id',
      },
    },
    post_id: {
      type: DataTypes.UUID,
      references: {
        model: Post,
        key: 'id',
      },
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Group,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Comment',
    timestamps: true,
  }
);

Comment.belongsTo(Post, { foreignKey: 'post_id' });
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Comment, { foreignKey: 'user_id' });

export default Comment;