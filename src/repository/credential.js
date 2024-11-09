const database = require('../database');
const config = require('../config');
const logger = require('../utils/logger');

class CredentialRepository {
  constructor() {
    this.collection = null;
  }

  async initialize() {
    if (!this.collection) {
      try {
        await database.connect();
        this.collection = database.getDb().collection('credentials');
      } catch (error) {
        console.error('Failed to initialize credential repository:', error);
        throw error;
      }
    }
  }

  async create(credential) {
    try {
      await this.initialize();
      const result = await this.collection.insertOne({
        ...credential,
        createdAt: new Date(),
        issuer: credential.issuer,
        subject: credential.credentialSubject.id
      });
      return result.insertedId.toString();
    } catch (error) {
      logger.error('Create credential error:', error);
      throw error;
    }
  }

  async getByUser(issuer, subject, schemaType) {
    await this.initialize();
    try {
      return await this.collection.find({
        issuer,
        subject,
        'credentialSchema.type': schemaType
      }).toArray();
    } catch (error) {
      logger.error('Get user credentials error:', error);
      throw error;
    }
  }

  async getByID(issuer, credentialId) {
    await this.initialize();
    try {
      return await this.collection.findOne({
        issuer,
        _id: credentialId
      });
    } catch (error) {
      logger.error('Get credential by ID error:', error);
      throw error;
    }
  }
}

module.exports = CredentialRepository;