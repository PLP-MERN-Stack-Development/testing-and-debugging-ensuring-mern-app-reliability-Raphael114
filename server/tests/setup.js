// Server test setup
// Set environment and increase default timeout for integration tests
process.env.NODE_ENV = 'test';

// Optional: configure global test helpers here
jest.setTimeout(30000);  // Increase timeout to 30 seconds

// Start an in-memory MongoDB for integration tests (if mongoose + mongodb-memory-server are installed)
try {
	console.log('setup.js: attempting to require setupTestDb');
	const { startTestDb, stopTestDb } = require('./setupTestDb');
	console.log('setup.js: setupTestDb required successfully');

	beforeAll(async () => {
		console.log('setup.js: beforeAll - starting test DB');
		await startTestDb();
		console.log('setup.js: beforeAll - test DB started');
	});

	afterAll(async () => {
		console.log('setup.js: afterAll - stopping test DB');
		await stopTestDb();
		console.log('setup.js: afterAll - test DB stopped');
	});
} catch (err) {
	console.error('setup.js: setupTestDb not available or failed to load:', err && err.message);
	// If the test DB helper isn't available, continue — tests that need a DB will fail with a clear error.
	// console.warn('setupTestDb not available:', err.message);
}

// Example: mock console to keep test output clean (uncomment to enable)
// global.console = {
//   log: jest.fn(),
//   error: jest.fn(),
//   warn: jest.fn(),
// };
