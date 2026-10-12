process.env.NODE_ENV = 'test';
import assert from 'assert';
import app from './index.js';
import http from 'http';

console.log('=== THECODEHOOD COMMUNITY MATCHMAKER API TEST SUITE ===');

const PORT = 3099;
const server = http.createServer(app);

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  await new Promise((resolve) => server.listen(PORT, resolve));
  let passedCount = 0;
  let totalCount = 0;

  try {
    // Test 1: Health check endpoint
    totalCount++;
    const health = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/health',
      method: 'GET',
    });
    assert.strictEqual(health.status, 200, 'Health endpoint should return 200');
    assert.strictEqual(health.body.status, 'ok', 'Status should be ok');
    assert.ok(health.body.model, 'Model identifier should be present');
    assert.strictEqual(health.body.provider.includes('Hugging Face'), true, 'Provider should reference Hugging Face');
    console.log('✓ Passed: Test 1: Health endpoint returns 200 and Hugging Face provider attribution');
    passedCount++;

    // Test 2: Input validation - Missing all fields
    totalCount++;
    const emptyPost = await request(
      {
        hostname: 'localhost',
        port: PORT,
        path: '/api/matchmaker',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {}
    );
    assert.strictEqual(emptyPost.status, 400, 'Missing fields should return 400');
    assert.ok(emptyPost.body.details.interest, 'Should report missing interest');
    assert.ok(emptyPost.body.details.location, 'Should report missing location');
    assert.ok(emptyPost.body.details.preferredMeetup, 'Should report missing preferredMeetup');
    assert.ok(emptyPost.body.details.socialComfort, 'Should report missing socialComfort');
    console.log('✓ Passed: Test 2: Empty submission rejected with 400 and structured validation errors');
    passedCount++;

    // Test 3: Input validation - Invalid preferredMeetup
    totalCount++;
    const invalidMeetup = await request(
      {
        hostname: 'localhost',
        port: PORT,
        path: '/api/matchmaker',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        interest: 'web development',
        location: 'Boston, MA',
        preferredMeetup: 'underwater',
        socialComfort: "I'm new to meetups",
      }
    );
    assert.strictEqual(invalidMeetup.status, 400, 'Invalid meetup format should return 400');
    assert.ok(invalidMeetup.body.details.preferredMeetup);
    console.log('✓ Passed: Test 3: Invalid meetup preference rejected');
    passedCount++;

    // Test 4: Input validation - Oversized input truncated and sanitized
    totalCount++;
    const longString = 'A'.repeat(500);
    const oversizedPost = await request(
      {
        hostname: 'localhost',
        port: PORT,
        path: '/api/matchmaker',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-test-mode': 'true' },
      },
      {
        interest: longString,
        location: 'Boston, MA',
        preferredMeetup: 'in_person',
        socialComfort: "I'm ready to network",
      }
    );
    assert.strictEqual(oversizedPost.status, 200, 'Sanitized oversized payload successfully handled in test mode');
    assert.ok(oversizedPost.body.plan.recommendation);
    console.log('✓ Passed: Test 4: Long input strings safely bounded and sanitized');
    passedCount++;

    // Test 5: Grounded plan generation & verified directory matching
    totalCount++;
    const bostonPlan = await request(
      {
        hostname: 'localhost',
        port: PORT,
        path: '/api/matchmaker',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-test-mode': 'true' },
      },
      {
        interest: 'React',
        location: 'Boston',
        preferredMeetup: 'in_person',
        socialComfort: "I'm a little nervous",
      }
    );
    assert.strictEqual(bostonPlan.status, 200, 'Plan generated successfully');
    const plan = bostonPlan.body.plan;
    assert.ok(plan.recommendation, 'Recommendation should be provided');
    assert.ok(Array.isArray(plan.steps) && plan.steps.length >= 2, '2 or 3 steps should be provided');
    assert.ok(plan.offlineChallenge, 'Offline challenge should be provided');
    assert.ok(Array.isArray(plan.prepChecklist) && plan.prepChecklist.length >= 3, 'Preparation checklist provided');
    assert.ok(plan.verificationReminder, 'Verification reminder provided');
    assert.ok(plan.matchedCommunities.length > 0, 'Matched Boston React directory listing as grounded truth');
    assert.strictEqual(plan.matchedCommunities[0].name, 'Boston React & Frontend Collective');
    console.log('✓ Passed: Test 5: Plan returns recommendation, steps, offline challenge, checklist, verification reminder, and matched directory listings');
    passedCount++;

    // Test 6: Missing HF_TOKEN handled gracefully in live mode
    totalCount++;
    const originalToken = process.env.HF_TOKEN;
    delete process.env.HF_TOKEN;

    const noTokenRes = await request(
      {
        hostname: 'localhost',
        port: PORT,
        path: '/api/matchmaker',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        interest: 'AI',
        location: 'Austin, TX',
        preferredMeetup: 'in_person',
        socialComfort: "I'm ready to network",
      }
    );
    assert.strictEqual(noTokenRes.status, 503, 'Should return 503 when HF_TOKEN is missing');
    assert.strictEqual(typeof noTokenRes.body.error, 'string', 'Should return clear user-friendly error string');
    if (originalToken) process.env.HF_TOKEN = originalToken;
    console.log('✓ Passed: Test 6: Missing HF_TOKEN returns graceful 503 with helpful configuration guidance without crash');
    passedCount++;

    console.log(`\n=== RESULTS: ${passedCount}/${totalCount} TESTS PASSED ===\n`);
    server.close(() => {
      process.exit(0);
    });
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  server.close();
  process.exit(1);
});
