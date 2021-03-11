const express = require("express");
const mongoose = require("mongoose");
const providerRouter = express.Router();

const Provider = require("../models/provider.model");
const Offer = require("../models/offer.model");

const { isLoggedIn } = require("../helpers/middleware");

// POST '/api/provider/offers' => add a new offer

providerRouter.post("/offers", isLoggedIn, (req, res, next) => {
  const {
    content,
    quantity,
    date,
    pickupSlot,
    companyName,
    address,
  } = req.body;
  const { _id: providerId } = req.session.currentUser; // pass location and address here and in the create

  Offer.create({
    content,
    quantity,
    date,
    pickupSlot,
    companyName,
    address,
    status: "new",
  })
    .then((newOfferDocument) => {
      Provider.findByIdAndUpdate(
        providerId,
        { $push: { offers: newOfferDocument._id } },
        { new: true }
      ).then((theResponse) => {
        res.status(201).json(newOfferDocument);
      });
    })
    .catch((err) => {
      res
        .status(404) // Error message
        .json(err);
    });
});

// GET '/api/provider/offers' => get all the offers for the current provider

providerRouter.get("/offers", isLoggedIn, (req, res, next) => {
  const { _id: providerId } = req.session.currentUser;
  Provider.findById(providerId)
    .populate("offers")
    .then((provider) => {
      const offers = provider.offers;
      res.status(201).json(offers);
    })
    .catch((err) => {
      res.status(404).json(err); // Error message
    });
});

providerRouter.put(
  "/offers/status/update",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const { offerId } = req.body;
      const updatedOffer = await Offer.findByIdAndUpdate(
        offerId,
        {
          status: "ready",
        },
        { new: true }
      );

      res.status(200).json(updatedOffer);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
);

providerRouter.get("/myprofile", isLoggedIn, async (req, res, next) => {
  try {
    const providerId = req.session.currentUser._id;
    const provider = await Provider.findById(providerId);
    res.status(200).json(provider);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});
providerRouter.put("/myprofile/edit", isLoggedIn, async (req, res, next) => {
  try {
    const { companyName, email, address, phoneNumber } = req.body;
    const providerId = req.session.currentUser._id;
    const updatedUser = await User.findByIdAndUpdate(
      providerId,
      { companyName, email, address, phoneNumber },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

// GET '/api/provider/offers/:id'  => get a specific offer by id

providerRouter.get("/offers/:id", isLoggedIn, (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res
      .status(400) //  Bad Request
      .json({ message: "Specified id is not valid" });
    return;
  }

  Offer.findById(id)
    .then((foundOffer) => {
      res.status(200).json(foundOffer); // OK
    })
    .catch((err) => {
      res.status(500).json(err); // Internal Server Error
    });
});

// PUT '/api/provider/offers/:id' => update a specific offer

providerRouter.put("/offers/:id", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  const {
    content,
    quantity,
    date,
    pickupSlot,
    companyName,
    address,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Offer.findByIdAndUpdate(
    id,
    {
      content,
      quantity,
      date,
      pickupSlot,
      companyName,
      address,
    },
    { new: true }
  )
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// DELETE '/api/provider/offers/:id' => delete a specific offer

providerRouter.delete("/offers/:id", (req, res) => {
  const { id } = req.params;
  const { _id: providerId } = req.session.currentUser;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Provider.findByIdAndUpdate(
    providerId,
    { $pull: { offers: id } },
    { new: true }
  )
    .then(() => {
      Offer.findByIdAndRemove(id)
        .then(() => {
          res
            .status(201) //  Accepted
            .send(`Offer ${id} was removed successfully.`);
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = providerRouter;
