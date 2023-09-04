
const express = require('express');
const router = express.Router();
const { createGroup, getGroupById, joinGroup, leaveGroup, getAllGroups } = require('../controller/group');
const { authenticatedUser } = require('../middleware/index');


router.get('/all', getAllGroups);
router.post('/create-group', authenticatedUser, createGroup);
router.get('/group/:id', getGroupById);
router.post('/group/:id/join', authenticatedUser, joinGroup);
router.post('/group/:id/leave', authenticatedUser, leaveGroup);

module.exports = router;


