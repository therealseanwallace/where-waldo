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

  
}

export default AdminService;
