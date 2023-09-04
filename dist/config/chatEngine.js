"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// // Create a Socket.IO server instance
// const io = new Server();
// // Event handler for new connections
// io.on('connection', (socket: Socket) => {
//   console.log('A new client connected');
//   // Event handler for disconnections
//   socket.on('disconnect', () => {
//     console.log('A client disconnected');
//   });
// });
// export default io;
const io = require("socket.io")();
const socketapi = {
    io: io
};
// Event handler for new connections
io.on("connection", (socket) => {
    console.log("A new client connected", socket.id);
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`user with Id ${socket.id}joined room:${data}`);
    });
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });
    // Event handler for disconnections
    socket.on("disconnect", () => {
        console.log("A client disconnected");
    });
});
exports.default = socketapi;
