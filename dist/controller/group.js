"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinGroup = exports.getGroupById = void 0;
const uuid_1 = require("uuid");
const groupModel_1 = __importDefault(require("../model/groupModel"));
const registerModel_1 = __importDefault(require("../model/registerModel"));
const createGroup = async (req, res) => {
    const { groupName, about } = req.body;
    if (!groupName) {
        return res.status(400).json({ error: 'Group Name is required' });
    }
    if (!about) {
        return res.status(400).json({ error: 'About is required' });
    }
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ error: 'You are not allowed to create a group' });
        }
        const groupData = {
            id: (0, uuid_1.v4)(),
            groupName,
            about,
            userId,
            users: [],
        };
        const group = await groupModel_1.default.create(groupData);
        return res.status(201).json({
            group,
            message: `${groupName} has been created`,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server Error' });
    }
};
const getAllGroups = async (req, res) => {
    try {
        const groups = await groupModel_1.default.findAll({
            include: {
                model: registerModel_1.default,
                as: 'User', // Specify the alias for the association
            },
        });
        return res.status(200).json({
            message: 'All groups have been successfully fetched',
            result: groups,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: err,
        });
    }
};
const getGroupById = async (req, res) => {
    const groupId = req.params.id;
    try {
        const group = await groupModel_1.default.findOne({ where: { id: groupId } });
        if (!group) {
            return res.status(404).json({
                message: 'Group not found',
            });
        }
        return res.status(200).json({
            group,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            err: 'Server Error',
        });
    }
};
exports.getGroupById = getGroupById;
const joinGroup = async (req, res) => {
    const groupId = req.body.id;
    console.log(groupId); // Check if the groupId matches the expected value
    try {
        const group = await groupModel_1.default.findByPk(groupId);
        console.log(group); // Check the retrieved group object
        if (!group) {
            return res.status(404).json({
                message: 'Group not found',
            });
        }
        if (group.users.includes(req.user.id)) {
            return res.status(400).json({
                message: 'You are already a member of the group',
            });
        }
        // Add the user ID to the users array
        group.users.push(req.user.id);
        group.updatedAt = new Date(); // Update the updatedAt field
        await group.save();
        return res.status(200).json({
            message: 'You have joined the group successfully',
            group: {
                id: group.id,
                userId: req.user.id,
                groupName: group.groupName,
                about: group.about,
                users: group.users,
                createdAt: group.createdAt,
                updatedAt: group.updatedAt,
            },
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Server Error',
        });
    }
};
exports.joinGroup = joinGroup;
const leaveGroup = async (req, res) => {
    const groupId = req.params.id;
    const userId = req.user;
    try {
        const group = await groupModel_1.default.findOne({ where: { id: groupId } });
        if (!group) {
            return res.status(404).json({
                message: 'Group not found',
            });
        }
        if (!group.users.includes(userId)) {
            return res.status(404).json({
                message: 'You are not a member of this group',
            });
        }
        group.users = group.users.filter((id) => id !== userId);
        await group.save();
        return res.status(200).json({
            message: 'You have left the group successfully',
            group,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            err: 'Server Error',
        });
    }
};
module.exports = {
    getAllGroups,
    createGroup,
    getGroupById: exports.getGroupById,
    joinGroup: exports.joinGroup,
    leaveGroup,
};
