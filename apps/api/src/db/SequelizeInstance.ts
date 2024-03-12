/* eslint-disable no-await-in-loop */
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import Character from "../models/Character";
import HighScore from "../models/HighScore";
import Game from "../models/Game";

dotenv.config();

class SequelizeInstance {
  private static instance: SequelizeInstance;

  private databaseUrl: string;

  public sequelizeInstance: Sequelize | null = null;

  public sequelize: Sequelize | null = null;

  public Game: typeof Game | null = null;

  public Character: typeof Character | null = null;

  public HighScore: typeof HighScore | null = null;

  public constructor() {
    this.databaseUrl = `postgres://${process.env.DATABASE_USERNAME}:${process.env.POSTGRES_ADMIN_PASSWORD}@${process.env.HOSTED_AT}/${process.env.DB_NAME}`;

    if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
      console.log("Running on production deployment; using DATABASE_URL env variable...");
      this.databaseUrl = process.env.DATABASE_URL!;
    } else {
      console.log("Running in dev environment. Using template literal database URL...");
    }
  }

  public async transaction() {
    return this.sequelizeInstance!.transaction();
  }

  private static async createInstance(): Promise<SequelizeInstance> {
    const instance = new SequelizeInstance();
    await instance.connectWithRetry();
    return instance;
  }

  public static async getInstance(): Promise<SequelizeInstance> {
    if (!SequelizeInstance.instance) {
      SequelizeInstance.instance = await SequelizeInstance.createInstance();
    }
    return SequelizeInstance.instance;
  }

  private static delay(duration: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }

  private static setupAssociations() {
    Game.hasMany(Character, {
      foreignKey: "gameId",
      as: "characters",
    });
    Character.belongsTo(Game, {
      foreignKey: "gameId",
      as: "game",
    });
    Game.hasMany(HighScore, {
      foreignKey: "gameId",
      as: "highScores",
    });
    HighScore.belongsTo(Game, {
      foreignKey: "gameId",
      as: "game",
    });
  }

  private async initModels(): Promise<void> {
    if (this.sequelizeInstance) {
      Game.initialize(this.sequelizeInstance);
      Character.initialize(this.sequelizeInstance);
      HighScore.initialize(this.sequelizeInstance);
  
      this.Game = Game;
      this.Character = Character;
      this.HighScore = HighScore;
    } else {
      throw new Error("Sequelize instance is not initialized");
    }
  }
  
  public async connectWithRetry(maxRetries = 5, initialDelay = 1000): Promise<Sequelize> {
    let attempt = 0;
    let currentDelay = initialDelay;
    const environment = process.env.NODE_ENV || "development";

    type DialectOptions = {
      ssl?: {
        require: boolean;
        rejectUnauthorized: boolean;
      };
    };

    type SequelizeOptions = {
      logging: boolean;
      dialectOptions?: {
        ssl?: {
          require: boolean;
          rejectUnauthorized: boolean;
        };
      };
    };

    while (attempt < maxRetries) {
      try {
        const dialectOptions: DialectOptions | null = environment === "production" || environment === "staging" ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        } : null;
        console.log("Environment is:", environment, ". Dialect options are:", dialectOptions);

        this.sequelizeInstance = new Sequelize(this.databaseUrl, {
          logging: false,
          dialectOptions,
        } as SequelizeOptions);

        await this.sequelizeInstance.authenticate();
        console.log("Connection has been established successfully.");

        await this.initModels();

        SequelizeInstance.setupAssociations();

        return this.sequelizeInstance;
      } catch (error) {
        attempt += 1;
        console.error({
          message: "Unable to connect to the database. Retrying...",
          error,
          attempt,
          nextRetryIn: currentDelay,
        });

        await SequelizeInstance.delay(currentDelay);
        currentDelay *= 2;
      }
    }

    console.error(
      "Maximum retry attempts reached. Unable to connect to the database."
    );
    process.exit(1);
  }
}

export default SequelizeInstance;