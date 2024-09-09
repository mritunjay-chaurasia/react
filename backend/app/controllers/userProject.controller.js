const CryptoJS = require("crypto-js");

const Organization = require("../models/organization.model");
const Orgusers = require("../models/orgusers.model");
const Userprojects = require("../models/userprojects.model");
const fsextra = require('fs-extra');
const fs = require('fs');
const AdmZip = require('adm-zip');
const multer = require("multer");
const path = require("path");
const UserProject = require("../models/userprojects.model");
const OrgToken = require("../models/orgTokens.model");
const RepoFlow = require("../models/repoFlow.model");
const FunctionData = require("../models/functionData.model");
const BusinessDocumentation = require("../models/businessDocumentation.model");
const User = require("../models/user.model");
const { decrypt } = require("../utils");
const FunctionList = require("../models/functionList");
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const axios = require("axios");
const FormData = require("form-data");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destination = path.resolve("public", "images");
        cb(null, destination);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}.${file.mimetype.split("/")[1]}`);
    },
});

module.exports.upload = multer({ storage: storage });


const storageReq = multer.memoryStorage();
module.exports.keepFileInReq = multer({ storage: storageReq });

/**
 * @request : orgid in query
 * @response : list of all project based on the orgid
 * @author : Milan Rawat
 */
module.exports.getAllMyProjects = async (req, res) => {
    try {
        let { orgid } = req.query;
        orgid = Number(orgid);
        const organization = await Organization.findOne({
            where: {
                id: orgid,
                status: {
                    [Op.not]: 'deleted',
                },
            },
            include: {
                model: UserProject,
                as: 'allProjects',
                where: {
                    status: {
                        [Op.ne]: 'deleted', // Exclude UserProjects with "deleted" status
                    },
                },
            },
            order: [["createdAt", "DESC"]], // Sort by createdAt property in descending order
        });

        if (!organization) {
            return res.status(500).json({
                status: false,
                message: "Organization not found with this id!",
            });
        }

        res.status(200).json({ status: true, data: organization });
    } catch (e) {
        console.log("Errorrrrrrrr [In User Project Controller]", e);
        return res.status(500).json({
            status: false,
            message: "Some error occurred, Please try again later!",
            error: e,
        });
    }
};

/**
 * @request : orgid in query
 * @response : update Project settings (Appearance, PreChat)
 * @author : Milan Rawat
 */
module.exports.updateProjectSettings = async (req, res) => {
    try {
        let { projectsettings, projectid } = req.body;
        if (!projectsettings || !projectid) {
            return res.status(400).json({
                status: false,
                message: "Project id and settings are required",
                body: req.body,
            });
        }
        const formDataString = projectsettings;
        if (!formDataString) {
            return res.status(400).json({
                status: false,
                message: "projectsettings field is required.",
            });
        }

        projectsettings = JSON.parse(formDataString);

        if (req.file) {
            projectsettings.themesettings.chatHeader.image = req.file.filename;
        }

        const userProject = await Userprojects.update(
            {
                themesettings: projectsettings.themesettings,
                surveysettings: projectsettings.surveysettings,
            },
            {
                where: { id: req.body.projectid },
                returning: true, // Enable the returning option
            }
        );
        const updatedData = userProject[1][0];

        return res.status(200).json({
            status: true,
            message: "Settings updated successfully!",
            project: updatedData,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Some error occurred while retreiving organisation details.",
        });
    }
};

/**
 * @request : orgid in query
 * @response : get AllDetails of the project with project Id for embed application
 * @author : Milan Rawat
 */
module.exports.loadProject = async (req, res) => {
    try {
        console.log('my req.query.projectId',req.query.projectId)
        const userProject = await UserProject.findOne({
            where: { id: req.query.projectId },
            include: [
                { foreignKey: "pointPerson", model: User, as: 'pointPersonUser' },
            ],

        });
        // userProject.pointPersonUser.firstname = decrypt(userProject.pointPersonUser.firstname);
        // userProject.pointPersonUser.lastname = decrypt(userProject.pointPersonUser.lastname);
        // userProject.pointPersonUser.emailid = decrypt(userProject.pointPersonUser.emailid);
    
        if (!userProject) {
            return res.status(404).json({
                status: false,
                message: "Project not found!",
            });
        }

        res.status(200).json({
            status: true,
            userProject: userProject,
        });
    } catch (e) {
        return res.status(500).json({
            status: false,
            message: "Some error occurred, Please try again later!",
        });
    }
};

/**
 * @request : orgid and project details
 * @response : It'll create a project in the organization of the given orgId
 * @author : Milan Rawat
 */
module.exports.addProject = async (req, res) => {
    try {
        const { projectname, orgId } = req.body;

        if (!projectname || !orgId) {
            return res.status(403).json({
                status: false,
                message: "Org Id & Project Name is required.",
            });
        }

        const organization = await Organization.findOne({
            where: {
                id: orgId,
            },
            include: { model: UserProject, as: "allProjects" },
        });

        if (!organization) {
            return res.status(404).json({
                status: false,
                message: "Organization Not Found with this Id.",
            });
        }

        const createdUserProject = await UserProject.create({
            organizationId: organization.id,
            projectname: projectname,
            icon: "geeker",
        });

        const projectToken = CryptoJS.AES.encrypt(
            JSON.stringify({ projectId: createdUserProject.id, userId: req.user.id }),
            process.env.PROJECT_SECRET_KEY
        ).toString();

        // const projectToken = JSON.stringify({ projectId: createdUserProject.id, userId: req.user.id });


        createdUserProject.projecttoken = projectToken.toString();
        createdUserProject.save();

        await OrgToken.create({
            organization: organization.id,
            projectid: createdUserProject.id,
            openapikey: process.env.OPENAI_KEY_FOR_ORG,
        });

        res.status(200).json({
            status: true,
            organization: organization,
            project: createdUserProject,
            updated: organization
        });
    } catch (e) {
        return res.status(500).json({
            status: false,
            message: "Some error occurred, Please try again later!",
        });
    }
};

module.exports.updateProject = async (req, res) => {
    try {
        const { projectId, projectname, pointPerson, aiProjectInitialization } = req.body;
        const userProject = await UserProject.findOne({
            where: { id: projectId },
        });
        if (!userProject) {
            return res.status(404).json({
                status: false,
                message: "Project not found!",
            });
        }

        // Update project name
        userProject.projectname = projectname || userProject.projectname

        // Update point person
        userProject.pointPerson = pointPerson || userProject.pointPerson
        
        userProject.aiProjectInitialization = (typeof aiProjectInitialization === 'undefined') ? userProject.aiProjectInitialization : aiProjectInitialization;

        await userProject.save(); // Ensure to await the save operation

        res.status(200).json({
            status: true,
            userProject: userProject,
            message: "Updated Successfully"
        });
    } catch (e) {
        console.log("eeeeeeeerrorrrrrrrrrr", e)
        return res.status(500).json({
            status: false,
            message: "Some error occurred, Please try again later!",
        });
    }
};

module.exports.deleteProject = async (req, res) => {
    try {
        const { projectId } = req.query;
        const userProject = await UserProject.findOne({
            where: { id: projectId },
        });
        if (!userProject) {
            return res.status(404).json({
                status: false,
                message: "Project not found!",
            });
        }

        RepoFlow.destroy({
            where: {
                projectId: projectId,
            },
        });
        OrgToken.destroy({
            where: {
                projectid: projectId,
            },
        });
        FunctionData.destroy({
            where: {
                projectId: projectId
            }
        })
        BusinessDocumentation.destroy({
            where: {
                projectId: projectId
            }
        })
        await UserProject.update({
            status: "deleted"
        }, {
            where: {
                id: projectId
            }
        })

        res.status(200).json({
            status: true,
            message: "Project deleted Successfully"
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            status: false,
            message: "Some error occurred, Please try again later!",
        });
    }
};

/**
 * @request : userProjectId and selectedOptions
 * @response : It'll add status in the Userprojects of the given userProjectId
 * @author : Mritunjay Chaurasia
 */
module.exports.updateUserProject = async (req, res) => {
    const { userProjectId, selectedOptions, selectedPointUsersId, hideReleasedStatus,selectedDetails } = req.body;
 
    if (!userProjectId) {
        return res.status(403).json({
            status: false,
            message: "UserProjectId is required.",
        });
    }
 
    const updateData = {};
 
    if (selectedOptions !== undefined) {
        updateData.selectedStatus = selectedOptions;
    }
 
    if (selectedPointUsersId !== undefined) {
        updateData.selectedPointUsers = selectedPointUsersId;
    }
 
    if (hideReleasedStatus !== undefined) {
        updateData.hideReleasedStatus = hideReleasedStatus;
    }
    if (selectedDetails !== undefined) {
        updateData.selectedDetails = selectedDetails;
    }
 
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
            status: false,
            message: "No valid fields provided for update.",
        });
    }
 
    try {
        const [numAffectedRows, affectedRows] = await Userprojects.update(
            updateData,
            {
                where: { id: userProjectId },
                returning: true,
            }
        );
 
        const updatedData = await Userprojects.findOne({
            where: { id: userProjectId },
        });
 
        return res.status(200).json({
            status: true,
            message: "User project updated successfully!",
            updatedData: updatedData,
        });
    } catch (error) {
        console.error("Error updating Userprojects table:", error);
        return res.status(500).json({
            status: false,
            message: "Error updating user project.",
            error: error.message,
        });
    }
};


module.exports.getFunctionList = async (req, res) => {
    const { projectId } = req.query;
 
    if (!projectId) {
        return res.status(403).json({
            status: false,
            message: "ProjectId is required.",
        });
    }
 
    try {

        const functionList = await FunctionList.findAll({
            where: {
                projectId: projectId
            }
        })
 
        return res.status(200).json({
            status: true,
            functionList: functionList,
        });
    } catch (error) {
        console.error("Error in getFunctionList function:", error);
        return res.status(500).json({
            status: false,
            message: "Error getting function list",
            error: error.message,
        });
    }
};


module.exports.addFunctionList = async (req, res) => {
    const { functionList } = req.body;
 
    if (!functionList) {
        return res.status(403).json({
            status: false,
            message: "Function lists required.",
        });
    }
 
    try {

        const uniqueFunctionList = Array.from(new Map(functionList.map(item => [item.id, item])).values());

        const functionListResponse = await FunctionList.bulkCreate(uniqueFunctionList, {
            updateOnDuplicate: ['description']
        })
 
        return res.status(200).json({
            status: true,
            functionList: functionListResponse,
        });
    } catch (error) {
        console.error("Error in getFunctionList function:", error);
        return res.status(500).json({
            status: false,
            message: "Error getting function list",
            error: error.message,
        });
    }
};

module.exports.updateFunctionList = async (req, res) => {
    const { functionListId, steps } = req.body;
 
    if (!functionListId) {
        return res.status(403).json({
            status: false,
            message: "Function List Id required.",
        });
    }
 
    try {

        let foundFunctionList = await FunctionList.findOne({
            where: {
                id: functionListId
            }
        })
        if(foundFunctionList) {
            foundFunctionList.steps = steps
            await foundFunctionList.save();
        }
 
        return res.status(200).json({
            status: true,
            functionList: foundFunctionList,
        });
    } catch (error) {
        console.error("Error in updateFunctionList function:", error);
        return res.status(500).json({
            status: false,
            message: "Error getting function list",
            error: error.message,
        });
    }
};

module.exports.deleteFunctionList = async (req, res) => {
    const { projectId } = req.query;

    console.log("req.body", req.query)
 
    if (!projectId) {
        return res.status(403).json({
            status: false,
            message: "Project Id required.",
        });
    }
 
    try {
        await FunctionList.destroy({
            where: {
                projectId: projectId
            }
        })
 
        return res.status(200).json({
            status: true,
            message: "Function list deleted"        
        });
    } catch (error) {
        console.error("Error in getFunctionList function:", error);
        return res.status(500).json({
            status: false,
            message: "Error getting function list",
            error: error.message,
        });
    }
};

const getOtherFunctionsList = (fileContent) => {
    let otherFunctions = [];
    function extractFunctionCode(node) {
      let startIndex = node.start - node.loc.start.column;
      let start = startIndex ? startIndex : node.start;
      return fileContent.slice(start, node.end + 1);
    }

    const checkFunctionParams = (node, path = null) => {
        const functionName = getFunctionName(node, path);
        const functionCode = extractFunctionCode(node);
        otherFunctions.push({
            name: functionName,
            code: functionCode,
          });
      };
  

  const getFunctionName = (node, path) => {
    if (node.type === "FunctionDeclaration" && node.id) {
      return node.id.name;
    } else if (path && path.parent.type === "VariableDeclarator") {
      return path.parent.id.name;
    } else if (
      path &&
      path.parent.type === "AssignmentExpression" &&
      path.parent.left.type === "MemberExpression"
    ) {
      return path.parent.left.property.name;
    }
    return "anonymous";
  };

  const ast = babelParser.parse(fileContent, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  traverse(ast, {
    FunctionDeclaration(path) {
      checkFunctionParams(path.node);
      path.skip();
    },
    FunctionExpression(path) {
      checkFunctionParams(path.node, path);
      path.skip();
    },
    ArrowFunctionExpression(path) {
      checkFunctionParams(path.node, path);
      path.skip();
    },
  });

  return otherFunctions
}


const getFileAPIs = (fileContent) => {
  let otherFunctions = [];
  function extractFunctionCode(node) {
    let startIndex = node.start - node.loc.start.column;
    let start = startIndex ? startIndex : node.start;
    return fileContent.slice(start, node.end + 1);
  }

  const checkFunctionParams = (node, functionsWithReqRes, path = null) => {
    const params = node.params;
    const functionName = getFunctionName(node, path);
    const functionCode = extractFunctionCode(node);
    if (params[0].name === "req" && params[1].name === "res") {
        functionsWithReqRes.push({
            name: functionName,
            code: functionCode,
        });
      
        try {
          const subAst = babelParser.parse(functionCode, {
            sourceType: "module",
            plugins: ["jsx", "typescript"],
          });
    
          traverse(subAst, {
            FunctionDeclaration(path) {
                if (path.node.id && path.node.id.name === functionName) {
                return;
            }
              checkFunctionParams(path.node, functionsWithReqRes, path);
            },
            FunctionExpression(path) {
              if (path.parent?.id?.name === functionName) {
                return;
            }
              checkFunctionParams(path.node, functionsWithReqRes, path);
            },
            ArrowFunctionExpression(path) {
              if (path.parent?.id?.name === functionName) {
                return;
              }
              checkFunctionParams(path.node, functionsWithReqRes, path);
            },
          });
        } catch (error) {
            console.log("got errorrrrrrrrrrrrrrr start ", error, functionCode)
            console.log("got errorrrrrrrrrrrrrrr end ")
        }
    } else {
        otherFunctions.push({
        name: functionName,
        code: functionCode,
      });
    }
  };

  const getFunctionName = (node, path) => {
    if (node.type === "FunctionDeclaration" && node.id) {
      return node.id.name;
    } else if (path && path.parent.type === "VariableDeclarator") {
      return path.parent.id.name;
    } else if (
      path &&
      path.parent.type === "AssignmentExpression" &&
      path.parent.left.type === "MemberExpression"
    ) {
      return path.parent.left.property.name;
    }
    return "anonymous";
  };

  const ast = babelParser.parse(fileContent, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  const functionsWithReqRes = [];

  traverse(ast, {
    FunctionDeclaration(path) {
      checkFunctionParams(path.node, functionsWithReqRes);
      path.skip();
    },
    FunctionExpression(path) {
      checkFunctionParams(path.node, functionsWithReqRes, path);
      path.skip();
    },
    ArrowFunctionExpression(path) {
      checkFunctionParams(path.node, functionsWithReqRes, path);
      path.skip();
    },
  });

  return { functionsWithReqRes, otherFunctions };
};

module.exports.generateAPIList = async (req, res) => {
    console.log(" >>>>>>>>>>>>>>>>>>>> 1111 ", req.body)
    console.log(" >>>>>>>>>>>>>>>>>>>> 2222 ", req.file)
    const { stack, projectId } = req.body;

    try {

        if(stack === "NodeJS") {
            let name = req.file.originalname;
            const outputFolder = `./public/backendBuilder/project_${projectId}`;
            const zipFilePath = `${outputFolder}/${name}.zip`;
            
            // Ensure the output directory exists
            await fsextra.ensureDir(outputFolder);
            
            // Write the uploaded file to the specified path
            await fsextra.writeFile(zipFilePath, req.file.buffer);
            
            // Verify if the file exists before proceeding
            if (!fs.existsSync(zipFilePath)) {
                throw new Error(`File not found: ${zipFilePath}`);
            }
            
            try {
                const zip = new AdmZip(zipFilePath);
                zip.extractAllTo(outputFolder, true); // true to overwrite existing files
            } catch (err) {
                throw err;
            }
            
            // Delete the ZIP file after extraction
            await fs.promises.unlink(zipFilePath);


            let allAPIs = []
            let functionListResponse = []

            // Function to read the folder recursively
            const readFolderRecursively = async (folderPath) => {
                const readDir = async (currentPath) => {
                    const entries = await fs.promises.readdir(currentPath, { withFileTypes: true });
                    const result = {
                        name: path.basename(currentPath),
                        content: [],
                    };

                    for (const entry of entries) {
                        const fullPath = path.join(currentPath, entry.name);

                        if (entry.isDirectory()) {
                            await readDir(fullPath); // Recursively read subdirectories
                        } else {
                            const extname = path.extname(fullPath).toLowerCase();
                            if (extname === '.js' || extname === '.ts') {
                                const parentDirName = path.basename(path.dirname(fullPath)).toLowerCase();
                                const isInControllerFolder = parentDirName === 'controller' || parentDirName === 'controllers';
                                const isInModelFolder = parentDirName === 'model' || parentDirName === 'models';
                                const isInRouteFolder = parentDirName === 'route' || parentDirName === 'routes';
                
                                const fileContent = await fs.promises.readFile(fullPath, 'utf-8');
                
                                if (!isInModelFolder && !isInRouteFolder) {
                                    const otherFunctionsList = getOtherFunctionsList(fileContent).map(item => {
                                        return {
                                            ...item,
                                            projectId: projectId
                                        };
                                    });
                                    console.log("other functions list >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", otherFunctionsList);
                                    functionListResponse.push(...(await FunctionList.bulkCreate(otherFunctionsList)));
                                }
                
                                if (isInControllerFolder) {
                                    const fileAPIs = getFileAPIs(fileContent);
                                    allAPIs.push(...fileAPIs.functionsWithReqRes);
                
                                    console.log("otherrrrrrrrrrrrrrrrr functionsssssssssssssssssssssssss ", fileAPIs.otherFunctions);
                                    const functionList = fileAPIs.otherFunctions.map(item => {
                                        return {
                                            ...item,
                                            projectId: projectId
                                        };
                                    });
                                    functionListResponse.push(...(await FunctionList.bulkCreate(functionList)));
                
                                    console.log("fileAPIsfileAPIsfileAPIs", fileAPIs);
                                }
                            }
                        }
                    }

                    return result;
                };

                return await readDir(folderPath);
            };



            // Read the extracted folder recursively
            const extractedContents = await readFolderRecursively(outputFolder);

            // console.log(" >>>>>>>>>>>>>> ", JSON.stringify(extractedContents, null, 4))
            
            return res.status(200).json({
                status: true,
                allAPIs: allAPIs,
                functionList: functionListResponse
                // functionList: functionListResponse,
            });
        }
        if(stack === "Python") {
            let name = req.file.originalname;
            const outputFolder = `./public/backendBuilder/project_${projectId}`;
            const zipFilePath = `${outputFolder}/${name}.zip`;
            console.log("11111111111111111111")
            
            // Ensure the output directory exists
            await fsextra.ensureDir(outputFolder);
            
            // Write the uploaded file to the specified path
            await fsextra.writeFile(zipFilePath, req.file.buffer);
            
            console.log("2222222222222222")
            // Verify if the file exists before proceeding
            if (!fs.existsSync(zipFilePath)) {
                throw new Error(`File not found: ${zipFilePath}`);
            }
            console.log("333333333333333333")
            
            try {
                const zip = new AdmZip(zipFilePath);
                zip.extractAllTo(outputFolder, true); // true to overwrite existing files
                console.log("4444444444444444")
            } catch (err) {
                throw err;
            }
            
            console.log("555555555555555555")
            // Delete the ZIP file after extraction
            await fs.promises.unlink(zipFilePath);
            
            console.log("6666666666666666")
            var formdata = new FormData();
            formdata.append("file", req.file.buffer, req.file.originalname);
            formdata.append("project_id", projectId);
            console.log("77777777777777", req.file)
            try {
                const response = await axios.post(`${process.env.LANGCHAIN_URL}/get_python_project_apis`, formdata);
                console.log("responseeeeeeeeeeeee ", response)
                let dataToFeed = response.data.function_list_response.map(item => {
                    return {
                        ...item,
                        projectId: projectId
                    }
                })
                let functionListResponse = await FunctionList.bulkCreate(dataToFeed)
                let allAPIs = response.data.all_apis
                return res.status(200).json({
                    status: true,
                    allAPIs: allAPIs,
                    functionList: functionListResponse
                    // functionList: functionListResponse,
                });

    
            } catch (error) {
                console.log(error)
                return res.status(200).json({
                    status: true,
                    message: "Something went wrong, please try again later",
                });
            }

        }

        // const functionListResponse = await FunctionList.bulkCreate(functionList)
    } catch (error) {
        console.error("Error in getFunctionList function:", error);
        return res.status(500).json({
            status: false,
            message: "Error getting function list",
            error: error.message,
        });
    }
};
