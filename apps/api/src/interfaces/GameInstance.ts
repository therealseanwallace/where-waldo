import { Model } from 'sequelize';
import Character from '../models/Character';
import HighScore from '../models/HighScore';

interface GameInstance extends Model {
  id: number;
  slug: string;
  name: string;
  path: string;
  characters: Character[];
  highScores: HighScore[];
}

export default GameInstance;