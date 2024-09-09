const User = require("../models/user.model");
const UserTool = require("../models/userTools.model");
const OrgUser = require("../models/orgusers.model");
const UserProject = require("../models/userprojects.model");
const ToolsMaster = require("../models/toolsmaster.model");

const { parseJWT } = require("./jwt.controller");
const axios = require("axios");
const FormData = require("form-data");
const OrgToken = require("../models/orgTokens.model");
const multer = require("multer");
const nodegit = require('nodegit');
const path = require("path");
const fs = require('fs');
const myfs = require('fs').promises;
const fsextra = require('fs-extra');
const FunctionData = require("../models/functionData.model");
const BusinessDocumentation = require("../models/businessDocumentation.model");
const { allKeysForEmail, allEmailTypes } = require("../constants");
const { prepareAndSendMail } = require("../services/email.service");
const { saveAndExtractZip } = require("./readFolder.controller");
const AdmZip = require('adm-zip');
const { execSync, exec } = require('child_process');
const zlib = require('zlib');



const storage = multer.memoryStorage();
module.exports.keepFileInReq = multer({ storage: storage });


function readFolderRecursive(folderPath, projectId) {
    const stat = fs.statSync(folderPath);
    if (!stat.isDirectory()) {
        return null;
    }

    const folderName = path.basename(folderPath);
    const folderContent = fs.readdirSync(folderPath);

    const folderObj = {
        name: folderName,
        path: folderPath.split(`project_${projectId}/`)[1],
        content: folderContent.map(item => {
            const itemPath = path.join(folderPath, item);
            const itemStat = fs.statSync(itemPath);
            if (itemStat.isDirectory()) {
                return readFolderRecursive(itemPath, projectId);
            } else {
                return {
                    name: item,
                    path: itemPath.split(`project_${projectId}/`)[1],
                    content: fs.readFileSync(itemPath, 'utf8')
                };
            }
        })
    };

    return folderObj;
}



// Retrieve tool list
module.exports.getProjectTools = async (req, res) => {
    try {
        if (!req.query.projectid) {
            return res.status(400).json({
                status: false,
                message: "Project Id required in query",
            });
        }
        // Get tools by orgid
        const tools = await UserTool.findAll({
            where: { project: req.query.projectid },
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({ status: true, tools: tools });
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ status: false, message: "Some error occurred while retreiving tools." });
    }
};

module.exports.updateVector = async (req, res) => {
    try {
        if (req.body.project) {
            axios.patch(process.env.LANGCHAIN_URL + '/update_vector', req.body)
            return res.status(200).json({ status: true, tools: "success" });
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ status: false, message: e })
    }
}

