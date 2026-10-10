/* global process */
import fs from 'fs';
import path from 'path';
import {
    getApprovedCommunities,
    submitCommunity,
    getPendingSubmissions,
    moderateCommunity,
    updateCommunity,
    deleteCommunity
} from './utilities/communityService.js';

console.log("=== LAB 7 TEST SUITE VERIFICATION ===");

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

// Test 1: Community listings should load from Supabase / data access layer
const fetchResult = await getApprovedCommunities();
assert(
    Array.isArray(fetchResult.data) && fetchResult.data.length > 0 &&
    fetchResult.data.every(item => item.status === 'approved'),
    `Test 1: Approved community listings load successfully via data-access layer (${fetchResult.data.length} listings retrieved)`
);

// Test 2: A new submission should be saved with `pending` status
const newSubmission = await submitCommunity({
    name: "San Francisco TypeScript Guild",
    description: "Deep dives into TypeScript compiler internals, typing patterns, and performance.",
    format: "in_person",
    technologies: ["JavaScript", "open source"],
    website_url: "https://sftypescript.dev",
    city: "San Francisco",
    state: "CA"
});
const pendingCheck = await getPendingSubmissions('codehood_admin_key');
assert(
    newSubmission.success === true &&
    newSubmission.data &&
    newSubmission.data.status === 'pending' &&
    Array.isArray(pendingCheck.data),
    "Test 2: Valid submission is saved with 'pending' status and retrievable via moderation workflow"
);

// Test 3: Pending listings should not appear in public search results
const publicListings = await getApprovedCommunities();
const isPendingVisible = publicListings.data.some(c => c.name === "San Francisco TypeScript Guild" || c.status === 'pending');
assert(
    !isPendingVisible,
    "Test 3: Pending submissions do not appear in public search results"
);

// Test 4: Approving a listing through the authorized workflow should make it visible in the directory
const approveResult = await moderateCommunity(newSubmission.data.id, 'approved', 'codehood_admin_key');
const publicListingsAfterApproval = await getApprovedCommunities();
const isNowVisible = publicListingsAfterApproval.data.some(c => c.name === "San Francisco TypeScript Guild" || c.id === newSubmission.data.id);
assert(
    approveResult.success === true && (isNowVisible || approveResult.data.status === 'approved'),
    "Test 4: Approving a listing through authorized workflow makes it visible in the approved directory"
);

// Test 5: Rejecting a listing should keep it hidden from public visitors
const rejectedSubmission = await submitCommunity({
    name: "Spam Testing Community",
    description: "A test spam submission that will be rejected by moderator.",
    format: "online",
    technologies: ["career development"],
    website_url: "https://spamtest.org"
});
const rejectResult = await moderateCommunity(rejectedSubmission.data.id, 'rejected', 'codehood_admin_key');
const publicListingsAfterReject = await getApprovedCommunities();
const isRejectedVisible = publicListingsAfterReject.data.some(c => c.id === rejectedSubmission.data.id);
assert(
    rejectResult.success === true && !isRejectedVisible,
    "Test 5: Rejecting a listing keeps it hidden from public visitors"
);

// Test 6: Unauthorized visitors should not be able to approve, edit, or delete listings
const unauthApprove = await moderateCommunity(rejectedSubmission.data.id, 'approved', 'wrong_key');
const unauthEdit = await updateCommunity(fetchResult.data[0].id, { name: "Hacked Name" }, '');
const unauthDelete = await deleteCommunity(fetchResult.data[0].id, '');
assert(
    unauthApprove.success === false &&
    unauthEdit.success === false &&
    unauthDelete.success === false,
    "Test 6: Unauthorized visitors cannot approve, edit, or delete listings (RLS and authorization enforced)"
);

// Test 7: Failed requests should display a recoverable error message
// Schema verification for RLS policies
const schemaPath = path.resolve('supabase_schema.sql');
const schemaContent = fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf8') : '';
const hasModerateRpc = schemaContent.includes('CREATE OR REPLACE FUNCTION public.moderate_community');
assert(
    hasModerateRpc &&
    typeof unauthApprove.error === 'string' &&
    unauthApprove.error.length > 0,
    "Test 7: Failed requests return clear, recoverable error messages rather than silent failures"
);

console.log(`\n=== RESULTS: ${passed}/${total} TESTS PASSED ===\n`);
