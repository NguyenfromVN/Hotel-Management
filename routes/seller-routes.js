const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/seller-controller");
const multer = require("multer");
// Get Post product Page:
router.get("/post-product", sellerController.getSubmitProduct);

// Post product:
router.post("/post-product", sellerController.postSubmitProduct);

// Get Post Image Page:
router.get("/post-product-image", sellerController.getSubmitProductImage);

// Post product:
router.post("/post-product-image", sellerController.postSubmitProductImage);

// Post Feedback:
router.post("/judge", sellerController.sendJudge);

// Ban Bidder:
router.post("/ban-bidder", sellerController.banBidder);

// Edit Description:
router.post("/:prodId/edit-description", sellerController.editDes);

module.exports = router;
