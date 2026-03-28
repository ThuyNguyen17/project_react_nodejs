const { DemoSeeder } = require('./DemoSeeder');

// Backward-compatible API: other code imports { resetDatabase } from this module.
const clearAllData = async () => {
  const seeder = new DemoSeeder();
  // Note: clearAllData assumes an existing DB connection in older code paths.
  // Kept for compatibility; prefer resetDatabase().
  return seeder.clearAllData();
};

const createSeedData = async () => {
  const seeder = new DemoSeeder();
  // Note: createSeedData assumes an existing DB connection in older code paths.
  // Kept for compatibility; prefer resetDatabase().
  return seeder.createSeedData();
};

const resetDatabase = async () => {
  const seeder = new DemoSeeder();
  return seeder.resetDatabase();
};

module.exports = {
  clearAllData,
  createSeedData,
  resetDatabase
};

