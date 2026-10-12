/**
 * Service for communicating with TheCodeHood Community Matchmaker backend.
 * Uses VITE_API_URL when set (e.g. for deployed Render backend), or relative path for local dev proxy.
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function fetchCommunityPlan({
  interest,
  location,
  preferredMeetup,
  socialComfort,
  isMock = false,
  signal,
}) {
  const url = `${API_BASE_URL}/api/matchmaker`;

  const payload = {
    interest: (interest || '').trim(),
    location: (location || '').trim(),
    preferredMeetup,
    socialComfort,
    isMock,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Received an unexpected response from the matchmaker server.');
  }

  if (!response.ok) {
    const errorMsg =
      data?.error ||
      (data?.details && Object.values(data.details).join(' ')) ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export async function checkMatchmakerHealth() {
  try {
    const url = `${API_BASE_URL}/api/health`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
