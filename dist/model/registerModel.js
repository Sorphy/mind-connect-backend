"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const groupModel_1 = __importDefault(require("./groupModel"));
class User extends sequelize_1.Model {
    constructor() {
        super(...arguments);
        this.blocked = [];
    }
}
User.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    mentalCondition: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    otp: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    otp_expiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    verify: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    blocked: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
    },
    profilePhoto: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'User',
    timestamps: true,
});
User.hasMany(groupModel_1.default, { foreignKey: 'userId', as: 'Groups' });
groupModel_1.default.belongsTo(User, { foreignKey: "userId", as: "User" });
exports.default = User;
