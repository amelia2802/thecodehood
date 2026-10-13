import { useState, useRef } from 'react';
import { fetchCommunityPlan } from '../utilities/matchmakerService';
import {
  IoFootstepsOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
  IoRefreshOutline,
  IoHeartOutline,
  IoLocationOutline,
  IoCompassOutline,
  IoGlobeOutline,
  IoPeopleOutline,
  IoCheckmarkSharp,
} from 'react-icons/io5';

const PRESET_INTERESTS = [
  'web development',
  'AI',
  'open source',
  'cybersecurity',
  'design',
  'Women in Tech',
  'other',
];

const MEETUP_OPTIONS = [
  { value: 'in_person', label: 'In-Person', desc: 'Face-to-face meetups' },
  { value: 'online', label: 'Online', desc: 'Remote webinars & calls' },
  { value: 'either', label: 'Either', desc: 'Open to both' },
];

const COMFORT_OPTIONS = [
  {
    value: "I'm new to meetups",
    label: "I'm new to meetups",
    tip: 'Gentle intro, observe first',
  },
  {
    value: "I'm a little nervous",
    label: "I'm a little nervous",
    tip: 'Low pressure, 1-on-1 pacing',
  },
  {
    value: "I'm ready to network",
    label: "I'm ready to network",
    tip: 'Active collaboration & talks',
  },
];

