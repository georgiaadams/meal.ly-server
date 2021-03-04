const express = require("express");
const mongoose = require("mongoose");
const providerRouter = express.Router();

const Provider = require("../models/provider");
const Offer = require("../models/offer");

// POST '/api/provider/offers' => add a new offer

providerRouter.post("/offers", (req, res, next) => {
  const { content, quantity, date, pickupSlot, companyName } = req.body;
  const { _id: providerId } = req.session.currentUser;

  Offer.create({
    content,
    quantity,
    date,
    pickupSlot,
    companyName,
    status: "new",
  })
    .then((createdOffer) => {
      res.status(201).json(createdOffer);
    })
    .then((newOfferDocument) => {
      Provider.findByIdAndUpdate(
        providerId,
        { $push: { offers: newOfferDocument._id } },
        { new: true }
      ).then((theResponse) => {
        res.status(201).json(theResponse);
      });
    })
    .catch((err) => {
      res
        .status(404) // Error message
        .json(err);
    });
});

// GET '/api/provider/offers' => get all the offers for the current provider

providerRouter.get("/offers", (req, res, next) => {
  const { _id: providerId } = req.session.currentUser;
  Provider.findById(providerId)
    .populate("offers")
    .then((provider) => {
      const offers = { offers: provider.offers };
      res.status(201).json(offers);
    })
    .catch((err) => {
      res.status(404).json(err); // Error message
    });
});

// GET '/api/provider/offers/:id'  => get a specific offer by id

providerRouter.get("/offers/:id", (req, res) => {
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

providerRouter.put("/offers/:id", (req, res, next) => {
  const { id } = req.params;
  const { content, quantity, date, pickupSlot, companyName } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Offer.findByIdAndUpdate(id, {
    content,
    quantity,
    date,
    pickupSlot,
    companyName,
  })
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// DELETE '/api/provider/offers/:id' => delete a specific offer

providerRouter.delete("/offers/:id", (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Offer.findByIdAndRemove(id)
    .then(() => {
      res
        .status(201) //  Accepted
        .send(`Offer ${id} was removed successfully.`);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = providerRouter;
