import { Sequelize, DataTypes, Model } from 'sequelize';

class Character extends Model {
  static initialize(sequelize: Sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        gameSlug: {
          type: DataTypes.INTEGER,
          references: {
            model: 'game',
            key: 'slug',
          },
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        thumbnailPath: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        thumbnailHeight: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        thumbnailWidth: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        rectStartX: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        rectStartY: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        rectEndX: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        rectEndY: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'character',
      }
    );
  }
}

export default Character;

export interface CharacterAttributes {
  id: number;
  gameSlug: number;
  name: string;
  thumbnailPath: string;
  thumbnailHeight: number;
  thumbnailWidth: number;
  rectStartX: number;
  rectStartY: number;
  rectEndX: number;
  rectEndY: number;
}

