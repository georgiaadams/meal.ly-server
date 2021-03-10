const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const providerSchema = new Schema({
  companyName: { type: String, required: true },
  image: { type: String, default: "/public/profileIcon.png" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  address: { type: String, default: "not provided" },
  offers: [{ type: Schema.Types.ObjectId, ref: "Offer" }],
  // location: {
  //   type: {
  //     type: String,
  //   },
  //   coordinates: { type: [Number], default: [41.3975248, 2.1910079] },
  // },
});

providerSchema.index({ location: "2dsphere" });
const Provider = mongoose.model("Provider", providerSchema);

module.exports = Provider;
