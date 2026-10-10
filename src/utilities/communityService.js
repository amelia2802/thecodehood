import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { data as sampleCommunities } from '../data.js';

// Local storage key for persistent in-browser fallback when Supabase is not configured
const LOCAL_STORAGE_APPROVED_KEY = 'thecodehood_approved_communities';
const LOCAL_STORAGE_SUBMISSIONS_KEY = 'thecodehood_pending_submissions';

/**
 * Fetch approved communities from Supabase (or fallback persistent cache)
 */
export async function getApprovedCommunities() {
    if (isSupabaseConfigured && supabase) {
        try {
            const { data, error } = await supabase
                .from('communities')
                .select('*')
                .eq('status', 'approved')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase fetch error:', error);
                throw new Error(error.message || 'Failed to fetch communities from database.');
            }

            return {
                data: data || [],
                source: 'supabase',
                error: null
            };
        } catch (err) {
            console.error('Database connection error:', err);
            return {
                data: [],
                source: 'supabase',
                error: err.message || 'Unable to connect to Supabase database.'
            };
        }
    }

    // Fallback: Read from localStorage or initial sample communities
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            const stored = window.localStorage.getItem(LOCAL_STORAGE_APPROVED_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return { data: parsed, source: 'local', error: null };
            }
        } catch (e) {
            console.warn('LocalStorage read error:', e);
        }
    }

    return { data: sampleCommunities, source: 'seed', error: null };
}

/**
 * Submit a community to Supabase with status enforced as 'pending'
 */
export async function submitCommunity(communityData) {
    // Enforce pending status and required fields
    const payload = {
        name: communityData.name.trim(),
        description: communityData.description.trim(),
        city: (communityData.city || '').trim(),
        state: (communityData.state || '').trim(),
        country: (communityData.country || '').trim(),
        postal_code: (communityData.postal_code || communityData.zip || '').trim(),
        technologies: communityData.technologies || [],
        format: communityData.format,
        website_url: communityData.website_url.trim(),
        status: 'pending' // Enforce moderation requirement
    };

    if (isSupabaseConfigured && supabase) {
        try {
            const { data, error } = await supabase
                .from('communities')
                .insert([payload])
                .select()
                .single();

            if (error) {
                console.error('Supabase submission insert error:', error);
                return {
                    success: false,
                    data: null,
                    error: error.message || 'Database error occurred during submission.'
                };
            }

            return {
                success: true,
                data,
                error: null
            };
        } catch (err) {
            return {
                success: false,
                data: null,
                error: err.message || 'Network error connecting to database.'
            };
        }
    }

    // Local persistent fallback: Save to localStorage pending array if in browser
    const newRecord = {
        ...payload,
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString()
    };

    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            const existingSubmissions = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY) || '[]');
            existingSubmissions.unshift(newRecord);
            window.localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(existingSubmissions));
        } catch (e) {
            console.warn('LocalStorage write error:', e);
        }
    }

    return {
        success: true,
        data: newRecord,
        error: null
    };
}

/**
 * Fetch pending submissions for authorized moderation review
 */
export async function getPendingSubmissions(moderatorSecret = '') {
    if (isSupabaseConfigured && supabase) {
        try {
            // Unauthenticated callers without valid key will be rejected by RLS
            if (moderatorSecret !== 'codehood_admin_key') {
                return {
                    data: [],
                    error: 'Unauthorized: Access restricted to authorized moderators.'
                };
            }

            const { data, error } = await supabase
                .from('communities')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) {
                return { data: [], error: error.message };
            }

            return { data: data || [], error: null };
        } catch (err) {
            return { data: [], error: err.message };
        }
    }

    // Local persistent fallback
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            const stored = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY) || '[]');
            return { data: stored.filter(s => s.status === 'pending'), error: null };
        } catch (e) {
            return { data: [], error: e.message };
        }
    }

    return { data: [], error: null };
}

/**
 * Moderate a community listing (approve or reject)
 * Restricts approval/rejection to authorized moderator credentials
 */
export async function moderateCommunity(communityId, newStatus, moderatorSecret = '') {
    if (!['approved', 'rejected'].includes(newStatus)) {
        return {
            success: false,
            data: null,
            error: 'Invalid status. Can only be approved or rejected.'
        };
    }

    // Check authorization: must provide authorized moderator secret or session
    if (!moderatorSecret || moderatorSecret !== 'codehood_admin_key') {
        return {
            success: false,
            data: null,
            error: 'Unauthorized: only authorized moderators can approve or reject listings.'
        };
    }

    if (isSupabaseConfigured && supabase) {
        try {
            const { data, error } = await supabase.rpc('moderate_community', {
                community_id: communityId,
                new_status: newStatus,
                moderator_secret: moderatorSecret
            });

            if (error) {
                return { success: false, data: null, error: error.message };
            }

            return { success: true, data, error: null };
        } catch (err) {
            return { success: false, data: null, error: err.message };
        }
    }

    // Local fallback moderation
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            const submissions = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY) || '[]');
            const index = submissions.findIndex(s => s.id === communityId);
            if (index !== -1) {
                submissions[index].status = newStatus;
                window.localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(submissions));

                // If approved, also add to approved list
                if (newStatus === 'approved') {
                    const approvedList = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_APPROVED_KEY) || '[]');
                    approvedList.unshift(submissions[index]);
                    window.localStorage.setItem(LOCAL_STORAGE_APPROVED_KEY, JSON.stringify(approvedList));
                }

                return { success: true, data: submissions[index], error: null };
            }
        } catch (e) {
            return { success: false, data: null, error: e.message };
        }
    }

    return {
        success: true,
        data: { id: communityId, status: newStatus },
        error: null
    };
}

/**
 * Guarded edit operation - Ordinary visitors cannot edit listings
 */
export async function updateCommunity(communityId, updates, moderatorSecret = '') {
    if (!moderatorSecret || moderatorSecret !== 'codehood_admin_key') {
        return {
            success: false,
            error: 'Unauthorized: ordinary visitors cannot edit community listings.'
        };
    }

    if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
            .from('communities')
            .update(updates)
            .eq('id', communityId)
            .select();

        return { success: !error, data, error: error?.message || null };
    }

    return { success: true, error: null };
}

/**
 * Guarded delete operation - Ordinary visitors cannot delete listings
 */
export async function deleteCommunity(communityId, moderatorSecret = '') {
    if (!moderatorSecret || moderatorSecret !== 'codehood_admin_key') {
        return {
            success: false,
            error: 'Unauthorized: ordinary visitors cannot delete community listings.'
        };
    }

    if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
            .from('communities')
            .delete()
            .eq('id', communityId);

        return { success: !error, error: error?.message || null };
    }

    return { success: true, error: null };
}

