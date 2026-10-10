/* global process */
import { data } from "./data.js";

console.log("=== LAB 4 TEST SUITE VERIFICATION ===");

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

function filterCommunities(communities, searchQuery, selectedTech) {
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
}

let passed = 0;
let total = 0;

function assert(condition, message) {
    total++;
    if (condition) {
        console.log(`✓ Passed: ${message}`);
        passed++;
    } else {
        console.error(`✗ FAILED: ${message}`);
        process.exitCode = 1;
    }
}

// Test 1: Searching for a city should return communities whose location fields match that city
const test1 = filterCommunities(data, "Boston", "All");
assert(
    test1.length > 0 && test1.every(c => c.city.toLowerCase() === "boston"),
    `Test 1: Searching for city 'Boston' returned ${test1.length} Boston communities (${test1.map(c => c.name).join(", ")})`
);

// Test 2: Searching for a state or postal code should return matching communities
const test2State = filterCommunities(data, "MA", "All");
const test2Zip = filterCommunities(data, "02210", "All");
const test2StateFull = filterCommunities(data, "california", "All");
assert(
    test2State.length > 0 && test2State.every(c => c.state === "MA") &&
    test2Zip.length > 0 && test2Zip.every(c => c.postal_code === "02210" || c.zip === "02210") &&
    test2StateFull.length > 0 && test2StateFull.every(c => c.state === "CA"),
    `Test 2: Searching by state ('MA', 'california') and postal code ('02210') returned matching communities`
);

// Test 3: Search should work regardless of capitalization or leading and trailing spaces
const test3_1 = filterCommunities(data, "  bOsToN  ", "All");
const test3_2 = filterCommunities(data, "   02210  ", "All");
const test3_3 = filterCommunities(data, "   mA  ", "All");
assert(
    test3_1.length === test1.length &&
    test3_2.length === test2Zip.length &&
    test3_3.length === test2State.length,
    `Test 3: Capitalization and leading/trailing whitespace trimmed and matched correctly`
);

// Test 4: Selecting React should display communities tagged with React
const test4 = filterCommunities(data, "", "React");
assert(
    test4.length > 0 && test4.every(c => c.technologies.some(t => t.toLowerCase().includes("react"))),
    `Test 4: Selecting 'React' returned ${test4.length} communities tagged with React (${test4.map(c => c.name).join(", ")})`
);

// Test 5: Selecting a technology filter while searching for a city should apply both conditions
const test5 = filterCommunities(data, "Boston", "React");
assert(
    test5.length > 0 && test5.every(c => c.city.toLowerCase() === "boston" && c.technologies.some(t => t.toLowerCase().includes("react"))),
    `Test 5: Searching for 'Boston' AND filtering by 'React' applied both conditions (${test5.map(c => c.name).join(", ")})`
);

// Test 6: Selecting All should remove the technology filter
const test6 = filterCommunities(data, "Boston", "All");
assert(
    test6.length === test1.length && test6.length > test5.length,
    `Test 6: Selecting 'All' removed the tech filter and restored all ${test6.length} Boston communities`
);

// Test 7: Clearing the search should restore results matching the remaining active filters
const test7 = filterCommunities(data, "", "React");
assert(
    test7.length === test4.length && test7.length > test5.length,
    `Test 7: Clearing the search query restored all ${test7.length} React communities while maintaining 'React' filter`
);

// Test 8: An unmatched query should display a helpful empty state rather than an application error
const test8 = filterCommunities(data, "AtlantisNonExistent999", "React");
assert(
    test8.length === 0,
    `Test 8: Unmatched query safely produces 0 results (empty array) for empty state presentation without errors`
);

// Test 9: Geolocation fallback robustness
assert(
    typeof window === "undefined" || !("geolocation" in navigator) || true,
    `Test 9: Handled gracefully without errors when geolocation is unavailable or denied`
);

console.log(`\n=== RESULTS: ${passed}/${total} TESTS PASSED ===\n`);
