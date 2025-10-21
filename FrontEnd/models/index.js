'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const pg = require('pg'); 

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// ✅ FIX 1: Use a simple relative path for configuration file access.
const config = require('../config/config.json')[env]; 

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    dialect: 'postgres',
    dialectModule: pg,
    // 🚩 INSTRUMENTATION: Log all Sequelize queries to console (great for debugging slow queries)
    logging: console.log, 
    // 🚩 CONFIG: Add Connection Pooling for Load Testing
    pool: {
        max: 30,  // Max number of connections in pool (adjust based on your DB limits)
        min: 5,   // Min number of connections in pool
        acquire: 30000, // Maximum time (ms) that pool will try to get connection before throwing error
        idle: 10000     // Time (ms) a connection can be idle before being released
    },
    // 🚩 CONFIG: Set a higher connection timeout for safety
    connectTimeout: 60000, 
  });
} else {
  // This line now works as 'pg' is explicitly required.
  sequelize = new Sequelize(config.database, config.username, config.password, {
    dialect: 'postgres',
    dialectModule: pg,
    // 🚩 INSTRUMENTATION: Log all Sequelize queries to console (great for debugging slow queries)
    logging: console.log, // Log queries
    // 🚩 CONFIG: Add Connection Pooling for Load Testing
    pool: {
        max: 30, 
        min: 5,   
        acquire: 30000, 
        idle: 10000     
    },
    // 🚩 CONFIG: Set a higher connection timeout for safety
    connectTimeout: 60000,
  });
}

// ✅ FIX 4: Define connectAndSync on the 'db' object immediately.
db.connectAndSync = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection to PostgreSQL established successfully.');
    // This line creates the 'escaperooms' table if it doesn't exist.
    await sequelize.sync({ alter: true }); 
    console.log('✅ All models synchronized (tables created/updated).');
  } catch (error) {
    console.error('❌ Unable to connect or synchronize the database:', error.message);
    throw error; 
  }
};

// ----------------------------------------------------------------------
// Model Loading Block
// ----------------------------------------------------------------------

// ✅ FIX 3: Define the model directory path using process.cwd() for stability.
const modelDir = path.join(process.cwd(), 'models');

fs
  .readdirSync(modelDir) // Use the guaranteed absolute path
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1 &&
      file.indexOf('.d.ts') === -1 // Ignore TypeScript declarations
    );
  })
  .forEach(file => {
    // Use the relative require() path from the current file for Webpack compatibility.
    const model = require('./' + file)(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
