import DBService from './DBService';

class AdminService {
  private static instance: AdminService;

  private dbService!: DBService;

  private constructor() {
    this.init();
  }
  
  private async init() {
    this.dbService = await DBService.getInstance();
  }

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  public async getGames() {
    console.log("Getting games from the database...");
    await this.dbService.getGames();
  }
}

export default AdminService;
