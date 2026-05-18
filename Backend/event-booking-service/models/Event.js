import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    date: {
      type: Date,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      default: 0
    },

    capacity: {
      type: Number,
      required: true
    },

    availableSeats: {
      type: Number,
      required: true
    },

    images: {
      type: [String],
      default: []
    },

    isPaid: {
      type: Boolean,
      default: false
    },

    createdBy: {
      type: String, // from JWT (user id)
      required: true
    },poster: {
  type: String,
  default: ""
},

category: {
  type: String,
  default: ""
},

likes: {
  type: Number,
  default: 0
},ratings: [
  {
    userId: String,
    rating: Number,
    review: String
  }
],
avgRating: {
  type: Number,
  default: 0
}
  },
  
  {
    timestamps: true
  },
);

export default mongoose.model("Event", eventSchema);