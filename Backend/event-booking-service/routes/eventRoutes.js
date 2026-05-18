// import express from "express";
// import {
//   createEvent,
//   getAllEvents,
//   getMyEvents,
//   getEventById,
//   updateEvent,
//   deleteEvent
// } from "../controllers/eventController.js";

// import authMiddleware from "../middleware/authMiddleware.js";
// import upload from "../middleware/upload.js";
// // import { protect } from "../middleware/authMiddleware.js";
// const router = express.Router();
// router.post("/create", authMiddleware, upload.single("poster"), createEvent);
// router.post("/create", authMiddleware, createEvent);
// // router.get("/all", getAllEvents);
// router.get("/my-events", authMiddleware, getMyEvents);
// router.get("/:id", getEventById);
// router.put("/:id", authMiddleware, updateEvent);
// router.delete("/:id", authMiddleware, deleteEvent);
// router.get("/all", getAllEvents);

// export default router;

import express from "express";
import {
  createEvent,
  getAllEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from "../controllers/eventController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ✅ CREATE
router.post("/create", authMiddleware, upload.single("poster"), createEvent);

// ✅ GET ALL (PUBLIC)
router.get("/all", getAllEvents);

// ✅ GET MY EVENTS
router.get("/my-events", authMiddleware, getMyEvents);

// ✅ GET SINGLE (KEEP LAST)
router.get("/:id", getEventById);

// ✅ UPDATE
router.put("/:id", authMiddleware, updateEvent);

// ✅ DELETE
router.delete("/:id", authMiddleware, deleteEvent);


// router.post("/:id/rate", authMiddleware, addRating);


export default router;