import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../lib/supabase';
import {
  fetchTabsFromCloud,
  syncTabsToCloud,
  syncSingleTab,
  deleteTabFromCloud,
  mergeLocalAndCloudTabs,
} from '../services/cloudSync';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'synced', 'error'
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign up with email
  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  };

  // Sign in with email
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { data, error };
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  // Reset password
  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  };

  // Update password
  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  };

  // Cloud sync functions
  const syncToCloud = async (tabs) => {
    if (!user) return false;

    setSyncStatus('syncing');
    const success = await syncTabsToCloud(tabs, user.id);

    if (success) {
      setSyncStatus('synced');
      setLastSyncTime(new Date());
      setTimeout(() => setSyncStatus('idle'), 2000);
    } else {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }

    return success;
  };

  const fetchFromCloud = async () => {
    if (!user) return null;

    setSyncStatus('syncing');
    const cloudTabs = await fetchTabsFromCloud(user.id);

    if (cloudTabs) {
      setSyncStatus('synced');
      setLastSyncTime(new Date());
      setTimeout(() => setSyncStatus('idle'), 2000);
    } else {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }

    return cloudTabs;
  };

  const syncSingleTabToCloud = async (tab) => {
    if (!user) return false;

    setSyncStatus('syncing');
    const success = await syncSingleTab(tab, user.id);

    if (success) {
      setSyncStatus('synced');
      setLastSyncTime(new Date());
      setTimeout(() => setSyncStatus('idle'), 2000);
    } else {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }

    return success;
  };

  const deleteTabFromCloudById = async (tabId) => {
    if (!user) return false;

    setSyncStatus('syncing');
    const success = await deleteTabFromCloud(tabId, user.id);

    if (success) {
      setSyncStatus('synced');
      setLastSyncTime(new Date());
      setTimeout(() => setSyncStatus('idle'), 2000);
    } else {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }

    return success;
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    syncToCloud,
    fetchFromCloud,
    syncSingleTabToCloud,
    deleteTabFromCloudById,
    mergeLocalAndCloudTabs,
    syncStatus,
    lastSyncTime,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
