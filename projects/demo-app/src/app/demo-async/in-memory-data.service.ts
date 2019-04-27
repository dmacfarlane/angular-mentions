import { InMemoryDbService } from 'angular-in-memory-web-api';
import { COMMON_NAMES } from '../common-names';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let objects = COMMON_NAMES.map(function(name){return {'label':name}});
    return {names:COMMON_NAMES,objects:objects};
  }
}