// Configure a tool
module.exports.addUserTool = async (req, res) => {
    // Extract data from request
    let userToolId = "";
    try {
        req.body = req?.body?.toolMaster ? req.body : JSON.parse(req.body.data);
        const orgToken = await OrgToken.findOne({
            where: {
                projectid: req?.body?.project,
            },
        });
        console.log("REQ BODY>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", orgToken)
        if (!orgToken?.openapikey) {
            return res.status(401).json({
                status: false,
                message: "Add Open AI key for this project.",
            });
        }
        const {
            toolMaster,
            icon,
            project,
            pluginType,
            pluginTypeName,
            pluginName,
            pluginDescription,
            connectionDate,
            statusChangeDate,
            pluginDetails,
            projectCodeType,
            emailId,
            githubUrl,
        } = req.body;
        if (
            !toolMaster ||
            !project ||
            !pluginType ||
            !pluginName ||
            !connectionDate ||
            !statusChangeDate ||
            !pluginDetails ||
            !projectCodeType
        ) {
            return res.status(400).json({
                status: false,
                message: "All fields are required!",
                data: req.body,
            });
        }
        
        ownerName = ""
        repoName = ""

        if(githubUrl) {                    
            //getting owner name
            const usernameMatch = githubUrl.match(/github\.com\/([^/]+)/);
            ownerName = usernameMatch ? usernameMatch[1] : null;

            //getting repoName
            const repoMatch = githubUrl.match(/\/([^/]+)\.git$/);
            repoName = repoMatch ? repoMatch[1] : null;
        }

        // Add a new usertool to `userTools` table
        const usertool = await UserTool.create({
            toolMaster,
            ownerName,
            repoName,
            icon,
            project,
            pluginType,
            pluginTypeName,
            pluginName,
            pluginDescription,
            connectionDate,
            statusChangeDate,
            pluginDetails,
            documentationStatus: "Uploading",
            nodeProject: projectCodeType === "nodejs" ? true : false,
            reactProject: projectCodeType === "reactjs" ? true : false,
        });
        userToolId = usertool.id;
        if (pluginType === "UrlTool" || pluginType === "YouTubeTool" || pluginType === "DocumentTool") {
            let endPoint = "";
            let id = usertool.id;
            let projectId = project;
            let url = "";
            let keyName = "";
            let bodyData = {};
            if (pluginType === "UrlTool") {
                url = pluginDetails.urls;
                keyName = "url";
                endPoint = "load_url";
                bodyData = { id: id, projectId: projectId, [keyName]: url };
            }
            if (pluginType === "YouTubeTool") {
                url = pluginDetails.youtube_url;
                keyName = "youtube_url";
                endPoint = "load_youtube_url";
                bodyData = { id: id, projectId: projectId, [keyName]: url };
            }
            if (pluginType === "DocumentTool") {

                //Calling Save Zip And Extract Zip
                console.log("\nCalled saveAndExtractZip", req.file);
                let fileBuffer = req.file.buffer;
                if (pluginDetails.github_url && pluginDetails.github_branch) {
                    let name = req.file.originalname
                    const zipFilePath = `./public/gitClones/project_${projectId}/${name}.zip`;
                    // const folderPath = `./public/gitClones/project_${projectId}`;
                    // const zipFilePath = `${folderPath}/${zipName}.zip`;

                    
                    let data = await fs.promises.readFile(zipFilePath);
                    if (data) fileBuffer = data
                } else {
                    let name = req.file.originalname
                    const outputFolder = `./public/gitClones/project_${projectId}`;
                    const zipFilePath = `${outputFolder}/${name}.zip`;
                    await fsextra.writeFile(zipFilePath, fileBuffer);

                    try {
                        const zip = new AdmZip(zipFilePath);
                        zip.extractAllTo(outputFolder, true); // true to overwrite existing files
                    } catch (err) {
                        throw err;
                    }

            
                    await fs.promises.unlink(zipFilePath);
                }
                console.log("fileBufferrrrr", fileBuffer)
                saveAndExtractZip(projectId, projectCodeType, fileBuffer, id, (req.file.originalname.substring(0, req.file.originalname.lastIndexOf('.')) || req.file.originalname));
                endPoint = "create_collection";
                var formdata = new FormData();
                formdata.append("file", fileBuffer, req.file.originalname);
                formdata.append("toolId", id);
                formdata.append("projectId", projectId);
                formdata.append("projectCodeType", projectCodeType);
                formdata.append("projectId", projectId);
                formdata.append(
                    "request",
                    JSON.stringify({
                        id: id,
                        projectId: projectId,
                        authentication: req.headers.authorization,
                    })
                );
                formdata.append("emailId", emailId);
                formdata.append("pluginName", pluginName);

                //await removed
                const response = axios.post(`${process.env.LANGCHAIN_URL}/${endPoint}`, formdata);
                console.log("hhhhhhhhhhhhhh", response)
                // if (response && response.data && response.data.success) {
                return res.status(201).json({
                    status: true,
                    usertool: usertool,
                });
                // } else {
                //     throw new Error(
                //         response?.data?.message ? response.data.message : "Something went wrong!"
                //     );
                // }
            }
            const response = await axios.post(`${process.env.LANGCHAIN_URL}/${endPoint}`, bodyData, {
                headers: { authentication: req.headers.authorization },
            });
            if (response && response.data && response.data.success) {
                return res.status(201).json({ ...response.data, status: true, usertool: usertool });
            } else {
                throw new Error(response?.data?.message ? response.data.message : "Something went wrong!");
            }
        }
        res.status(201).json({
            status: true,
            usertool: usertool,
        });
    } catch (e) {
        console.log("ggggggg", e)
        let errMessage = "Some error occured while creating tool!";
        if (e.message === "Error occured while loading urls" ||
            e.message === "Error occured while loading youtube url"
        );

        {
            await UserTool.destroy({
                where: {
                    id: userToolId,
                },
            });
            errMessage = e.message;
        }
        return res.status(500).json({ status: false, message: errMessage });
    }
};

