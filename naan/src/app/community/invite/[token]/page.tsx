"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getGraphQLClient } from "@/lib/graphql";
import {
  GET_GROUP_BY_INVITE_TOKEN,
  REQUEST_JOIN_GROUP,
} from "@/queries/community";
import { Loader2, AlertCircle, CheckCircle, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CommunityLoginPrompt from "@/components/CommunityLoginPrompt";

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requestSent, setRequestSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    data: group,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["groupByInvite", token],
    queryFn: async () => {
      const client = getGraphQLClient(session?.backendToken);
      const data = await client.request(GET_GROUP_BY_INVITE_TOKEN, { token });
      return (data as any).groupByInviteToken;
    },
    enabled: !!token,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (group && (group as any).isMember) {
      router.push(`/c/${group.slug}`);
    }
  }, [group, router]);

  const requestJoinMutation = useMutation({
    mutationFn: async () => {
      if (!session?.backendToken) throw new Error("Please login to join");
      if (!group) throw new Error("Group not found");

      const client = getGraphQLClient(session.backendToken);
      return client.request(REQUEST_JOIN_GROUP, {
        groupId: group.id,
        token: token,
      });
    },
    onSuccess: () => {
      setRequestSent(true);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to join group");
    },
  });

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Invite
          </h1>
          <p className="text-gray-600 mb-6">
            This invite link is invalid or has expired.
          </p>
          <Link href="/c" className="text-blue-600 hover:underline">
            Back to Community
          </Link>
        </div>
      </div>
    );
  }

  const handleJoin = () => {
    if (!session) {
      return;
    }
    requestJoinMutation.mutate();
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            You've been invited!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Login to join{" "}
            <span className="font-semibold text-gray-900">{group.name}</span>
          </p>
        </div>
        <CommunityLoginPrompt />
      </div>
    );
  }

  if ((group as any).isMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            You are a member!
          </h2>
          <p className="text-gray-500">Redirecting to group...</p>
        </div>
      </div>
    );
  }

  const isWaiting = requestSent || (group as any).hasPendingRequest;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
        <div className="relative h-32 bg-blue-600">
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden shadow-sm flex items-center justify-center">
              {group.icon ? (
                <Image
                  src={group.icon}
                  alt={group.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-3xl font-bold text-gray-400">
                  {group.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {group.name}
          </h1>
          <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
            <Users className="w-4 h-4 mr-1" />
            <span>{group.membersCount} members</span>
            <span className="mx-2">•</span>
            <span className="capitalize">{group.type.toLowerCase()} group</span>
          </div>

          <p className="text-gray-600 mb-8">{group.description}</p>

          {isWaiting ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex flex-col items-center justify-center text-yellow-800 mb-2">
                <Loader2 className="w-8 h-8 animate-spin mb-3 text-yellow-600" />
                <span className="font-semibold text-lg">
                  Waiting for Approval
                </span>
              </div>
              <p className="text-sm text-yellow-700">
                Your request has been sent. Please wait while the group admin
                accepts your request.
              </p>
              <p className="text-xs text-yellow-600 mt-2">
                You will be automatically redirected once approved.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {errorMsg}
                </div>
              )}
              <button
                onClick={handleJoin}
                disabled={requestJoinMutation.isPending}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                {requestJoinMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  "Request to Join"
                )}
              </button>
              <Link
                href="/c"
                className="block text-gray-500 text-sm hover:text-gray-700"
              >
                No thanks, take me home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
