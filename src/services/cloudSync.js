import { supabase } from '../lib/supabase';

/**
 * Fetch all tabs for the current user from Supabase
 */
export const fetchTabsFromCloud = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_tabs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Transform database format to app format
    return data.map(tab => ({
      id: tab.tab_id,
      name: tab.name,
      content: tab.content,
      updatedAt: tab.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching tabs from cloud:', error);
    return null;
  }
};

/**
 * Save all tabs to Supabase (upsert)
 */
export const syncTabsToCloud = async (tabs, userId) => {
  try {
    // Transform app format to database format
    const tabsToSync = tabs.map(tab => ({
      user_id: userId,
      tab_id: tab.id,
      name: tab.name,
      content: tab.content,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('user_tabs')
      .upsert(tabsToSync, {
        onConflict: 'user_id,tab_id',
        ignoreDuplicates: false,
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error syncing tabs to cloud:', error);
    return false;
  }
};

/**
 * Sync a single tab to cloud (used for real-time updates)
 */
export const syncSingleTab = async (tab, userId) => {
  try {
    const { error } = await supabase
      .from('user_tabs')
      .upsert({
        user_id: userId,
        tab_id: tab.id,
        name: tab.name,
        content: tab.content,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,tab_id',
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error syncing single tab:', error);
    return false;
  }
};

/**
 * Delete a tab from cloud
 */
export const deleteTabFromCloud = async (tabId, userId) => {
  try {
    const { error } = await supabase
      .from('user_tabs')
      .delete()
      .eq('user_id', userId)
      .eq('tab_id', tabId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting tab from cloud:', error);
    return false;
  }
};

/**
 * Merge local and cloud tabs on login
 * Strategy: Keep both, but cloud tabs take precedence for conflicts
 */
export const mergeLocalAndCloudTabs = (localTabs, cloudTabs) => {
  if (!cloudTabs || cloudTabs.length === 0) {
    return localTabs;
  }

  if (!localTabs || localTabs.length === 0) {
    return cloudTabs;
  }

  // Create a map of cloud tabs by ID
  const cloudTabsMap = new Map();
  cloudTabs.forEach(tab => {
    cloudTabsMap.set(tab.id, tab);
  });

  // Merge: cloud tabs take precedence, then add local-only tabs
  const mergedTabs = [...cloudTabs];

  localTabs.forEach(localTab => {
    if (!cloudTabsMap.has(localTab.id)) {
      // This tab only exists locally, add it
      mergedTabs.push(localTab);
    }
  });

  return mergedTabs;
};

/**
 * Delete all tabs for a user from cloud (used on sign out if needed)
 */
export const clearCloudTabs = async (userId) => {
  try {
    const { error } = await supabase
      .from('user_tabs')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error clearing cloud tabs:', error);
    return false;
  }
};
