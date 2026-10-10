import { useMemo } from 'react';
import { data as sampleData } from "../data";
import Search from "../utilities/Search";
import DisplayCard from "../utilities/DisplayCard";
import SubmitForm from "../utilities/SubmitForm";
import { IoSearchOutline, IoCloseCircleOutline, IoAlertCircleOutline, IoInformationCircleOutline } from "react-icons/io5";

const TECHNOLOGY_FILTERS = [
    'All',
    'JavaScript',
    'React',
    'Java',
    'Python',
    'AI/ML',
    'open source',
    'career development'
];

const STATE_LOOKUP = {
    al: "alabama", ak: "alaska", az: "arizona", ar: "arkansas", ca: "california",
    co: "colorado", ct: "connecticut", de: "delaware", fl: "florida", ga: "georgia",
    hi: "hawaii", id: "idaho", il: "illinois", in: "indiana", ia: "iowa",
    ks: "kansas", ky: "kentucky", la: "louisiana", me: "maine", md: "maryland",
    ma: "massachusetts", mi: "michigan", mn: "minnesota", ms: "mississippi",
    mo: "missouri", mt: "montana", ne: "nebraska", nv: "nevada", nh: "new hampshire",
    nj: "new jersey", nm: "new mexico", ny: "new york", nc: "north carolina",
    nd: "north dakota", oh: "ohio", ok: "oklahoma", or: "oregon", pa: "pennsylvania",
    ri: "rhode island", sc: "south carolina", sd: "south dakota", tn: "tennessee",
    tx: "texas", ut: "utah", vt: "vermont", va: "virginia", wa: "washington",
    wv: "west virginia", wi: "wisconsin", wy: "wyoming"
};

