const mongoose = require('mongoose');

const schema = new mongoose.Schema({}, { strict: false, timestamps: true });
const modelCache = new Map();

function getModel(name) {
  const collection = String(name).trim();
  const key = collection.replace(/[^A-Za-z0-9_]/g, '_');
  if (!modelCache.has(collection)) {
    modelCache.set(collection, mongoose.model(key, schema, collection));
  }
  return modelCache.get(collection);
}

module.exports = { getModel };
