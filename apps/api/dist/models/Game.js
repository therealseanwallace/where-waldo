"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Game extends sequelize_1.Model {
    static initialize(sequelize) {
        return super.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            slug: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            path: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            }
        }, {
            sequelize,
            modelName: 'game',
        });
    }
}
exports.default = Game;
