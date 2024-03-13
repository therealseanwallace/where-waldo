import { Model, ModelStatic, WhereOptions } from "sequelize";
import SequelizeInstance from "../db/SequelizeInstance";


class DBService {
  private static instance: DBService;

  private DB: SequelizeInstance | undefined;

  private async init() {
    this.DB = await SequelizeInstance.getInstance();

    // Check if the models are initialized
    if (!this.DB.Game || !this.DB.Character || !this.DB.HighScore) {
      throw new Error('Models are not initialized');
    }
  }

  public static async getInstance() {
    if (!DBService.instance) {
      DBService.instance = new DBService();
      await DBService.instance.init();
    }
    return DBService.instance;
  };

  public async getGames() {
    try {
      const games = await this.DB!.Game!.findAll();
      console.log(games);
    } catch (error) {
      console.error('Error in DBService.getGames:', error);
      throw error;
    }
  }

  public async getOneGame(slug: string): Promise<Model | null>{
    try {
      const game = await this.DB!.Game!.findOne({
        where: {
          slug,
        },
        include: [
          {
            model: this.DB!.Character!,
            as: 'characters',
          },
          {
            model: this.DB!.HighScore!,
            as: 'highScores',
          },
        ],
      });

      console.log(game);

      return game;
    } catch (error) {
      console.error('Error in DBService.getOneGame:', error);
      throw error;
    }
  };

  public async createOrUpdateModel({
    model,
    data,
    updateCondition = null,
  }: {
    model: ModelStatic<Model>;
    data: object;
    updateCondition?: WhereOptions | null;
  }) {

    const transaction = await this.DB!.transaction();

    try {
      if (updateCondition) {
        await model.update(data, { where: updateCondition as WhereOptions, transaction });
        const returnValue = await model.findOne({
          where: updateCondition,
          transaction,
        });
        await transaction.commit();
        return returnValue;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const createdModel = await model.create(data as any, { transaction });
      await transaction.commit();
      return createdModel;
    } catch (error) {
      await transaction.rollback();
      console.error(`Error in createOrUpdateModel: `, error);
      throw new Error(
        "Database error. Please try again shortly or contact support if this persists."
      );
    }
  }
}
export default DBService;