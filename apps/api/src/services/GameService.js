class GameService {
  constructor() {
    
  }

  async createGame(game) {
    return this.gameRepository.createGame(game);
  }
}