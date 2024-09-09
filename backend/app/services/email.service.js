const EmailFormat = require("../models/EmailFormat.model");
const sgMail = require("@sendgrid/mail");

/**
* This Function Start All Types Of Email Sending It Fetch Email Performa from database and send it to create 
final body after that it send created final body to send message
* @params = recipientEmail(Type:String),  
emailType(Type:String) what kind of email it is ex :forgetPassword,verifyUser
dynamicTemplateData(type: Objects) key and value needs to replace in string
* @response : None
* @author : Mandeep Singh & Milan Rawat
*/
module.exports.prepareAndSendMail = async (
    recipientEmail,
    emailType,
    dynamicTemplateData
) => {
    console.log(
        "data Received In Start Sending Mail ----> \n",
        recipientEmail,
        emailType,
        dynamicTemplateData
    );

    try {
        const emailData = await getEmailData(emailType);
        if (emailData) {
            let sgTemplateId = emailData.sgEmailTemplateId;
            sendSGMail(sgTemplateId, recipientEmail, dynamicTemplateData);
        }
    } catch (error) {
        console.log("error while prepareAndSendMail ", error);
    }
};

/**
 * Final Function which send email to  provided receipent email adress
 * @params =  sgTemplateId(type:String), recipientEmail(Type:String),dynamicTemplateData(type:Object)
 * @response : None
 * @author : Mandeep Singh & Milan Rawat
 */
const sendSGMail = (sgTemplateId, recipientEmail, dynamicTemplateData) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        from: process.env.FROM_EMAIL_ADDRESS,
        personalizations: [
            {
                to: recipientEmail,
                dynamic_template_data: dynamicTemplateData,
            },
        ],
        template_id: sgTemplateId,
    };

    sgMail
        .send(msg)
        .then((response) => {
            console.log("Email sent and response is ", response);
        })
        .catch((error) => {
            console.error("Error While Sending Email:::::", error);
            console.error("Error While Sending Email::::: 2", error.response.body);
        });
};

/**
 * This Function fetch performa (email body) from database according to provided email type
 * @params = emailType(type:string)
 * @response : return as rough body fetched from database
 * @author : Mandeep Singh & Milan Rawat
 */
const getEmailData = async (emailType) => {
    try {
        const emailData = await EmailFormat.findOne({
            where: { emailType: emailType },
        });

        if (!emailData) {
            console.log(`Cant Find Body with emailType ${emailType}`);
            return null;
        } else {
            return emailData;
        }
    } catch (error) {
        console.log("Error While Getting Email Body", error);
    }
};

/**
 * This Function save rough email bodies to database
 * @params = req and res
 * @response : returns api response
 * @author : Mandeep Singh & Milan Rawat
 */
module.exports.saveToEmailTypesSchema = async (req, res) => {
    try {
        const { emailType, sgEmailTemplateId } = req.body;
        const findEmailType = await EmailFormat.findOne({
            where: { emailType: emailType },
        });
        if (findEmailType) {
            return res
                .status(409)
                .json({ status: false, message: "Email Type Already Exists" });
        }
        const newEmailFormat = new EmailFormat({
            emailType: emailType,
            sgEmailTemplateId: sgEmailTemplateId,
        });

        const createdEmailFormat = await newEmailFormat.save();
        return res
            .status(200)
            .json({
                status: true,
                message: "Successfully Saved",
                emailFormat: createdEmailFormat,
            });
    } catch (error) {
        console.log("error while saving email type:::: ", error);
        return res.status(500).json({
            status: false,
            message: "Error While Saving Email Type :",
            error,
        });
    }
};
