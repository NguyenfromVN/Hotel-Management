const express = require("express");
const router = express.Router();

const bidderController = require("../controllers/bidder-controller");

// Get Bidder + Seller Profile:
router.get("/profile", bidderController.getProfile);
// Edit Profile:
router.post("/profile/edit", bidderController.editProfile);
// Get Watch List:
router.get("/watch-list", bidderController.getWatchList);
// Add Watch-list:
router.post("/add-watch-list", bidderController.addWatchList);
// Auction Online:
router.post("/auction-online", bidderController.auctionOnline);
// Up Seller Request:
router.post("/upseller-request", bidderController.upSellerRequest);

module.exports = router;
