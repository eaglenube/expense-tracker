require('dotenv').config();
const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const cfg = require('./sequelize')[env];

const sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, cfg);

module.exports = { sequelize, Sequelize };
