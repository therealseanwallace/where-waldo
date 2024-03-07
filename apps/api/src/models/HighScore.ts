import { Sequelize, DataTypes, Model } from 'sequelize';

class HighScore extends Model {
  static initialize(sequelize: Sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        gameId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        score: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'highScore',
      }
    );
  }
}

export default HighScore;