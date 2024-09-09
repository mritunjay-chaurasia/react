const UsersNotification = require("../models//usersNotification.model");
const { allEmailTypes, allKeysForEmail } = require('../constants');
const { prepareAndSendMail } = require('../services/email.service');
const UserProject = require('../models/userprojects.model');
const User = require('../models/user.model');
const { Op } = require('sequelize');
const WorkOrderHistory = require('../models/workOrderHistory.model');

module.exports.addUsersNotification = async (req, res) => {
  try {
    const { projectId,type, notifiedUserId,message,workOrderId} = req.body;
    if (!projectId || !type) {

      return res.status(400).json({ status: false, message: "Bad Request" });
    }


 let workOrder;
  if(workOrderId){
    workOrder = await WorkOrderHistory.findOne({
      where: {
          id: workOrderId
      }
    });
  }
  const notifiedTo = {
      id:notifiedUserId,
      workOrderId: workOrder?.dataValues?.workOrderId,
      message:message,
  }

    let userNotification = await UsersNotification.create({
      projectId: projectId,
      notifiedBy:req.user.id,
      type,
      notifiedUsers:[req.user.id],
      notifiedTo
    });
  

    // Email will be sent all PointUsers for only comments update
   if(userNotification && userNotification?.dataValues && userNotification?.dataValues?.type === 'comments' ){
    const ticketProject = await UserProject.findOne({
      where: {
          id: projectId
      }
    })
    

    const userIds = ticketProject.selectedPointUsers || [];
    userIds.push(req.user.id);

    const users = await User.findAll({
        where: { id: userIds }
    });
      const sendToUsers = users && users.length > 0 && users.filter(user => !req.user.id.includes(user?.dataValues.id));
      sendToUsers.forEach(user => {
        let keysAndValues = {
          [allKeysForEmail.KEYFOR_USERFNAME]: `${user.firstname} ${user.lastname}`,
          [allKeysForEmail.KEYFOR_COMMENT_BY_USER]: `${req.user.firstname} ${req.user.lastname}`,
          [allKeysForEmail.KEYFOR_TASK_COMMENT]: message,
          [allKeysForEmail.KEYFOR_WORK_ORDER_LINK]: `${process.env.CLIENT_URL}/updates`,
        };
            prepareAndSendMail(
              user.emailid,
              allEmailTypes.EMAIL_TYPE_UPDATE_NOTIFICATION,
              keysAndValues
          );
      });

   }
    return res.status(200).json({
      status: true,
      message: "Notification updated or created successfully",
      userNotification: userNotification,
    });

  } catch (error) {
    console.log("Error While Saving addUsersNotifications ::: ", error);
    return res.status(500).json({
      status: false,
      message: "Error While Saving UsersNotification",
      error: error,
    });
  }
};


module.exports.fetchUsersNotification = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ status: false, message: "Bad Request" });
    }

    // Calculate the date 5 days ago from today
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const usersNotification = await UsersNotification.findAll({
      include: [
        { foreignKey: "notifiedBy", model: User, as: 'commentBy' }
      ],
      where: {
        projectId,
        createdAt: {
          [Op.gte]: fiveDaysAgo // Only include notifications created within the last 5 days
        }
      },
      order: [['createdAt', 'DESC']] 
    });
      
    const userId = req.user.id;

    const filteredNotifications = usersNotification && usersNotification.length > 0 &&  usersNotification.filter(notification => 
      notification?.dataValues?.notifiedTo?.id.includes(userId)
    ) || [];
    

    const totalUnread = filteredNotifications && filteredNotifications.length > 0 && filteredNotifications.filter(notification =>
      !notification?.dataValues?.notifiedUsers.includes(userId)
    );
    
    
    const count = totalUnread.length;

    return res.status(200).json({
      status: true,
      count: count,
      userNotifications: filteredNotifications
    });

  } catch (error) {
    console.log("Error in usersNotification Controller function: ", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong, Please try again later.",
    });
  }
};


module.exports.updateUserNotification = async (req, res) => {
  try {
    const { projectId, type } = req.body;

    if (!projectId) {
      return res.status(400).json({ status: false, message: "Bad Request" });
    }

    // Define the where clause based on the presence of type
    const whereClause = type ? { projectId, type } : { projectId };

    // Fetch the notifications based on the where clause
    const notifications = await UsersNotification.findAll({
      where: whereClause,
    });

    for (let notification of notifications) {
      let notifiedUsers = notification.dataValues.notifiedUsers || [];
      // Push req.user.id if it is not already in the notifiedUsers array
      if (!notifiedUsers.includes(req.user.id)) {
        notifiedUsers.push(req.user.id);
        // Update the notification with the new notifiedUsers array
        await UsersNotification.update(
          { notifiedUsers: notifiedUsers },
          { where: { id: notification.id } }
        );
      }
    }

    res.status(200).json({
      status: true,
      message: "Notification updated successfully",
    });

  } catch (error) {
    console.log("Error in usersNotification Controller function: ", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong, Please try again later.",
    });
  }
};

