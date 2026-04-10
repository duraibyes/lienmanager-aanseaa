import { User } from "lucide-react";
import { useState } from "react";
import { useGetProfileQuery } from "../../features/lienAuth/profileApi";
import EditLabelButton from "../Button/EditLabelButton";
import UpdateProfileModal from "../Parts/Profile/UpdateProfileModal";
import ChangeProfilePassword from "./ChangeProfilePassword";

const MemberProfile = () => {

  const { data, isFetching, refetch } = useGetProfileQuery();
  const [editType, setEditType] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const profile = data?.data || null;

  if (isFetching) {
    return (
      <div className="p-4 pb-20 mx-auto max-w-(--breakpoint-2xl) md:p-6 md:pb-24">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">

        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">

          <div className="space-y-6">
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              Fetching Profile data.....
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 mx-auto max-w-(--breakpoint-2xl) md:p-6 md:pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">

        <div className="space-y-6">
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between w-full">

              {/* LEFT SIDE (Profile Info) */}
              <div className="flex flex-col items-center gap-4 text-center xl:flex-row xl:text-left">

                {/* Avatar */}
                <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 flex items-center justify-center">
                  {profile?.user_details?.image ? (
                    <img
                      src={profile?.user_details?.image}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User className="w-8 h-8" />
                  )}
                </div>

                {/* Name + Company */}
                <div>
                  {profile?.user?.name && (
                    <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
                      {profile?.user?.name}
                    </h4>
                  )}

                  <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400 xl:flex-row xl:items-center xl:gap-3">
                    <p>{profile?.company?.company}</p>
                    <span className="hidden xl:block w-px h-4 bg-gray-300 dark:bg-gray-700"></span>
                    <p>{profile?.company?.website}</p>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE (Buttons) */}
              <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-center xl:justify-end xl:w-auto">

                <EditLabelButton
                  onclick={() => setEditType(true)}
                />

                <EditLabelButton
                  onclick={() => setShowPasswordForm(true)}
                  label="Change Password"
                />

              </div>
            </div>
          </div>
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      First Name
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {profile?.user_details?.first_name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Last Name
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {profile?.user_details?.first_name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Email address
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {profile?.user?.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {profile?.user_details?.phone || 'N/A'}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                  Address
                </h4>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Address
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {profile?.user_details?.address || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Country
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {profile?.user_details?.country || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      City/State
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {profile?.user_details?.city} {profile?.user_details?.state}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Zip
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {profile?.user_details?.zip_code || "N/A"}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UpdateProfileModal show={editType} onClose={() => setEditType(false)} data={profile} refetch={refetch} />
      <ChangeProfilePassword show={showPasswordForm} onClose={() => setShowPasswordForm(false)} />
    </div>
  );
};

export default MemberProfile;
