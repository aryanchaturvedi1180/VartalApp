import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import { useState } from "react";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const [acceptingId, setAcceptingId] = useState(null);

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation } = useMutation({
    mutationFn: acceptFriendRequest,
    onMutate: (reqId) => {
      setAcceptingId(reqId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onSettled: () => {
      setAcceptingId(null);
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          🔔 Notifications
        </h1>

        {/* Incoming Friend Requests */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((req) => (
                    <div
                      key={req._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300 overflow-hidden">
                              {req.sender ? (
                                <img
                                  src={req.sender.profilePic}
                                  alt={req.sender.fullName}
                                />
                              ) : (
                                <div className="skeleton w-14 h-14 rounded-full" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {req.sender?.fullName ?? "Unknown User"}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  Native: {req.sender?.nativeLanguage ?? "N/A"}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                  Learning:{" "}
                                  {req.sender?.learningLanguage ?? "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className={`btn btn-primary btn-sm ${
                              acceptingId === req._id ? "loading" : ""
                            }`}
                            onClick={() => acceptRequestMutation(req._id)}
                            disabled={acceptingId === req._id}
                          >
                            {acceptingId === req._id ? "Accepting..." : "Accept"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Accepted Friend Requests */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notif) => (
                    <div
                      key={notif._id}
                      className="card bg-base-200 shadow-sm"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full overflow-hidden">
                            {notif.recipient ? (
                              <img
                                src={notif.recipient.profilePic}
                                alt={notif.recipient.fullName}
                              />
                            ) : (
                              <div className="skeleton w-10 h-10 rounded-full" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {notif.recipient?.fullName ?? "Unknown User"}
                            </h3>
                            <p className="text-sm my-1">
                              {notif.recipient?.fullName ?? "This user"}{" "}
                              accepted your friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* No Notifications */}
            {incomingRequests.length === 0 &&
              acceptedRequests.length === 0 && <NoNotificationsFound />}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
