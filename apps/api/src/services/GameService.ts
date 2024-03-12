import DBService from './DBService';

class GameService {
  private static instance: GameService;

  private dbService: DBService | undefined;

  private async init() {
    this.dbService = await DBService.getInstance();
  }

  public static getInstance() {
    if (!GameService.instance) {
      GameService.instance = new GameService();
      GameService.instance.init();
    }
    return GameService.instance;
  }

  constructor() {
    this.init();    
  }

  public async getGames() {
    console.log("Getting games from the database...");
    await this.dbService!.getGames();
  }

}

export default GameService;