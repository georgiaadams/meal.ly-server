const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  status: { type: String, enum: ["new", "requested", "ready", "completed"] },
  companyName: { type: String, required: true },
  content: { type: String, required: true },
  quantity: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  pickupSlot: { type: String, required: true },
});

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;
