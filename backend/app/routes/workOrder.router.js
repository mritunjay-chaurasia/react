const { Router } = require('express');
const { createWorkOrder, getOrgWorkOrderList, changeWorkOrderStatus, getAllOrgUsers, assignTicketToUser, getOrgWorkOrder, regenerateWorkOrder, keepMultipleFileInReq, updateTicket, getWorkOrderHistory } = require('../controllers/workOrderHistory.controller');
const authentication = require('../middlewares/authentication');
const { addComment } = require('../controllers/workOrderComment.controller');
const workorder = Router();

workorder.post('/createWorkOrder', authentication, keepMultipleFileInReq.array('files'), createWorkOrder);
workorder.get('/getOrgWorkOrderList', authentication, getOrgWorkOrderList);
workorder.get('/getWorkOrderHistory', authentication, getWorkOrderHistory);
workorder.get('/getOrgWorkOrder', authentication, getOrgWorkOrder);
workorder.get('/regenerateWorkOrder', authentication, regenerateWorkOrder);
workorder.post('/changeWorkOrderStatus', authentication, changeWorkOrderStatus);
workorder.get('/getAllOrgUsers', authentication, getAllOrgUsers);
workorder.post('/assignTicketToUser', authentication, assignTicketToUser);
workorder.post('/updateTicket', authentication, keepMultipleFileInReq.array('files'), updateTicket);
// WorkOrder Comments
workorder.post('/comment/addComment', authentication,keepMultipleFileInReq.array('files'), addComment);

module.exports = workorder;