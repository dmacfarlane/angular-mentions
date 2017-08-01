import { InMemoryDbService } from 'angular-in-memory-web-api';
import { COMMON_NAMES } from '../app/common-names';

export class InMemoryDataService implements InMemoryDbService {
	createDb() {
		let objects = COMMON_NAMES.map(function (name) { return { 'value': name, 'label': name.toLowerCase() } });
		return { names: COMMON_NAMES, objects: objects };
	}
}