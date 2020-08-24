const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin-controller");

router.get("/admin", adminController.admimManage);

// Category--------------------------------------------------------
router.post("/admin/cat/edit", adminController.editCatName);

router.post("/admin/cat/delete", adminController.delCat);

router.post("/admin/cat/add", adminController.addCat);

// Product---------------------------------------------------------
router.post("/admin/product/edit", adminController.editProdName);

router.post("/admin/product/delete", adminController.delProd);

// Users-----------------------------------------------------------
router.post("/admin/user/delete", adminController.delUser);

// UP Seller Request:
router.post("/admin/upsel", adminController.upSel);

module.exports = router;
