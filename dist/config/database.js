"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequelize = exports.sequelize = exports.connectDb = void 0;
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "Sequelize", { enumerable: true, get: function () { return sequelize_1.Sequelize; } });
const POSTGRES_URL = process.env.DB_URL;
const sequelize = new sequelize_1.Sequelize(POSTGRES_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});
exports.sequelize = sequelize;
const connectDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('connection established successfully');
    }
    catch (error) {
        console.log('Unable to connect with database', error);
    }
};
exports.connectDb = connectDb;
