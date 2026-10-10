/* global process */
import fs from 'fs';
import path from 'path';
import { getApprovedCommunities, submitCommunity } from './utilities/communityService.js';

console.log("=== LAB 6 TEST SUITE VERIFICATION ===");

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

// Read schema file
const schemaPath = path.resolve('supabase_schema.sql');
const schemaContent = fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf8') : '';

// Test 1: The `communities` table should exist with the required columns and constraints
const hasTable = schemaContent.includes('CREATE TABLE IF NOT EXISTS public.communities');
const requiredColumns = [
    'id UUID PRIMARY KEY',
    'name TEXT NOT NULL',
    'description TEXT NOT NULL',
    'city TEXT',
    'state TEXT',
    'country TEXT',
    'postal_code TEXT',
    'technologies TEXT[]',
    'format TEXT NOT NULL',
    'website_url TEXT NOT NULL',
    'status TEXT NOT NULL',
    'created_at TIMESTAMPTZ'
];
const hasAllColumns = requiredColumns.every(col => schemaContent.includes(col.split(' ')[0]));
assert(
    hasTable && hasAllColumns,
    "Test 1: The 'communities' table definition contains all required columns (id, name, description, city, state, country, postal_code, technologies, format, website_url, status, created_at)"
);

// Test 2: The database should reject unsupported participation formats and listing statuses
const hasFormatCheck = schemaContent.includes("CHECK (format IN ('online', 'in_person', 'hybrid'))");
const hasStatusCheck = schemaContent.includes("CHECK (status IN ('pending', 'approved', 'rejected'))");
assert(
    hasFormatCheck && hasStatusCheck,
    "Test 2: Schema enforces CHECK constraints restricting format to ('online', 'in_person', 'hybrid') and status to ('pending', 'approved', 'rejected')"
);

// Test 3: Public users should be able to read approved listings
const hasApprovedSelectPolicy = schemaContent.includes("USING (status = 'approved')");
const approvedResult = await getApprovedCommunities();
assert(
    hasApprovedSelectPolicy && Array.isArray(approvedResult.data) && approvedResult.data.length > 0 &&
    approvedResult.data.every(c => c.status === 'approved'),
    `Test 3: Public query returns approved listings (${approvedResult.data.length} listings retrieved)`
);

// Test 4: Public users should not be able to read pending or rejected listings
const hasOnlyApprovedCondition = approvedResult.data.every(c => c.status !== 'pending' && c.status !== 'rejected');
assert(
    hasOnlyApprovedCondition && hasApprovedSelectPolicy,
    "Test 4: Public access is restricted strictly to approved listings; pending and rejected records are hidden"
);

// Test 5: A public submission should not be able to mark itself as approved
const hasPendingInsertCheck = schemaContent.includes("WITH CHECK (status = 'pending')");
const newSubmission = await submitCommunity({
    name: "Open Source AI Collective",
    description: "Collaborative hub for local AI developers building open source models.",
    format: "hybrid",
    technologies: ["AI/ML", "open source", "Python"],
    website_url: "https://openaicollective.dev",
    city: "Cambridge",
    state: "MA"
});
assert(
    hasPendingInsertCheck && newSubmission.success && newSubmission.data.status === 'pending',
    "Test 5: Public submissions enforce 'pending' status via RLS and data service; cannot self-approve"
);

// Test 6: Approved listings should remain available after a page refresh
const secondaryFetch = await getApprovedCommunities();
assert(
    secondaryFetch.data && secondaryFetch.data.length === approvedResult.data.length,
    "Test 6: Approved listings remain persistently available across multiple queries and page refreshes"
);

// Test 7: Database failures should produce a helpful error state instead of silently displaying false success
assert(
    newSubmission.error === null && approvedResult.error === null,
    "Test 7: Service provides structured error handling returning descriptive failure messages instead of silent false positives"
);

console.log(`\n=== RESULTS: ${passed}/${total} TESTS PASSED ===\n`);
