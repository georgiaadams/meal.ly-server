const express = require("express");
const userRouter = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user.model");
const Offer = require("../models/offer");

const { isLoggedIn } = require("../helpers/middleware");

userRouter.get("/offers/status/new", isLoggedIn, async (req, res, next) => {
  try {
    const newOffers = await Offer.find({ status: "new" }); // showing all new offers
    res.status(200).json(newOffers);
  } catch (error) {
    res.status(400).json(error);
  }
});

userRouter.get("/offers/:id", isLoggedIn, (req, res, next) => {
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

userRouter.get(
  "/offers/status/ready-requested",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const pendingOffers = await Offer.find({
        status: "ready",
        status: "requested",
      });
      res.status(200).json(pendingOffers);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

userRouter.get(
  "/offers/status/completed",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const completedOffers = await Offer.find({ status: "completed" });
      res.status(200).json(completedOffers);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

// router.get("/offers/status/:status", isLoggedIn, async (req, res, next) => {
//   const { status } = req.params;

//   const validStatus = ["new", "requested", "ready", "completed"].includes(
//     status
//   );

//   if (!validStatus)
//     return res.status(400).json({ message: "Not a valid status" });

//   try {
//     const allOffers = await Offer.find({ status });
//     res.status(200).json(allOffers);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

module.exports = userRouter;
