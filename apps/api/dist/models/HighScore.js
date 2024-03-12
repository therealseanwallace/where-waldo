"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class HighScore extends sequelize_1.Model {
    static initialize(sequelize) {
        return super.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            gameId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            score: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'highScore',
        });
    }
}
exports.default = HighScore;
