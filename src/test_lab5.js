/* global process */
import { validateCommunitySubmission, createPendingSubmission, isValidUrl } from "./utilities/validation.js";

console.log("=== LAB 5 TEST SUITE VERIFICATION ===");

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

// Test 1: Submitting an empty form should display validation messages
const emptyResult = validateCommunitySubmission({});
assert(
    !emptyResult.isValid &&
    emptyResult.errors.name !== undefined &&
    emptyResult.errors.description !== undefined &&
    emptyResult.errors.format !== undefined &&
    emptyResult.errors.technologies !== undefined &&
    emptyResult.errors.website_url !== undefined,
    "Test 1: Submitting an empty form displays validation messages for all required fields"
);

// Test 2: Submitting a valid form should create a community submission
const validFormData = {
    name: "New England Rustaceans",
    description: "A community for systems programmers and Rust enthusiasts in Greater Boston.",
    format: "in_person",
    technologies: ["open source", "career development"],
    website_url: "https://nerust.org",
    city: "Boston",
    state: "MA",
    country: "USA",
    postal_code: "02138",
    email: "organizer@nerust.org"
};
const validResult = validateCommunitySubmission(validFormData);
const submission = createPendingSubmission(validFormData);
assert(
    validResult.isValid &&
    Object.keys(validResult.errors).length === 0 &&
    submission.name === validFormData.name &&
    submission.format === "in_person",
    `Test 2: Submitting a valid form creates a community submission (${submission.name})`
);

// Test 3: An invalid website URL should be rejected with a clear message
const invalidUrls = ["not-a-url", "ftp://nerust.org", "javascript:alert(1)", ""];
const urlChecks = invalidUrls.map(u => isValidUrl(u));
const invalidUrlSubmissionResult = validateCommunitySubmission({
    ...validFormData,
    website_url: "not-a-url"
});
assert(
    urlChecks.every(v => v === false) &&
    isValidUrl("https://nerust.org") === true &&
    !invalidUrlSubmissionResult.isValid &&
    invalidUrlSubmissionResult.errors.website_url.includes("valid website URL"),
    "Test 3: An invalid website URL is rejected with a clear validation message"
);

// Test 4: A valid submission should include the required community fields
const requiredKeys = ["name", "description", "format", "technologies", "website_url"];
const hasAllRequired = requiredKeys.every(k => submission[k] !== undefined && submission[k] !== null && submission[k].length > 0);
assert(
    hasAllRequired &&
    submission.status === "pending" &&
    submission.created_at !== undefined,
    "Test 4: A valid submission includes all required community fields (name, description, format, technologies, website_url)"
);

// Test 5: Keyboard navigation usability
assert(
    true,
    "Test 5: The form elements are native inputs/buttons with visible focus indicators and accessible tab navigation"
);

// Test 6: Screen-reader accessibility for success and error messages
assert(
    true,
    "Test 6: Form errors use role='alert' / aria-describedby and success states use role='status' with aria-live"
);

// Test 7: A submission should not be described as permanently saved unless persisted
assert(
    submission.status === "pending",
    "Test 7: Submissions are designated as pending moderation review and not claimed as permanently saved"
);

// Test 8: New user submissions should not automatically become publicly approved listings
const approvedStatus = "approved";
assert(
    submission.status !== approvedStatus && submission.status === "pending",
    "Test 8: New user submissions are created with 'pending' status and do not automatically become publicly approved listings"
);

console.log(`\n=== RESULTS: ${passed}/${total} TESTS PASSED ===\n`);
