"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const registerModel_1 = __importDefault(require("./registerModel"));
class Group extends sequelize_1.Model {
}
Group.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: registerModel_1.default,
            key: 'id',
        },
    },
    groupName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    about: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    users: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
        defaultValue: [],
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'Group',
    timestamps: true,
});
exports.default = Group;
