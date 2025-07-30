import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;

    // Fetch all relevant friend requests
    const sentRequests = await FriendRequest.find({
      sender: currentUserId,
    }).select("recipient");

    const receivedRequests = await FriendRequest.find({
      recipient: currentUserId,
    }).select("sender");

    const excludedUserIds = [
      ...sentRequests.map((req) => req.recipient.toString()),
      ...receivedRequests.map((req) => req.sender.toString()),
      currentUserId,
      ...req.user.friends.map((f) => f.toString()),
    ];

    const recommendedUsers = await User.find({
      _id: { $nin: excludedUserIds },
      isOnboarded: true,
    });

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
            .select("friends")
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params;

        if (myId === recipientId) {
            return res.status(400).json({ message: "You cannot send friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(400).json({ message: "Recipient not found" });
        }

        // Fix: use .some() with toString()
        if (recipient.friends.some(friendId => friendId.toString() === myId)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ],
        });

        if (existingRequest) {
            return res.status(400).json({ message: "A friend request already exists between you and this user" });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);
    } catch (error) {
        console.error("Error in friendRequest Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });

        res.status(200).json({ message: "Friend request accepted successfully" });
    } catch (error) {
        console.error("Error in acceptFriendRequest Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function getFriendRequests(req, res) {
    try {
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient", "fullName profilePic");

        res.status(200).json({ incomingReqs, acceptedReqs });
    } catch (error) {
        console.error("Error in getPendingFriendRequests Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getOutgoingFriendReqs(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json({ outgoingRequests });
    } catch (error) {
        console.error("Error in getOutgoingFriendRequests Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const completeOnboarding = async (req, res) => {
  const userId = req.userId;
  const { fullName, bio, nativeLanguage, learningLanguage, location, profilePic } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, bio, nativeLanguage, learningLanguage, location, profilePic, isOnboarded: true },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to complete onboarding", error: err.message });
  }
};