const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const providerSchema = new Schema({
  companyName: { type: String, required: true },
  image: { type: String, default: "/public/profileIcon.png" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  address: { type: String, required: true },
  offers: [{ type: Schema.Types.ObjectId, ref: "Offer" }],
});

const Provider = mongoose.model("Provider", providerSchema);

module.exports = Provider;
