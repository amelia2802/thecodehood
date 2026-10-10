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
