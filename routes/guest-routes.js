//Express FrameWork
const express = require("express");
const router = express.Router();
//Controller
const productController = require("../controllers/products-controller");
const guestController = require("../controllers/guest-controller");
//-----------------------------------------//
// -------------All of this routes can handle with bidder/seller/admin request.-------------//
// Get Home Page:
router.get("/", productController.getHome);
// Get Product Follow Categories:
router.get("/type/:catId", productController.getProductByCat);
// Get Product Detail:
router.get("/:proId/product-detail", productController.getProductDetail);
// Log In:
router.get("/sign-in", guestController.getLogin);
// Register:
router.get("/register", guestController.getRegister);
// Post Login:
router.post("/sign-in", guestController.postLogin);
// Post Register:
router.post("/register", guestController.PostRegister);
// Logout:
router.get("/sign-out", guestController.getLogout);
// Search Name:
router.get("/list-results", productController.getListResults);

// Exports router module:
module.exports = router;
