const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  status: { type: String, enum: ["new", "requested", "ready", "completed"] },
  companyName: { type: String, required: true },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/skillbees/image/upload/v1615128183/Meal.ly/defaultimg_p3fgzi.png",
  },
  content: { type: String, required: true },
  quantity: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  pickupSlot: { type: String, required: true },
  comments: { type: String },
});

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;
