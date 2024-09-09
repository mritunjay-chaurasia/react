const { Sequelize } = require('sequelize');
 
 
// ----------------------------- database    username     password
const sequelize = new Sequelize('autoGpt_1', 'postgres', '123456', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    schema: 'public',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});