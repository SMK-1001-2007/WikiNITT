import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  UPDATE_GROUP,
  UPLOAD_USER_IMAGE_MUTATION,
  GENERATE_GROUP_INVITE,
  ACCEPT_JOIN_REQUEST,
  REJECT_JOIN_REQUEST,
  REMOVE_MEMBER,
} from "@/queries/community";
import { X, Camera, Loader2, Copy, Check, UserMinus } from "lucide-react";
import { print } from "graphql";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PublicUser {
  id: string;
  name: string;
  username: string;
  avatar?: string | null;
}

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: {
    id: string;
    name: string;
    description: string;
    icon?: string | null;
    slug: string;
    type?: string;
    inviteToken?: string | null;
    joinRequests?: PublicUser[] | null;
    members?: PublicUser[] | null;
  };
}

interface GroupFormData {
  name: string;
  description: string;
  icon: string;
}

export const EditGroupModal: React.FC<EditGroupModalProps> = ({
  isOpen,
  onClose,
  group,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState<string>(group.icon || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<GroupFormData>({
    defaultValues: {
      name: group.name,
      description: group.description,
      icon: group.icon || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: group.name,
        description: group.description,
        icon: group.icon || "",
      });
      setPreviewImage(group.icon || "");
      setError(null);
    }
  }, [isOpen, reset]);

  const getClient = () => {
    if (!session?.backendToken) return null;
    return new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_API_URL!, {
      headers: { Authorization: `Bearer ${session.backendToken}` },
    });
  };

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!session?.backendToken) throw new Error("Not authenticated");

      const formData = new FormData();
      const operations = {
        query: print(UPLOAD_USER_IMAGE_MUTATION),
        variables: {
          file: null,
        },
      };
      formData.append("operations", JSON.stringify(operations));
      formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
      formData.append("0", file);

      const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_API_URL!, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.backendToken}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      return result.data.uploadUserImage;
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: async (data: GroupFormData) => {
      const client = getClient();
      if (!client) throw new Error("Not authenticated");
      return client.request(UPDATE_GROUP, {
        groupId: group.id,
        name: data.name,
        description: data.description,
        icon: data.icon,
      });
    },
    onSuccess: async (data: any) => {
      const newSlug = data?.updateGroup?.slug;
      queryClient.invalidateQueries({ queryKey: ["group", group.slug] });
      onClose();
      if (newSlug !== group.slug) {
        router.push(`/c/${newSlug}`);
      } else {
        router.refresh();
      }
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to update group");
    },
  });

  const generateInviteMutation = useMutation({
    mutationFn: async () => {
      const client = getClient();
      if (!client) throw new Error("Not authenticated");
      return client.request(GENERATE_GROUP_INVITE, { groupId: group.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", group.slug] });
    },
  });

  const acceptRequestMutation = useMutation({
    mutationFn: async (userId: string) => {
      const client = getClient();
      if (!client) throw new Error("Not authenticated");
      return client.request(ACCEPT_JOIN_REQUEST, {
        groupId: group.id,
        userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", group.slug] });
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: async (userId: string) => {
      const client = getClient();
      if (!client) throw new Error("Not authenticated");
      return client.request(REJECT_JOIN_REQUEST, {
        groupId: group.id,
        userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", group.slug] });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      const client = getClient();
      if (!client) throw new Error("Not authenticated");
      return client.request(REMOVE_MEMBER, {
        groupId: group.id,
        userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", group.slug] });
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("File must be an image");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      const url = await uploadImageMutation.mutateAsync(file);
      setValue("icon", url);
    } catch (err) {
      setError((err as Error).message || "Failed to upload image");
      setPreviewImage(group.icon || "");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: GroupFormData) => {
    updateGroupMutation.mutate(data);
  };

  const copyInviteLink = () => {
    if (group.inviteToken) {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const url = `${origin}/community/invite/${group.inviteToken}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Manage Group</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              {group.type !== "PUBLIC" && (
                <TabsTrigger value="requests">Requests & Invites</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="settings">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                      {previewImage ? (
                        <Image
                          src={previewImage}
                          alt="Group Icon Preview"
                          className="w-full h-full object-cover"
                          width={96}
                          height={96}
                        />
                      ) : (
                        <span className="text-2xl text-gray-400 font-bold">
                          {group.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <label
                      htmlFor="icon-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </label>
                    <input
                      id="icon-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={uploading || isSubmitting}
                    />
                  </div>
                  {uploading && (
                    <p className="text-sm text-blue-600 mt-2">Uploading...</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Group name is required",
                      minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters",
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={isSubmitting || uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || uploading}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {(isSubmitting || uploading) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="members">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Members ({group.members?.length || 0})
                </h3>
                <div className="bg-gray-50 rounded-md max-h-96 overflow-y-auto p-2">
                  {group.members && group.members.length > 0 ? (
                    group.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-md mb-2 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                            {member.avatar ? (
                              <Image
                                src={member.avatar}
                                alt={member.name}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span className="text-gray-500 font-medium">
                                {member.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {member.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              @{member.username}
                            </p>
                          </div>
                        </div>
                        {member.id !== session?.user?.id && (
                          <button
                            onClick={() =>
                              removeMemberMutation.mutate(member.id)
                            }
                            disabled={removeMemberMutation.isPending}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                            title="Remove member"
                          >
                            {removeMemberMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <UserMinus className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No members found.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            {group.type !== "PUBLIC" && (
              <TabsContent value="requests">
                <div className="space-y-8">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="text-md font-medium text-blue-900 mb-2">
                      Invite Link
                    </h3>
                    <p className="text-xs text-blue-700 mb-3">
                      Share this link to invite users to your private group.
                    </p>

                    {group.inviteToken ? (
                      <>
                        <div className="flex gap-2">
                          <input
                            readOnly
                            className="flex-1 bg-white border border-blue-200 text-sm text-gray-600 px-3 py-2 rounded-md outline-none"
                            value={`${
                              typeof window !== "undefined"
                                ? window.location.origin
                                : ""
                            }/community/invite/${group.inviteToken}`}
                          />
                          <button
                            onClick={copyInviteLink}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition-colors"
                            title="Copy Link"
                          >
                            {copied ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <div className="mt-2 text-right">
                          <button
                            onClick={() => generateInviteMutation.mutate()}
                            disabled={generateInviteMutation.isPending}
                            className="text-xs text-red-600 hover:text-red-700 hover:underline"
                          >
                            {generateInviteMutation.isPending
                              ? "Regenerating..."
                              : "Revoke & Regenerate Link"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => generateInviteMutation.mutate()}
                        disabled={generateInviteMutation.isPending}
                        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                      >
                        {generateInviteMutation.isPending && (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        )}
                        Generate Invite Link
                      </button>
                    )}
                    <p className="text-[10px] text-blue-500 mt-2">
                      * Anyone with this link can request to join.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Join Requests ({group.joinRequests?.length || 0})
                    </h3>
                    <div className="bg-gray-50 rounded-md max-h-60 overflow-y-auto p-2">
                      {group.joinRequests && group.joinRequests.length > 0 ? (
                        group.joinRequests.map((req) => (
                          <div
                            key={req.id}
                            className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-md mb-2 shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                                {req.avatar ? (
                                  <Image
                                    src={req.avatar}
                                    alt={req.name}
                                    width={40}
                                    height={40}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <span className="text-gray-500 font-medium">
                                    {req.name.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {req.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  @{req.username}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  rejectRequestMutation.mutate(req.id)
                                }
                                className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                                title="Reject"
                              >
                                {rejectRequestMutation.isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  acceptRequestMutation.mutate(req.id)
                                }
                                className="text-green-600 hover:bg-green-50 p-2 rounded-full transition-colors"
                                title="Accept"
                              >
                                {acceptRequestMutation.isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">
                          No pending requests.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};
