import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  XMarkIcon,
  UserCircleIcon,
  EnvelopeIcon,
  KeyIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const AccountSettings = ({ isOpen, onClose, isDark }) => {
  const { user, updatePassword, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Profile form state
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [cloudinaryWidget, setCloudinaryWidget] = useState(null);

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }
  }, [user?.user_metadata?.full_name, user?.user_metadata?.avatar_url, isOpen]);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Initialize Cloudinary Upload Widget
  useEffect(() => {
    if (!user) return; // Wait for user to be available

    // Load Cloudinary script
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        initCloudinaryWidget();
      };
    } else {
      initCloudinaryWidget();
    }

    return () => {
      // Cleanup if needed
    };
  }, [user]); // Re-init when user changes

  const initCloudinaryWidget = () => {
    if (!window.cloudinary || !user) return;

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
        maxFileSize: 5000000, // 5MB
        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
        cropping: true,
        croppingAspectRatio: 1,
        croppingShowDimensions: true,

        // Fixed public_id per user - same filename for consistency
        publicId: `user_${user.id}_avatar`,

        folder: 'markdown-previewer/avatars',
        tags: ['avatar', 'profile'],
        context: { alt: 'user_avatar' },
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary widget error:', error);
          setMessage({ type: 'error', text: 'Error uploading image!' });
          setUploading(false);
          return;
        }

        if (result.event === 'success') {
          const newAvatarUrl = result.info.secure_url;
          setAvatarUrl(newAvatarUrl);
          setUploading(false);

          // Immediately update user profile in Supabase
          supabase.auth.updateUser({
            data: {
              avatar_url: newAvatarUrl,
            },
          }).then(({ error }) => {
            if (error) {
              console.error('Avatar update error:', error);
              setMessage({ type: 'error', text: 'Failed to save avatar!' });
            } else {
              setMessage({ type: 'success', text: 'Avatar successfully updated!' });
            }
          });
        }
      }
    );

    setCloudinaryWidget(widget);
  };

  const handleUploadClick = () => {
    if (cloudinaryWidget) {
      setUploading(true);
      cloudinaryWidget.open();
    } else {
      setMessage({
        type: 'error',
        text: 'Upload widget is not ready. Please try again.'
      });
    }
  };

  const extractPublicIdFromUrl = (url) => {
    if (!url) return null;
    try {
      // Cloudinary URL format: https://res.cloudinary.com/[cloud_name]/image/upload/[version]/[public_id].[format]
      const parts = url.split('/');
      const uploadIndex = parts.indexOf('upload');
      if (uploadIndex === -1) return null;

      // Get everything after 'upload/' and before the file extension
      const pathAfterUpload = parts.slice(uploadIndex + 1).join('/');
      // Remove version number if exists (v1234567890)
      const withoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
      // Remove file extension
      const publicId = withoutVersion.replace(/\.[^.]+$/, '');

      return publicId;
    } catch (error) {
      console.error('Error extracting public_id:', error);
      return null;
    }
  };

  const handleRemoveAvatar = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Extract public_id from current avatar URL
      const publicId = extractPublicIdFromUrl(avatarUrl);

      // Note: Direct deletion from frontend requires API credentials
      // For security, Cloudinary images should be deleted via backend
      // For now, we'll just remove the reference from Supabase
      // Images will be cleaned up manually or via Cloudinary auto-delete rules

      if (publicId) {
        console.log('Image to be deleted:', publicId);
        // TODO: Call backend API to delete from Cloudinary
        // await fetch('/api/delete-avatar', {
        //   method: 'POST',
        //   body: JSON.stringify({ publicId })
        // });
      }

      // Remove from Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          avatar_url: null,
        },
      });

      if (error) throw error;

      setAvatarUrl('');
      setMessage({
        type: 'success',
        text: 'Avatar removed!'
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatarUrl,
        },
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile successfully updated!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters!' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await updatePassword(newPassword);
      if (error) throw error;

      setMessage({ type: 'success', text: 'Password successfully updated!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Delete user's data from Supabase (tabs)
      const { error: deleteError } = await supabase
        .from('tabs')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Delete user account
      const { error: authError } = await supabase.rpc('delete_user');

      if (authError) {
        // If RPC doesn't exist, just sign out
        console.warn('RPC delete_user not found, signing out instead');
        setMessage({
          type: 'error',
          text: 'Account deletion feature is not yet active. Please contact support.'
        });
        setLoading(false);
        return;
      }

      await signOut();
      onClose();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
            isDark
              ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700'
              : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200'
          } animate-scale-in`}
        >
          {/* Header */}
          <div
            className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <h2
              className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Account Settings
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-300'
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
              }`}
              aria-label="Close"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Message */}
            {message.text && (
              <div
                className={`flex items-center gap-3 p-4 rounded-lg ${
                  message.type === 'success'
                    ? isDark
                      ? 'bg-green-900/30 border border-green-700/50 text-green-300'
                      : 'bg-green-50 border border-green-200 text-green-700'
                    : isDark
                    ? 'bg-red-900/30 border border-red-700/50 text-red-300'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  <ExclamationTriangleIcon className="w-5 h-5" />
                )}
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            {/* User Info (Read-only) */}
            <div
              className={`p-4 rounded-xl ${
                isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Avatar Preview */}
                <div className="relative">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border-4 border-blue-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl border-4 ${
                      isDark ? 'bg-blue-700 text-white border-blue-600' : 'bg-blue-500 text-white border-blue-400'
                    } ${avatarUrl ? 'hidden' : 'flex'}`}
                  >
                    {user?.email?.[0]?.toUpperCase() || '?'}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <EnvelopeIcon className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Email
                    </p>
                  </div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Settings */}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <h3
                className={`text-lg font-semibold flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                <UserCircleIcon className="w-5 h-5" />
                Profile Information
              </h3>

              <div className="space-y-4">
                {/* Avatar Upload Section */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-3 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    {/* Avatar Preview */}
                    <div className="relative">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="w-20 h-20 rounded-full object-cover border-4 border-blue-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl border-4 ${
                          isDark ? 'bg-blue-700 text-white border-blue-600' : 'bg-blue-500 text-white border-blue-400'
                        } ${avatarUrl ? 'hidden' : 'flex'}`}
                      >
                        {user?.email?.[0]?.toUpperCase() || '?'}
                      </div>
                    </div>

                    {/* Upload Button */}
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      disabled={uploading}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                        uploading
                          ? 'bg-slate-500 cursor-not-allowed text-white'
                          : isDark
                          ? 'bg-blue-700 hover:bg-blue-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <PhotoIcon className="w-5 h-5" />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        disabled={loading}
                        className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                          loading
                            ? 'bg-slate-500 cursor-not-allowed text-white'
                            : isDark
                            ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400'
                            : 'bg-red-50 hover:bg-red-100 text-red-600'
                        }`}
                      >
                        {loading ? 'Removing...' : 'Remove'}
                      </button>
                    )}
                  </div>
                  <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    PNG, JPG, GIF or WebP format, maximum 5MB
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-lg font-semibold text-white transition-all ${
                  loading
                    ? 'bg-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg'
                }`}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>

            {/* Password Change */}
            <div className={`border-t pt-6 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <h3
                  className={`text-lg font-semibold flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <KeyIcon className="w-5 h-5" />
                  Change Password
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                        isDark
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      New Password (Confirm)
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                        isDark
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !newPassword || !confirmPassword}
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold text-white transition-all ${
                    loading || !newPassword || !confirmPassword
                      ? 'bg-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* Danger Zone */}
            <div
              className={`border-t pt-6 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
            >
              <h3
                className={`text-lg font-semibold flex items-center gap-2 mb-4 ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`}
              >
                <ExclamationTriangleIcon className="w-5 h-5" />
                Danger Zone
              </h3>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold transition-colors ${
                    isDark
                      ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-700/50'
                      : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                  }`}
                >
                  <TrashIcon className="w-5 h-5" />
                  Delete Account
                </button>
              ) : (
                <div
                  className={`p-4 rounded-lg space-y-4 ${
                    isDark
                      ? 'bg-red-900/30 border border-red-700/50'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      isDark ? 'text-red-300' : 'text-red-700'
                    }`}
                  >
                    ⚠️ This action cannot be undone! All your data will be permanently deleted.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-white transition-all ${
                        loading
                          ? 'bg-slate-500 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {loading ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-colors ${
                        isDark
                          ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

AccountSettings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
};

export default AccountSettings;