// Get tool by toolid
module.exports.getTool = async (req, res) => {
    // Extract data from request
    const { toolid } = req.params;

    if (!toolid) return res.status(500).json({ message: "toolid must be given" });

    try {
        // Get usertools by orgid
        const tool = await ToolsMaster.findAll({
            where: {
                id: toolid,
            },
        });

        return res.json(tool);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Some error occurred while getting tool." });
    }
};

// Get tools by projectId
module.exports.getUserTool = async (req, res) => {
    // Extract data from request
    const { projectId } = req.params;
    const { id } = req.params;
    const whereClause = {};
    if (id) {
        whereClause.id = id;
    } else {
        whereClause.project = projectId;
    }

    if (!projectId) return res.status(500).json({ message: "projectId must be given" });

    try {
        // Get usertools by projectId
        const usertools = await UserTool.findAll({
            where: whereClause,
        });

        return res.json(usertools);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Some error occurred while getting usertools." });
    }
};

//Update usertool
module.exports.update = async (req, res) => {
    // Extract data from request
    const { token, toolid, toolconf } = req.body;

    if ((!toolconf, !toolid)) return res.json({ message: "toolid and toolconf must be given." });

    const { status, Connectiondate, statusChangeDate } = toolconf;

    // Pars JWT
    const decoded = await parseJWT(token);

    if (typeof decoded === "string") {
        return res.status(400).json({ message: decoded });
    } else {
        try {
            // Update usertools with extracted data
            const updatedRows = await UserTool.update(
                {
                    status,
                    Connectiondate,
                    statusChangeDate,
                },
                {
                    where: { toolid },
                }
            );

            if (updatedRows) {
                return res.json({ message: "confirmation message" });
            } else {
                return res.status(500).json({ message: "Some error occurred while updating usertool." });
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Some error occurred while updating usertool." });
        }
    }
};



function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file, index) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                try {
                    fs.unlinkSync(curPath);
                } catch (err) {
                    console.error(`Error deleting file: ${curPath}`, err);
                }
            }
        });
        try {
            fs.rmdirSync(folderPath);
        } catch (err) {
            console.error(`Error deleting directory: ${folderPath}`, err);
        }
    }
}

function deleteFileIfExists(filePath) {
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
        } catch (err) {
            console.error(`Error deleting file: ${filePath}`, err);
        }
    }
}


// Delete Tool by id
module.exports.deleteTool = async (req, res) => {
    try {
        // Extract data from request
        const { projectId, toolid, } = req.params;

        if (!toolid) return res.status(400).json({ status: false, message: "toolid must be given" });

        // Get usertools by orgid
        const tool = await UserTool.findOne({
            where: {
                id: toolid,
            },
        });
        if (tool) await tool.destroy();

        if("milan2") {
            const folderPath = `./public/gitClones/project_${projectId}/${"milan2"}`;

            try {
                deleteFolderRecursive(folderPath)
                deleteFileIfExists(`${folderPath}.zip`)
            } catch (err) {
                console.error(`Error deleting directory: ${folderPath}`, err);
            }
        }

        await FunctionData.destroy({
            where: {
                toolId: toolid,
            },
        });

        const allTools = await UserTool.findAll({
            where: {
                project: projectId
            }
        })

        await BusinessDocumentation.destroy({
            where: {
                toolId: toolid
            }
        })

        const response = await axios.post(`${process.env.LANGCHAIN_URL}/update_vector_collection`, {
            projectId: projectId,
            toolId: toolid
        });

        res.status(200).json({ status: true, message: "Tool Deleted Successfully." });
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ status: false, message: "Some error occurred while deleting tool." });
    }
};

// Update usertool fields
module.exports.updateFields = async (req, res) => {
    // Extract data from request
    const { id, fields } = req.body;

    if ((!fields, !id)) return res.json({ message: "id and fields must be given." });

    try {
        // Update usertools with extracted data
        const updatedRows = await UserTool.update(fields, {
            where: { id: id },
        });

        const tool = await UserTool.findOne({
            where: { id: id },
        });

        if (updatedRows) {
            return res
                .status(200)
                .json({ status: true, message: "Plugin Updated successfully", usertool: tool });
        } else {
            return res
                .status(500)
                .json({ status: false, message: "Some error occurred while adding plugin." });
        }
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ status: false, message: "Some error occurred while adding plugin." });
    }
};

