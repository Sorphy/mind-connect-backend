import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Group, { GroupAttributes } from '../model/groupModel';
import User from '../model/registerModel';

const createGroup = async (req: Request, res: Response) => {
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

    const userId = (req.user as { id: string }).id;

    if (!userId) {
      return res.status(401).json({ error: 'You are not allowed to create a group' });
    }

    const groupData: GroupAttributes = {
      id: uuidv4(),
      groupName,
      about,
      userId,
      users: [],
    };

    const group = await Group.create(groupData);

    return res.status(201).json({
      group,
      message: `${groupName} has been created`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server Error' });
  }
};



const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await Group.findAll({
      include: {
        model: User,
        as: 'User', // Specify the alias for the association
      },
    });

    return res.status(200).json({
      message: 'All groups have been successfully fetched',
      result: groups,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err,
    });
  }
};



 export const getGroupById = async (req: Request, res: Response) => {
  const groupId = req.params.id;
  try {
    const group = await Group.findOne({
      where: { id: groupId },
      attributes: ['groupName', 'id', 'userId', 'about', 'users', 'createdAt', 'updatedAt'],
    });

    if (!group) {
      return res.status(404).json({
        message: 'Group not found',
      });
    }

    return res.status(200).json({
      group,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Server Error',
    });
  }
};


export const joinGroup = async (req: Request & { user: { id: string } }, res: Response) => {
    const groupId = req.body.id;
    console.log(groupId); // Check if the groupId matches the expected value
  
    try {
      const group = await Group.findByPk(groupId);
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
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Server Error',
      });
    }
  };
  



const leaveGroup = async (req: Request|any, res: Response) => {
  const groupId = req.params.id;
  const userId = req.user as string;
  try {
    const group = await Group.findOne({where:{id:groupId}});
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
    group.users = group.users.filter((id: string) => id !== userId);
    await group.save();
    return res.status(200).json({
      message: 'You have left the group successfully',
      group,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err: 'Server Error',
    });
  }
};


module.exports = {
  getAllGroups,
  createGroup,
  getGroupById,
  joinGroup,
  leaveGroup,
};