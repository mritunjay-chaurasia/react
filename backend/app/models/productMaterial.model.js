const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); 
const User = require('./user.model');

const ProductMaterial = sequelize.define('productMaterial', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    projectId: {
        type: DataTypes.INTEGER
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User, 
            key: 'id',
        },
    },
    docs: {
        type: DataTypes.JSON
    }
}, {
    timestamps: true,
});

ProductMaterial.belongsTo(User, { foreignKey: 'userId', as: 'productAddBy' });

module.exports = ProductMaterial;
