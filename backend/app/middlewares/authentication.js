const User = require('../models/user.model');
const { parseJWT } = require('../controllers/jwt.controller');

const authentication = async (req, res, next) => {
    let authToken = req.headers.authorization;
      if(authToken) {
        try {
            let token = authToken.split(" ")[1];
            const decoded = parseJWT(token)
            const { id } = decoded;
            const user = await User.findOne({
                where: { id }
            });
            
            if(user) {
                req.user = user;
                req.userToken = token;
                return next();
            }
            else return res.status(401).json({'success':false,'message':'Unauthorised'});

        } catch(err) {
            return res.status(401).json({'success':false,'message':'Unauthorised'});
        }
    }
    return res.status(401).json({'success':false,'message':'Unauthorised'});
}

module.exports = authentication
