const { MongoClient } = require('mongodb');
const config = require('../config');

class Database {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    try {
      this.client = await MongoClient.connect(config.database.url);
      this.db = this.client.db(config.database.name);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not initialized. Call connect() first.');
    }
    return this.db;
  }
}

// Create a singleton instance
const database = new Database();
module.exports = database;