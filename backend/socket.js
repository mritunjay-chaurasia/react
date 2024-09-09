const { io } = require("./server");
const UpdateComments = require('./app/models/updateComment.model');
const User = require('./app/models/user.model');
const UsersNotification = require("./app/models//usersNotification.model");

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('joinMyRoom', (myId) => {
        socket.join(myId);
    })

    socket.on('joinOrgRoom', (orgId) => {
        socket.join(orgId)
    })

    socket.on('orgInviteJoined', (orgId) => {
        io.to(orgId).emit('refetchInviteList')
    })

    socket.on('userOrgActionChanged', (userId) => {
        io.to(userId).emit('invitedUserOrgActionChanged')
    })

    socket.on('disconnect', () => {
        console.log('Cllient disconnected');
    });

  /**
   * this function send updated message to all the members of Project
   * @params : projectId : id
   * @response : {void}
   * @author : Mritunjay chaurasia
   **/

    socket.on("notified-all-users", async (data) => {
        io.emit("all-users-notified",data);
    })
});
