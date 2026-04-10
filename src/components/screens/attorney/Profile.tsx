import { useState } from 'react';
import { User, Camera, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Template from '../../layout/attorney/Template';
import { useGetProfileQuery } from '../../../features/lienAuth/profileApi';
import ChangePassword from './ChangePassword';

export default function Profile() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  const { data, isFetching } = useGetProfileQuery();

  const profile = data?.data || null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' });
  };

  if (isFetching) {
    return (
      <Template currentPage="profile">
        <div className="p-8">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </Template>
    );
  }

  if (!profile) {
    return (
      <Template currentPage="profile">
        <div className="p-8">
          <p className="text-gray-500">Profile not found...</p>
        </div>
      </Template>
    );
  }
  console.log(' prfoile ', profile);
  return (
    <Template currentPage="profile">
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <button 
            onClick={() => navigate("/attorney/profile/update")}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-full flex items-center justify-center">
                    {profile?.user_details.image ? (
                      <img
                        src={profile?.user_details?.image}
                        alt="Profile"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    User {profile?.lien?.firstName} {profile?.lien?.lastName}
                  </h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{profile?.lien?.role_name}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">First Name</p>
                      <p className="text-base text-gray-900">{profile?.lien?.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Last Name</p>
                      <p className="text-base text-gray-900">{profile?.lien?.lastName}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-600">Role</p>
                      </div>
                      <p className="text-base text-gray-900">{profile?.lien?.role_name || 'Admin'}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-400">✉</span>
                        <p className="text-sm text-gray-600">Email</p>
                      </div>
                      <p className="text-base text-gray-900">{profile?.lien?.email || 'Not provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-400">📞</span>
                        <p className="text-sm text-gray-600">Phone</p>
                      </div>
                      <p className="text-base text-gray-900">{profile?.user_details.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-400">📍</span>
                        <p className="text-sm text-gray-600">Street Address</p>
                      </div>
                      <p className="text-base text-gray-900">{profile?.lien.address || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">City</p>
                      <p className="text-base text-gray-900">{profile?.lien.city || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">ZIP Code</p>
                      <p className="text-base text-gray-900">{profile?.lien.zip || 'Not provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">States</p>
                      <p className="text-base text-gray-900">
                        {profile?.lien?.states.length > 0
                          ? profile?.lien?.states.map((s: any) => s.state.name).join(", ")
                          : "None"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-400">🏢</span>
                        <p className="text-sm text-gray-600">Company</p>
                      </div>
                      <p className="text-base text-gray-900">{profile?.lien?.company || 'No company'}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-400">📅</span>
                        <p className="text-sm text-gray-600">Member Since</p>
                      </div>
                      <p className="text-base text-gray-900">{formatDate(profile?.lien.created_at)}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Key className="w-5 h-5" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showPasswordModal && (
          <ChangePassword setShowPasswordModal={() => setShowPasswordModal(false)} />
        )}
      </div>
    </Template>
  );
}
