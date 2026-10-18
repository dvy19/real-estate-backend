const mongoose=require("mongoose")

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["customer" , "broker"],
      default: "user"
    },

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const UserAuth=mongoose.model("UserAuth" , userSchema)

module.exports=UserAuth