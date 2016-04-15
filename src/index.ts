import {CloudtasksDirective} from './directive';
import {CloudtasksService} from './service';

export * from './directive';
export * from './service';

export default {
  directives: [CloudtasksDirective],
  providers: [CloudtasksService]
}
