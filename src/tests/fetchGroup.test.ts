// import { getGroupById } from '../controller/group';
// import Group from '../model/groupModel';

// describe('getGroupById', () => {
//   test('should return the group if found', async () => {
//     // Mock the request and response objects
//     const req = { params: { id: 'groupId' } };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     // Mock the Group.findOne() method to return a mock group
//     jest.spyOn(Group, 'findOne').mockResolvedValue({ id: 'groupId', name: 'Group 1' });

//     // Call the controller function
//     await getGroupById(req, res);

//     // Expectations
//     expect(Group.findOne).toHaveBeenCalledWith({ where: { id: 'groupId' } });
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ group: { id: 'groupId', name: 'Group 1' } });
//   });

//   test('should return a 404 error if group is not found', async () => {
//     // Mock the request and response objects
//     const req = { params: { id: '2' } };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     // Mock the Group.findOne() method to return null
//     jest.spyOn(Group, 'findOne').mockResolvedValue(null);

//     // Call the controller function
//     await getGroupById(req, res);

//     // Expectations
//     expect(Group.findOne).toHaveBeenCalledWith({ where: { id: '2' } });
//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.json).toHaveBeenCalledWith({ message: 'Group not found' });
//   });

//   test('should return a 500 error if an error occurs', async () => {
//     // Mock the request and response objects
//     const req = { params: { id: 'groupId' } };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     // Mock the Group.findOne() method to throw an error
//     jest.spyOn(Group, 'findOne').mockRejectedValue(new Error('Database error'));

//     // Call the controller function
//     await getGroupById(req, res);

//     // Expectations
//     expect(Group.findOne).toHaveBeenCalledWith({ where: { id: 'groupId' } });
//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({ err: 'Server Error' });
//   });
// });
