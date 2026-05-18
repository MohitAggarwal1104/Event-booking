import Event from "../models/Event.js";
import cloudinary from "../config/cloudinary.js";

// // ================= CREATE EVENT =================
// export const createEvent = async (req, res) => {
//   try {
//     const { title, location, price, capacity, description } = req.body;

//     // validation
//     if (!title || !location || capacity == null) {
//       return res.status(400).json({
//         message: "Required fields missing"
//       });
//     }

//     const event = await Event.create({
//       title,
//       description: description || "",
//       location,
//       price: price || 0,
//       capacity,
//       availableSeats: capacity,
//       date: new Date(),
//       createdBy: req.user.id
//     });

//     res.status(201).json({
//       message: "Event created successfully",
//       data: event
//     });

//   } catch (err) {
//     res.status(500).json({
//       message: err.message
//     });
//   }
// };

export const createEvent = async (req, res) => {
  try {
    console.log("CLOUD NAME:", process.env.CLOUDINARY_NAME);
console.log("API KEY:", process.env.CLOUDINARY_KEY);
console.log("API SECRET:", process.env.CLOUDINARY_SECRET);

    const { title, location, price, capacity } = req.body;

    if (!title || !location || !capacity) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    let imageUrl = "";

    // 🔥 CLOUDINARY UPLOAD
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "events"
        });

        console.log("✅ CLOUDINARY SUCCESS:", result.secure_url);

        imageUrl = result.secure_url;

      } catch (err) {
        console.log("❌ CLOUDINARY ERROR FULL:", err);

        return res.status(500).json({
          message: "Cloudinary upload failed",
          error: err.message
        });
      }
    }

    const event = await Event.create({
  title,
  location,
  price,
  capacity,
  availableSeats: capacity,
  createdBy: req.user.id,
  poster: imageUrl,
  date: new Date() // ✅ FIX
});

    return res.json({
      message: "Event created",
      data: event
    });

  } catch (err) {
    console.log("❌ FULL BACKEND ERROR:", err);

    return res.status(500).json({
      message: err.message
    });
  }
};

// // ================= GET ALL EVENTS =================
// export const getAllEvents = async (req, res) => {
//   try {
//     const events = await Event.find().sort({ createdAt: -1 });

//     res.json({
//       data: events
//     });

//   } catch (err) {
//     res.status(500).json({
//       message: err.message
//     });
//   }
// };

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    res.json({
      message: "All events",
      data: events
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

export const addRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const event = await Event.findById(req.params.id);

    const existing = event.ratings.find(
      r => r.userId === req.user.id
    );

    if (existing) {
      existing.rating = rating;
      existing.review = review;
    } else {
      event.ratings.push({
        userId: req.user.id,
        rating,
        review
      });
    }

    // avg rating
    event.avgRating =
      event.ratings.reduce((a, b) => a + b.rating, 0) /
      event.ratings.length;

    await event.save();

    res.json({ message: "Rating added" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= GET MY EVENTS =================
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      createdBy: req.user.id
    }).sort({ createdAt: -1 });

    res.json({
      data: events
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


// ================= GET SINGLE EVENT =================
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.json({
      data: event
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


// ================= UPDATE EVENT =================
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // only creator can update
    if (event.createdBy !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Event updated",
      data: updated
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


// ================= DELETE EVENT =================
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    if (event.createdBy !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    await event.deleteOne();

    res.json({
      message: "Event deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

