const express = require("express");
const router = express.Router();

const User = require("../models/user.model");
const Offer = require("../models/offer.model");

const { isLoggedIn } = require("../helpers/middleware");

router.get("/offers/status/:status", isLoggedIn, async (req, res, next) => {
  const { status } = req.params;
  try {
    const allOffers = await Offer.find({ status });
    res.status(200).json(allOffers);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/offers/:id", isLoggedIn, (req, res, next) => {
  const { id } = req.params;

  const invalidId = !mongoose.Types.ObjectId.isValid(id);
  if (invalidId) {
    res.status(400).json({ message: "ID is not valid" });
    return;
  }
  Offer.findById(id)
    .then((oneOffer) => {
      res.status(200).json(oneOffer);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get(
  "/offers/status/ready-requested",
  isLoggedIn,
  (req, res, next) => {}
);

router.get("offers/status/completed", isLoggedIn, (req, res, next) => {});

module.exports = router;
