import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  CloudIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const UserMenu = ({ isDark, onOpenLogin, onOpenAccountSettings }) => {
  const { user, signOut, syncStatus, lastSyncTime } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (!user) {
    return (
      <button
        onClick={onOpenLogin}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          isDark
            ? 'bg-blue-700 hover:bg-blue-600 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        <UserCircleIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Sign In</span>
      </button>
    );
  }

  const userInitial = user.email?.[0]?.toUpperCase() || '?';
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200'
        }`}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
          isDark ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'
        } ${avatarUrl ? 'hidden' : 'flex'}`}>
          {userInitial}
        </div>
        <span className="hidden sm:inline text-sm font-medium truncate max-w-[100px]">
          {displayName}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            className={`fixed inset-x-0 bottom-0 sm:absolute sm:right-0 sm:left-auto sm:top-full sm:mt-2 w-full sm:w-64 rounded-t-2xl sm:rounded-lg shadow-2xl border z-50 backdrop-blur-sm ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'
            }`}
            style={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
            }}
          >
            {/* User Info */}
            <div className={`p-4 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  isDark ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'
                } ${avatarUrl ? 'hidden' : 'flex'}`}>
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {displayName}
                  </p>
                  <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className={`py-2 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                <CloudIcon className={`w-5 h-5 ${
                  syncStatus === 'syncing' ? 'text-blue-500 animate-pulse' :
                  syncStatus === 'synced' ? 'text-green-500' :
                  syncStatus === 'error' ? 'text-red-500' :
                  'text-gray-400'
                }`} />
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Cloud Sync
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {syncStatus === 'syncing' && 'Syncing...'}
                    {syncStatus === 'synced' && 'Synced'}
                    {syncStatus === 'error' && 'Sync failed'}
                    {syncStatus === 'idle' && lastSyncTime && `Synced ${new Date(lastSyncTime).toLocaleTimeString()}`}
                    {syncStatus === 'idle' && !lastSyncTime && 'Auto-saving enabled'}
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAccountSettings();
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                <Cog6ToothIcon className="w-5 h-5 text-gray-400" />
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Account Settings
                </span>
              </button>
            </div>

            {/* Sign Out */}
            <div className={`p-2 border-t ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <button
                onClick={handleSignOut}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                  isDark
                    ? 'hover:bg-red-900/30 text-red-400'
                    : 'hover:bg-red-50 text-red-600'
                }`}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

UserMenu.propTypes = {
  isDark: PropTypes.bool.isRequired,
  onOpenLogin: PropTypes.func.isRequired,
  onOpenAccountSettings: PropTypes.func.isRequired,
};

export default UserMenu;