export default function CommunityMatchmaker() {
  const resultRef = useRef(null);

  // Form State
  const [selectedInterest, setSelectedInterest] = useState('web development');
  const [customInterest, setCustomInterest] = useState('');
  const [location, setLocation] = useState('');
  const [preferredMeetup, setPreferredMeetup] = useState('in_person');
  const [socialComfort, setSocialComfort] = useState("I'm a little nervous");

  // Interaction State
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [planResult, setPlanResult] = useState(null);
  const [checkedChecklist, setCheckedChecklist] = useState({});

  const activeInterest =
    selectedInterest === 'other' ? customInterest.trim() : selectedInterest;

  const handleToggleChecklist = (idx) => {
    setCheckedChecklist((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Client Validation
    if (!location.trim()) {
      setFormError('Please enter your city, state, or ZIP code to find nearby plans.');
      return;
    }

    if (selectedInterest === 'other' && !customInterest.trim()) {
      setFormError('Please specify your tech interest.');
      return;
    }

    setIsLoading(true);
    setCheckedChecklist({});

    try {
      const response = await fetchCommunityPlan({
        interest: activeInterest,
        location: location.trim(),
        preferredMeetup,
        socialComfort,
      });

      if (response?.plan) {
        setPlanResult(response.plan);
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      } else {
        throw new Error('Could not parse plan details. Please try again.');
      }
    } catch (err) {
      console.error('Matchmaker request error:', err);
      setFormError(err.message || 'Unable to generate community plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDemoPlan = async () => {
    setIsLoading(true);
    setFormError(null);
    setCheckedChecklist({});

    try {
      const response = await fetchCommunityPlan({
        interest: activeInterest || 'web development',
        location: location.trim() || 'Boston, MA',
        preferredMeetup,
        socialComfort,
        isMock: true,
      });

      if (response?.plan) {
        setPlanResult(response.plan);
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    } catch (err) {
      setFormError(err.message || 'Unable to load demo plan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPlanResult(null);
    setFormError(null);
    setCheckedChecklist({});
  };

  return (
    <section
      id="community-matchmaker"
      aria-label="Community Matchmaker"
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-2"
    >
      <div className="bg-[#fffdfa] rounded-2xl border border-[#8b5b30]/20 shadow-md overflow-hidden">
        <div className="bg-linear-to-r from-[#8b5b30]/15 via-[#d2b8a0]/30 to-[#8b5b30]/15 px-6 py-6 sm:px-8 sm:py-8 border-b border-[#8b5b30]/15">

          <h2 className="text-2xl sm:text-3xl font-bold text-[#5A321A] tracking-tight">
            Networking Planner
          </h2>
          <p className="mt-2 text-base sm:text-lg text-[#402e32] max-w-2xl leading-relaxed">
            Never leave a meetup without making a new friend
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {!planResult ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#5A321A] mb-2">
                  What tech topics spark your curiosity?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PRESET_INTERESTS.map((interest) => {
                    const isSelected = selectedInterest === interest;
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => setSelectedInterest(interest)}
                        className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-all text-center capitalize cursor-pointer ${
                          isSelected
                            ? 'bg-[#8b5b30] text-[#faf6f0] border-[#8b5b30] shadow-xs'
                            : 'bg-[#faf6f0]/60 text-[#402e32] border-[#8b5b30]/25 hover:bg-[#8b5b30]/10 hover:border-[#8b5b30]/40'
                        }`}
                      >
                        {interest === 'other' ? 'Other topic…' : interest}
                      </button>
                    );
                  })}
                </div>

                {selectedInterest === 'other' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={customInterest}
                      onChange={(e) => setCustomInterest(e.target.value)}
                      placeholder="e.g. Rust, Cloud DevOps, Game Dev, Mobile..."
                      maxLength={60}
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#8b5b30]/30 bg-[#faf6f0] text-[#402e32] focus:outline-none focus:ring-2 focus:ring-[#8b5b30]/40"
                    />
                  </div>
                )}
              </div>

              {/* Location Input */}
              <div>
                <label
                  htmlFor="matchmaker-location"
                  className="block text-sm font-semibold text-[#5A321A] mb-1.5"
                >
                  Your Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8b5b30]">
                    <IoLocationOutline className="text-lg" />
                  </div>
                  <input
                    id="matchmaker-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter city, state, or ZIP code (e.g. Boston, MA or 02210)"
                    maxLength={100}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-[#8b5b30]/30 bg-[#faf6f0] text-[#402e32] placeholder:text-[#8b5b30]/60 focus:outline-none focus:ring-2 focus:ring-[#8b5b30]/40"
                  />
                </div>
                <p className="mt-1 text-xs text-[#8b5b30]">
                  Used solely to ground local offline recommendations; never stored or shared.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#5A321A] mb-2">
                    Preferred meetup format
                  </label>
                  <div className="space-y-2">
                    {MEETUP_OPTIONS.map((opt) => {
                      const isSelected = preferredMeetup === opt.value;
                      return (
                        <label
                          key={opt.value}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#8b5b30]/10 border-[#8b5b30] shadow-xs'
                              : 'bg-[#faf6f0]/50 border-[#8b5b30]/20 hover:bg-[#8b5b30]/5'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="preferredMeetup"
                              value={opt.value}
                              checked={isSelected}
                              onChange={() => setPreferredMeetup(opt.value)}
                              className="accent-[#8b5b30] h-4 w-4"
                            />
                            <span className="text-sm font-medium text-[#402e32]">
                              {opt.label}
                            </span>
                          </div>
                          <span className="text-xs text-[#8b5b30]">{opt.desc}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#5A321A] mb-2">
                    Social comfort & energy level
                  </label>
                  <div className="space-y-2">
                    {COMFORT_OPTIONS.map((opt) => {
                      const isSelected = socialComfort === opt.value;
                      return (
                        <label
                          key={opt.value}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#8b5b30]/10 border-[#8b5b30] shadow-xs'
                              : 'bg-[#faf6f0]/50 border-[#8b5b30]/20 hover:bg-[#8b5b30]/5'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="socialComfort"
                              value={opt.value}
                              checked={isSelected}
                              onChange={() => setSocialComfort(opt.value)}
                              className="accent-[#8b5b30] h-4 w-4"
                            />
                            <span className="text-sm font-medium text-[#402e32]">
                              {opt.label}
                            </span>
                          </div>
                          <span className="text-xs text-[#8b5b30]">{opt.tip}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-sm flex items-start gap-2.5"
                >
                  <IoAlertCircleOutline className="text-lg shrink-0 mt-0.5 text-amber-700" />
                  <div className="flex-1">
                    <p className="font-semibold">Notice</p>
                    <p className="text-xs sm:text-sm mt-0.5">{formError}</p>
                    {formError.includes('OPENAI_API_KEY') && (
                      <button
                        type="button"
                        onClick={handleLoadDemoPlan}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#8b5b30] hover:text-[#5A321A] underline cursor-pointer"
                      >
                        Preview demo community plan in browser →
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#8b5b30]">
                  <IoHeartOutline className="text-sm text-[#8b5b30]" />
                  <span>Welcoming to introverts, quiet observers, and beginners.</span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleLoadDemoPlan}
                    className="px-3.5 py-2.5 rounded-lg border border-[#8b5b30]/30 text-xs sm:text-sm text-[#5A321A] hover:bg-[#8b5b30]/10 font-medium transition-colors cursor-pointer"
                  >
                    Demo Plan
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-lg bg-[#8b5b30] hover:bg-[#724721] active:bg-[#5A321A] text-[#faf6f0] font-semibold text-sm sm:text-base shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#faf6f0]"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Formulating plan...
                    </>
                  ) : (
                    <>
                      <IoCompassOutline className="text-lg" />
                      Find my community plan
                    </>
                  )}
                </button>
                </div>
              </div>
            </form>
          ) : (
            /* Render AI Plan Result */
            <div ref={resultRef} className="space-y-6 animate-fadeIn">
              {/* Recommendation card */}
              <div className="p-5 sm:p-6 rounded-xl bg-linear-to-br from-[#faf6f0] to-[#f4ebe1] border border-[#8b5b30]/25">
                <div className="flex items-center gap-2 text-[#5A321A] font-semibold text-base mb-2">
                  <h3>Your Personalized Recommendation</h3>
                </div>
                <p className="text-sm sm:text-base text-[#402e32] leading-relaxed">
                  {planResult.recommendation}
                </p>
              </div>

              {planResult.offlineChallenge && (
                <div className="p-5 sm:p-6 rounded-xl bg-[#8b5b30]/10 border-2 border-dashed border-[#8b5b30]/35 flex items-start gap-3.5">
                  <div className="p-2.5 rounded-full bg-[#8b5b30] text-[#faf6f0] shrink-0 mt-0.5">
                    
                  </div>
                  <div>
                    <span className="text-xs font-bold tracking-wider uppercase text-[#8b5b30]">
                      Week 1 Offline Challenge
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-[#5A321A] mt-0.5">
                      Micro-Goal
                    </h4>
                    <p className="mt-1 text-sm sm:text-base text-[#402e32] leading-relaxed">
                      {planResult.offlineChallenge}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border border-[#8b5b30]/20 bg-[#fffdfa]">
                  <div className="flex items-center gap-2 text-[#5A321A] font-semibold text-base mb-3.5">
                    <IoFootstepsOutline className="text-[#8b5b30] text-lg" />
                    <h4>Practical Action Steps</h4>
                  </div>
                  <ol className="space-y-3">
                    {planResult.steps?.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-[#402e32]">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#8b5b30]/15 text-[#5A321A] text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>


                <div className="p-5 rounded-xl border border-[#8b5b30]/20 bg-[#fffdfa]">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2 text-[#5A321A] font-semibold text-base">
                      <IoCheckmarkCircleOutline className="text-emerald-700 text-lg" />
                      <h4>Prep Checklist</h4>
                    </div>
                    <span className="text-xs text-[#8b5b30] font-medium">
                      Tap to check off
                    </span>
                  </div>
                  <ul className="space-y-2.5">
                    {planResult.prepChecklist?.map((item, idx) => {
                      const isChecked = Boolean(checkedChecklist[idx]);
                      return (
                        <li
                          key={idx}
                          onClick={() => handleToggleChecklist(idx)}
                          className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-sm ${
                            isChecked
                              ? 'bg-emerald-50/60 text-emerald-950 line-through opacity-75'
                              : 'hover:bg-[#faf6f0] text-[#402e32]'
                          }`}
                        >
                          <span
                            className={`inline-flex items-center justify-center w-4 h-4 rounded border mt-0.5 shrink-0 ${
                              isChecked
                                ? 'bg-emerald-700 border-emerald-700 text-white'
                                : 'border-[#8b5b30]/40 bg-[#fffdfa]'
                            }`}
                          >
                            {isChecked && <IoCheckmarkSharp className="text-xs" />}
                          </span>
                          <span className="leading-snug">{item}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {planResult.matchedCommunities && planResult.matchedCommunities.length > 0 && (
                <div className="p-5 rounded-xl border border-[#8b5b30]/25 bg-[#faf6f0]/70">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-[#5A321A] font-semibold text-sm sm:text-base">
                      <IoPeopleOutline className="text-[#8b5b30] text-lg" />
                      <h4>Verified TheCodeHood Directory Listings</h4>
                    </div>
                    <span className="text-xs text-[#8b5b30] font-medium bg-[#8b5b30]/10 px-2 py-0.5 rounded">
                      Source of truth
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#402e32] mb-3">
                    We found existing approved communities matching your search:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {planResult.matchedCommunities.map((comm, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[#fffdfa] border border-[#8b5b30]/20 flex flex-col justify-between"
                      >
                        <div>
                          <p className="font-semibold text-sm text-[#5A321A]">{comm.name}</p>
                          <p className="text-xs text-[#8b5b30] mt-0.5 flex items-center gap-1">
                            <IoLocationOutline className="text-xs" />
                            {comm.location} • <span className="capitalize">{comm.format}</span>
                          </p>
                        </div>
                        {comm.website_url && (
                          <a
                            href={comm.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-[#8b5b30] hover:text-[#5A321A] hover:underline"
                          >
                            <IoGlobeOutline className="text-xs" />
                            Visit community page
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 rounded-lg bg-[#8b5b30]/10 border border-[#8b5b30]/20 text-xs sm:text-sm text-[#402e32] flex items-start gap-2.5">
                <IoAlertCircleOutline className="text-base shrink-0 mt-0.5 text-[#8b5b30]" />
                <p>
                  <strong className="text-[#5A321A]">Safety & Verification Notice:</strong>{' '}
                  {planResult.verificationReminder ||
                    'Please verify event details, venue accessibility, and schedules on official community pages before travelling.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#8b5b30]/15">
                <span className="text-xs text-[#8b5b30]/80">
                  Powered by OpenAI.
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg border border-[#8b5b30]/40 text-[#5A321A] hover:bg-[#8b5b30]/10 text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <IoRefreshOutline className="text-base" />
                  Create another community plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
