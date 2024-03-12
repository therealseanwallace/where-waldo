"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Character extends sequelize_1.Model {
    static initialize(sequelize) {
        return super.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            gameId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: {
                    model: 'game',
                    key: 'id',
                },
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            thumbnailPath: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            thumbnailHeight: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            thumbnailWidth: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            rectStartX: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            rectStartY: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            rectEndX: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            rectEndY: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'character',
        });
    }
}
exports.default = Character;
