"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const postModel_1 = __importDefault(require("./postModel")); // Import the Post model
const registerModel_1 = __importDefault(require("./registerModel")); // Import the User model
const groupModel_1 = __importDefault(require("./groupModel"));
class Comment extends sequelize_1.Model {
}
Comment.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    comment: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    like: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
    },
    user_id: {
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: registerModel_1.default,
            key: 'id',
        },
    },
    post_id: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: postModel_1.default,
            key: 'id',
        },
    },
    groupId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: groupModel_1.default,
            key: 'id',
        },
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'Comment',
    timestamps: true,
});
Comment.belongsTo(postModel_1.default, { foreignKey: 'post_id' });
postModel_1.default.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' });
Comment.belongsTo(registerModel_1.default, { foreignKey: 'user_id' });
registerModel_1.default.hasMany(Comment, { foreignKey: 'user_id' });
exports.default = Comment;
