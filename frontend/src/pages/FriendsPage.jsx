import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { MessageSquareIcon, UsersIcon } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";

const FriendsPage = () => {
  const { authUser } = useAuthUser();

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    enabled: !!authUser,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6 flex items-center gap-2">
          <UsersIcon className="h-6 w-6 text-primary" />
          Your Friends
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">You have no friends yet.</p>
            <p className="text-sm mt-2">Start connecting with others!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="card-body p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="avatar w-14 h-14 rounded-full bg-base-300">
                      <img
                        src={friend.profilePic}
                        alt={friend.fullName}
                        className="object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{friend.fullName}</h3>
                      <div className="flex gap-2 mt-1 text-xs flex-wrap">
                        <span className="badge badge-secondary">
                          Native: {friend.nativeLanguage}
                        </span>
                        <span className="badge badge-outline">
                          Learning: {friend.learningLanguage}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/chat/${friend._id}`}
                    className="btn btn-outline btn-sm text-sm flex items-center gap-1"
                  >
                    <MessageSquareIcon className="h-4 w-4" />
                    Message
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
