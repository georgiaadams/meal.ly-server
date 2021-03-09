const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    offers: [{ type: Schema.Types.ObjectId, ref: "Offer" }],
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/skillbees/image/upload/v1615300366/Meal.ly/userprofile_n2bmnb.png",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
