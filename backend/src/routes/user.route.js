import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getFriendRequests,
  getMyFriends,
  getRecommendedUsers,
  sendFriendRequest,
  acceptFriendRequest,
  getOutgoingFriendReqs,
  completeOnboarding
} from "../controllers/user.controller.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectRoute);

// Routes
router.get("/", getRecommendedUsers); // List of recommended users
router.get("/friends", getMyFriends); // List of current friends

router.post("/friend-request/:id", sendFriendRequest); // Send friend request to someone
router.put("/friend-request/:id/accept", acceptFriendRequest); // Accept friend request
router.get("/friend-requests", getFriendRequests); // 🔄 Use GET (not POST) for fetching friend requests
router.get("/outgoing-friend-requests", getOutgoingFriendReqs); // List of sent requests

router.put("/onboarding", completeOnboarding); // Save onboarding data

export default router;