export default function Catalogue({
    refProp,
    searchQuery = "",
    setSearchQuery,
    selectedTech = "All",
    setSelectedTech,
    onClearSearch,
    onLocationClick,
    isGeoLoading = false,
    geoStatus,
    setGeoStatus,
    communities = sampleData,
    onSubmitSuccess,
    submissions = [],
    dbLoading = false,
    dbError = null,
    onRetry
}) {
    const filteredCommunities = useMemo(() => {
        const query = (searchQuery || "").trim().toLowerCase();

        return communities.filter((item) => {
            // Location matching
            let matchesLocation = true;
            if (query.length > 0) {
                const city = (item.city || "").toLowerCase();
                const state = (item.state || "").toLowerCase();
                const country = (item.country || "").toLowerCase();
                const postalCode = (item.postal_code || item.zip || "").toLowerCase();
                const stateFullName = STATE_LOOKUP[state] || "";

                matchesLocation = (
                    city.includes(query) ||
                    state.includes(query) ||
                    stateFullName.includes(query) ||
                    country.includes(query) ||
                    postalCode.includes(query)
                );
            }

            // Technology filter matching
            let matchesTech = true;
            if (selectedTech && selectedTech !== "All") {
                const targetTech = selectedTech.toLowerCase();
                const itemTechs = (item.technologies || []).map((t) => t.toLowerCase());
                matchesTech = itemTechs.some((t) => t === targetTech || t.includes(targetTech));
            }

            return matchesLocation && matchesTech;
        });
    }, [communities, searchQuery, selectedTech]);

    const handleClearAll = () => {
        if (onClearSearch) onClearSearch();
        else if (setSearchQuery) setSearchQuery("");
        if (setSelectedTech) setSelectedTech("All");
    };

    const hasActiveFilters = (searchQuery && searchQuery.trim().length > 0) || (selectedTech && selectedTech !== "All");

    return (
        <section
            ref={refProp}
            id="community-catalogue"
            className="flex flex-col items-center justify-center gap-8 py-8 px-4 w-full"
        >
            <div className="text-center max-w-2xl flex flex-col gap-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#8b5b30]">
                    Discover Communities
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#5A321A]">
                    Community Directory
                </h2>
                <p className="text-stone-600 text-sm md:text-base">
                    Find tech groups, developer meetups, and open-source networks by city, state, or postal code.
                </p>
            </div>

            {/* Search and Geolocation */}
            <div className="w-full max-w-xl flex flex-col items-center gap-3">
                <Search
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSubmit={() => {}}
                    onClear={onClearSearch}
                    onLocationClick={onLocationClick}
                    isGeoLoading={isGeoLoading}
                    placeholder="Search by city, state, country, or postal code..."
                    inputId="catalogue-search-input"
                    className="w-full"
                />

                {geoStatus && (
                    <div
                        role="alert"
                        className={`flex items-center justify-between gap-2 px-3.5 py-2 rounded-lg text-xs w-full transition-all ${
                            geoStatus.type === "success"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : geoStatus.type === "error"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-stone-100 text-stone-800 border border-stone-200"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            {geoStatus.type === "error" ? (
                                <IoAlertCircleOutline className="text-base shrink-0" />
                            ) : (
                                <IoInformationCircleOutline className="text-base shrink-0" />
                            )}
                            <span>{geoStatus.message}</span>
                        </div>
                        {setGeoStatus && (
                            <button
                                type="button"
                                onClick={() => setGeoStatus(null)}
                                aria-label="Dismiss message"
                                className="text-stone-500 hover:text-stone-800 cursor-pointer font-bold"
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Technology Filters */}
            <div className="flex flex-col items-center gap-2 w-full max-w-4xl">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5A321A] uppercase tracking-wider">
                    <span>Filter by Technology & Interest</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {TECHNOLOGY_FILTERS.map((tech) => {
                        const isSelected = selectedTech === tech;
                        return (
                            <button
                                key={tech}
                                type="button"
                                onClick={() => setSelectedTech && setSelectedTech(tech)}
                                aria-pressed={isSelected}
                                className={`px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-full transition-all cursor-pointer shadow-xs ${
                                    isSelected
                                        ? "bg-[#5A321A] text-[#e3ddd7] ring-2 ring-[#5A321A]/30 font-semibold"
                                        : "bg-[#fffdfa] border border-[#8b5b30]/30 text-[#5A321A] hover:bg-[#8b5b30]/10 hover:border-[#5A321A]"
                                }`}
                            >
                                {tech}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Filter Summary and Count */}
            <div className="flex flex-wrap items-center justify-between w-full max-w-6xl px-4 gap-3 text-sm text-stone-600 border-b border-[#8b5b30]/15 pb-3">
                <div className="font-medium text-[#402e32]">
                    Showing <span className="font-bold text-[#5A321A]">{filteredCommunities.length}</span> of {communities.length} communities
                    {searchQuery.trim().length > 0 && (
                        <span> matching &ldquo;<span className="text-[#5A321A] font-semibold">{searchQuery.trim()}</span>&rdquo;</span>
                    )}
                    {selectedTech !== "All" && (
                        <span> in <span className="text-[#5A321A] font-semibold">{selectedTech}</span></span>
                    )}
                    {submissions.length > 0 && (
                        <span className="ml-2 text-xs text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-full font-medium">
                            ({submissions.length} submission{submissions.length === 1 ? '' : 's'} pending moderation)
                        </span>
                    )}
                </div>

                {hasActiveFilters && (
                    <div className="flex items-center gap-2">
                        {searchQuery.trim().length > 0 && (
                            <button
                                type="button"
                                onClick={onClearSearch}
                                className="inline-flex items-center gap-1 text-xs bg-[#f4ece3] text-[#5A321A] px-2.5 py-1 rounded-full hover:bg-[#ebdccf] transition-colors cursor-pointer"
                            >
                                Location: &ldquo;{searchQuery.trim()}&rdquo;
                                <IoCloseCircleOutline className="text-sm" />
                            </button>
                        )}
                        {selectedTech !== "All" && (
                            <button
                                type="button"
                                onClick={() => setSelectedTech && setSelectedTech("All")}
                                className="inline-flex items-center gap-1 text-xs bg-[#f4ece3] text-[#5A321A] px-2.5 py-1 rounded-full hover:bg-[#ebdccf] transition-colors cursor-pointer"
                            >
                                Tech: {selectedTech}
                                <IoCloseCircleOutline className="text-sm" />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="text-xs text-[#8b5b30] hover:text-[#5A321A] underline font-medium cursor-pointer"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Database Operation States: Loading & Error */}
            {dbLoading && (
                <div role="status" className="flex items-center justify-center gap-3 p-8 text-[#5A321A]">
                    <span className="w-5 h-5 border-2 border-[#5A321A] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Loading communities from database...</span>
                </div>
            )}

            {dbError && !dbLoading && (
                <div role="alert" className="flex flex-col items-center gap-2 p-4 max-w-md bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm text-center">
                    <IoAlertCircleOutline className="text-2xl text-amber-700" />
                    <p className="font-semibold">Unable to load communities from database</p>
                    <p className="text-xs text-stone-600">{dbError}</p>
                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="mt-2 text-xs bg-[#5A321A] text-[#e3ddd7] px-3 py-1.5 rounded-lg font-medium hover:bg-[#402413] transition-colors cursor-pointer"
                        >
                            Retry Loading
                        </button>
                    )}
                </div>
            )}

            {/* Results Grid or Empty State */}
            {!dbLoading && filteredCommunities.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-10 max-w-lg bg-[#fffdfa] rounded-2xl border border-dashed border-[#8b5b30]/30 shadow-xs my-4">
                    <div className="p-3 bg-[#f2ebe4] rounded-full text-[#8b5b30] mb-3">
                        <IoSearchOutline className="text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-[#402e32] mb-1">
                        No Communities Found
                    </h3>
                    <p className="text-stone-600 text-sm mb-6 max-w-sm">
                        {searchQuery.trim().length > 0
                            ? `We couldn't find any communities matching "${searchQuery.trim()}"${
                                  selectedTech !== "All" ? ` with tag "${selectedTech}"` : ""
                              }.`
                            : `No communities are tagged with "${selectedTech}".`}
                        {" "}Try searching for a different city, state, or postal code, or clear your filters.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="px-4 py-2 bg-[#5A321A] hover:bg-[#402413] text-[#e3ddd7] text-sm font-medium rounded-lg transition-colors cursor-pointer"
                        >
                            Clear Search &amp; Filters
                        </button>
                        <SubmitForm onSubmitSuccess={onSubmitSuccess} />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl px-4 items-stretch">
                    {filteredCommunities.map((community) => (
                        <DisplayCard
                            key={community.id}
                            data={community}
                            onSelectTech={(tech) => setSelectedTech && setSelectedTech(tech)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}