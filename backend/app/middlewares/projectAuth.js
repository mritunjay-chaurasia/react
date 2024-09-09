const User = require('../models/user.model');
const { parseJWT } = require('../controllers/jwt.controller');
const CryptoJS = require('crypto-js');

const projectAuth = async (req, res, next) => {
    let projectToken = req.headers.authorization;
    if (projectToken) {
        try {
            let token = projectToken.split(" ")[1];
            const decryptedBytes = CryptoJS.AES.decrypt(token, process.env.PROJECT_SECRET_KEY);
            const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

            console.log("decryptedData", decryptedData)

            const user = await User.findOne({
                where: { id: decryptedData.userId }
            });
            if (user) {
                req.user = user;
                req.projectId = decryptedData.projectId
                return next();
            }
            else return res.status(401).json({ status: false, message: "No user or project found!" });

        } catch (err) {
            console.log(err)
            return res.status(401).json({ status: false, message: "No user or project found!" });
        }
    }
    return res.status(401).json({ status: false, message: "No user or project found!" });
}

module.exports = projectAuth;