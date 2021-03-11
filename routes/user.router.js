const express = require("express");
const userRouter = express.Router();
const mongoose = require("mongoose");
const Offer = require("../models/offer.model");
const User = require("../models/user.model");
const Provider = require("../models/provider.model");

// This router is included as a boilerplate example

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
      const { _id } = req.session.currentUser;
      const user = await User.findById(_id).populate("offers");
      const ready = [];
      const requested = [];
      const pendingOffers = user.offers.forEach((offer) => {
        if (["ready"].includes(offer.status)) ready.push(offer);
        if (["requested"].includes(offer.status)) requested.push(offer);
      });
      res.status(200).json({ ready, requested });
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

userRouter.put("/offers/status/update", isLoggedIn, async (req, res, next) => {
  // offer id, user id, provider id
  try {
    const { offerId, comments, username } = req.body;
    const updatedOffer = await Offer.findByIdAndUpdate(
      offerId,
      {
        status: "requested",
        comments,
        username,
      },
      { new: true }
    );
    await User.findByIdAndUpdate(req.session.currentUser._id, {
      $push: { offers: updatedOffer._id },
    });

    res.status(200).json(updatedOffer);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

userRouter.put(
  "/offers/status/completed",
  isLoggedIn,
  async (req, res, next) => {
    // offer id, user id, provider id
    try {
      const { offerId } = req.body;
      const completedOffer = await Offer.findByIdAndUpdate(
        offerId,
        {
          status: "completed",
        },
        { new: true }
      );
      res.status(200).json(completedOffer);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
);
userRouter.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});
userRouter.put("/profile/edit", isLoggedIn, async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userId = req.session.currentUser._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

module.exports = userRouter;
