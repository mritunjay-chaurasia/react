const { Router } = require("express");
const productMaterial = Router();

const {keepMultipleFileInReq, addProductMaterial,getProductDocs } = require("../controllers/productMaterial.controller.js");
const authentication = require("../middlewares/authentication.js");

productMaterial.post("/addProductDocs", authentication,keepMultipleFileInReq.array('files'),addProductMaterial);
productMaterial.get("/getProductDocs",getProductDocs)
module.exports = productMaterial;