// get all tool from toolMaster
// Get tool by toolid
module.exports.getAllToolTypes = async (req, res) => {
    try {
        // Get usertools by orgid
        const tools = await ToolsMaster.findAll();
        return res.status(200).json({
            status: true,
            tools: tools,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Some error occurred while getting tool." });
    }
};

const cloneOptions = {
    fetchOpts: {
        callbacks: {
            certificateCheck: () => 1,
            credentials: (url, username) => nodegit.Cred.sshKeyFromAgent(username),
        },
    },
};

/**
 * This Function get acess token from git hub
 * @params =  githubUrl:String, branch:String,accessToken:String
 * @response : JSON
 * @author : Mandeep Singh
 */
module.exports.getGitAcessCode = async (req, res) => {
    const { code, client_id, redirect_uri, client_secret } = req.body;
    const scopes = 'repo'
    try {
        const response = await axios.post('https://github.com/login/oauth/access_token', null, {
            params: {
                client_id: client_id,
                code: code,
                redirect_uri: redirect_uri,
                client_secret: client_secret,
                scope: scopes,
            },
            headers: {
                Accept: 'application/json',
                // "Access-Control-Allow-Origin": "*"

            },
        });
        console.log('Git Acess Token ::::::', response.data);
        const token = response.data.access_token;
        return res.status(200).json({ status: true, message: 'Success in getting token', token });
    } catch (error) {
        console.log('Error While Getting Git Acess Token', error);
        return res.status(500).json({ status: false, message: 'Error in getting token', error: error });
    }
}

/**
 * This Function download github repo with url and branch name and save them as zip file
 * @params =  githubUrl:String, branch:String,accessToken:String
 * @response : JSON
 * @author : Mandeep Singh
 */
module.exports.cloneGithub = async (req, res) => {
    const { githubUrl, branch, projectId, updateRepo, gitAccessToken } = req.body;
    let accessToken = req?.user?.gittoken ? req?.user?.gittoken : gitAccessToken


    console.log("accessTokenaccessTokenaccessToken", accessToken, await User.findOne({
        where: {
            id: "ea1c243b-8ed0-43a6-bf52-95562b772fb7"
        }
    }))

    //getting owner name
    const usernameMatch = githubUrl.match(/github\.com\/([^/]+)/);
    const owner = usernameMatch ? usernameMatch[1] : null;

    //getting repoName
    const repoMatch = githubUrl.match(/\/([^/]+)\.git$/);
    const repo = repoMatch ? repoMatch[1] : null;

    const archiveUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`;
    const zipName = `${repo}-${branch}`;
    const folderPath = `./public/gitClones/project_${projectId}`;
    const zipFilePath = `${folderPath}/${repo}.zip`;

    if (updateRepo) {
        if (fs.existsSync(folderPath)) {
            fs.rmdirSync(folderPath, { recursive: true });
            console.log(`Folder ${folderPath} deleted successfully.`);
        } else {
            console.log(`Folder ${folderPath} does not exist.`);
        }
    }

    // Check if folder exists, create if it doesn't
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    let cloneUrlApi = `https://api.github.com/repos/${owner}/${repo}`

    let options = {};
    if (accessToken && accessToken != '') {
        options = {
            method: 'get',
            url: archiveUrl,
            responseType: 'stream',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }
    }
    else {
        options = {
            method: 'get',
            url: archiveUrl,
            responseType: 'stream',
        }
    }

    let gitOptions = {}
    if(accessToken && accessToken !== '') {
        gitOptions = {
            headers: {
                Authorization: `token ${accessToken}`
            }
        }
    }

    // try {
    //     const compressedFilePathCheck = path.join(folderPath, `${repo}.zip`);

    //     axios(options)
    //     .then(response => {
    //         response.data.pipe(fs.createWriteStream(compressedFilePathCheck))
    //             .on('finish', async () => {
    //                 console.log(`ZIP archive downloaded and saved as ${compressedFilePathCheck}`);

    //                 try {
    //                 const cloneUrlResponse = await axios.get(cloneUrlApi, gitOptions);

    //                 console.log("optionsoptionsoptions =-------------------- ", options, folderPath, cloneUrlResponse)
                
    //                 const cloneUrl = cloneUrlResponse.data.clone_url;
    //                 const repoName = path.basename(cloneUrl, '.git');
                
    //                 execSync(`git clone --branch ${branch} ${cloneUrl} ${repoName}`, { cwd: folderPath });
                
    //                 console.log(`Repository cloned successfully.`);
            
    //             // Compress the folder's contents using zlib
    //             const folderToCompress = path.join(folderPath, repoName);
    //             const compressedFilePath = path.join(folderPath, `${repoName}.zip`);

    //                 // Extract the ZIP file
    //                 // const extractionPath = path.resolve(folderPath);/
    //                     // const zip = new AdmZip(compressedFilePath);
    //                     // zip.extractAllTo(extractionPath, true); // true to overwrite existing files
    //                     // fs.unlinkSync(compressedFilePath);

    //                     let repoFolder = fs.readdirSync(folderPath).filter(file => fs.statSync(path.join(folderPath, file)).isDirectory());
    //                     if (repoFolder && repoFolder.length > 0) {
    //                         const folderTree = readFolderRecursive(path.join(folderPath, repoFolder[0]), projectId);

    //                         return res.status(200).json({
    //                             status: true,
    //                             message: `Successfully cloned repo, path ${compressedFilePath}`,
    //                             projectName: repoFolder[0],
    //                             folderTree: folderTree,
    //                             // data: "",
    //                             filename: compressedFilePath.split("/")[compressedFilePath.split("/").length - 1]
    //                         });
    //                     } else {
    //                         return res.status(404).json({
    //                             status: false,
    //                             message: "No folders found in the repository"
    //                         });
    //                     }

    //                 } catch (err) {
    //                     console.log("errorrrrrrrrrrrrr ", err)
    //                     if(err.response.data.message) {
    //                         return res.status(err.response.status).json({ status: false, message: err.response.data.message, error: err });
    //                     }

    //                     return res.status(500).json({ status: false, message: 'Error extracting ZIP file', error: err });
    //                 }
    //             })
    //             .on('error', error => {
    //                 console.error('Error saving ZIP archive:', error);
    //                 if(error.response.data.message) {
    //                     return res.status(error.response.status).json({ status: false, message: error.response.data.message, error: error });
    //                 }

    //                 return res.status(500).json({ status: false, message: 'Error While Downloading Zip', error: error });
    //             });
    //     })
    //     .catch(error => {
    //         console.error('Error downloading ZIP archive: ::::::::::::::: ', error, error.message);
    //         let status = 500;
    //         let statusText = "Error While Downloading Zip"
    //         if(error.response.status && error.response.status === 403 || error.response.status === 403) {
    //             status = error.response.status
    //             statusText = error.response.statusText
    //         }
    //         if(error.response.statusText) {
    //             return res.status(error.response.status).json({ status: false, message: error.response.statusText, error: error });
    //         }
    //         return res.status(status).json({ status: false, message: statusText, error: error });
    //     });

    // } catch (error) {
    //     console.log("Error in cloning repository ", error)
    //     if(error.response.data.message) {
    //         return res.status(error.response.status).json({ status: false, message: error.response.data.message, error: error });
    //     } else {
    //         return res.status(500).json({ status: false, message: "Something went Wromg please try again later", error: error });
    //     }
    // }


    axios(options)
    .then(response => {
        const originalFileName = response.headers['content-disposition'].split('filename=')[1];
        const zipFilePath = `${folderPath}/${originalFileName}`;

        response.data.pipe(fs.createWriteStream(zipFilePath))
            .on('finish', () => {
                console.log(`ZIP archive downloaded and saved as ${zipFilePath}`);

                // Extract the ZIP file
                const extractionPath = path.resolve(folderPath);
                try {   
                    const zip = new AdmZip(zipFilePath);
                    zip.extractAllTo(extractionPath, true); // true to overwrite existing files

                    let repoFolder = fs.readdirSync(folderPath).filter(file => fs.statSync(path.join(folderPath, file)).isDirectory());
                    if (repoFolder && repoFolder.length > 0) {
                        const folderTree = readFolderRecursive(path.join(folderPath, repoFolder[0]), projectId);

                        return res.status(200).json({
                            status: true,
                            message: `Successfully cloned repo, path ${zipFilePath}`,
                            projectName: repoFolder[0],
                            folderTree: folderTree
                        });
                    } else {
                        return res.status(404).json({
                            status: false,
                            message: "No folders found in the repository"
                        });
                    }

                } catch (err) {
                    console.log("errorrrrrrrrrrrrr ", err)
                    return res.status(500).json({ status: false, message: 'Error extracting ZIP file', error: err });
                }
            })
            .on('error', error => {
                console.error('Error saving ZIP archive:', error);
                return res.status(500).json({ status: false, message: 'Error While Downloading Zip', error: error });
            });
    })
    .catch(error => {
            console.error('Error downloading ZIP archive:', error.response, error.message);
            let status = 500;
            let statusText = "Error While Downloading Zip"
            if(error.response.status && error.response.status === 403 || error.response.status === 404 || error.response.status === 401) {
                status = error.response.status
                statusText = error.response.statusText
            }
            return res.status(status).json({ status: false, message: statusText, error: error });
        });

}


/**
 * This Function download github repo with url and branch name and save them as zip file
 * @params =  githubUrl:String, branch:String,accessToken:String
 * @response : JSON
 * @author : Milan Rawat
 */
module.exports.getClonedRepo = async (req, res) => {
    const { projectId } = req.body;

    const repoPath = `./public/gitClones/project_${projectId}`;

    try {
        if (!fs.existsSync(repoPath)) {
            return res.status(200).json({
                status: false,
                message: "Repository not found"
            });
        }

        let repoFolder = fs.readdirSync(repoPath).filter(file => fs.statSync(path.join(repoPath, file)).isDirectory());
        if (repoFolder && repoFolder.length > 0) {
            const folderTree = readFolderRecursive(path.join(repoPath, repoFolder[0]), projectId);

            return res.status(200).json({
                status: true,
                projectName: repoFolder[0],
                folderTree: folderTree
            });
        } else {
            return res.status(200).json({
                status: false,
                message: "No folders found in the repository"
            });
        }

    } catch (err) {
        // Handle the error, for example, log it
        console.error('Error reading folder:', err);
        return res.status(500).json({
            status: false,
            message: "Something went wrong, please try again later!"
        });
    }
}


/**
 * This Function download github repo with url and branch name and save them as zip file
 * @params =  githubUrl:String, branch:String,accessToken:String
 * @response : JSON
 * @author : Milan Rawat
 */
module.exports.saveClonedRepoFile = async (req, res) => {
    const { projectId, filePath, updatedContent } = req.body;

    const fileToUpdate = `./public/gitClones/project_${projectId}/${filePath}`;

    try {
        // Check if the file exists
        await myfs.access(fileToUpdate);

        // Update the file with the new content
        await myfs.writeFile(fileToUpdate, updatedContent);

        return res.status(200).json({
            status: true,
            message: "File Updated"
        });

    } catch (err) {
        // Handle the error, for example, log it
        console.error('Error updating file:', err);

        if (err.code === 'ENOENT') {
            // File doesn't exist
            return res.status(404).json({
                status: false,
                message: "File not found"
            });
        }

        return res.status(500).json({
            status: false,
            message: "Something went wrong, please try again later!"
        });
    }
}


/**
 * This Function Send User Status regarding his tool its successfully uploaded or theirs Error
 * @params =  userEmailid:String, responseStatus:String (success/error)
 * @response : JSON
 * @author : Mandeep Singh
 */
module.exports.sendToolStatusEmail = async (req, res) => {
    try {
        const { emailId, responseStatus, pluginName, projectCodeType } = req.body;
        console.log(`EmailId===============${emailId} ResponseStatus================= ${responseStatus}`)
        const foundUser = await User.findOne({
            where: { emailid: emailId }
        });

        if (!foundUser) {
            return res.status(404).json({ status: false, message: 'No User Account Found Related With Provided Email Address' });
        } else {
            let captlize_codeType = '';
            if (projectCodeType == 'nodejs') {
                captlize_codeType = 'NodeJs'
            } else {
                captlize_codeType = 'ReactJs'
            }
            let keys = {
                [allKeysForEmail.KEYFOR_USERFNAME]: foundUser.firstname,
                [allKeysForEmail.KEYFOR_PLUGIN_NAME]: pluginName,
                [allKeysForEmail.KEYFOR_PROJECT_TYPE]: captlize_codeType,
            }

            if (responseStatus === 'success') {
                prepareAndSendMail(emailId, allEmailTypes.EMAIL_TYPE_UPLOAD_SUCCESS_EMAIL, keys);
            } else {
                prepareAndSendMail(emailId, allEmailTypes.EMAIL_TYPE_UPLOAD_ERROR_EMAIL, keys);
            }

            return res.status(200).json({ status: true, message: 'Notified User current status of tool with email' });
        }
    } catch (error) {
        console.log("Error while sending user tool Status", error);
        return res.status(500).json({ status: false, message: 'Some Error Occured', error: error });
    }
}


