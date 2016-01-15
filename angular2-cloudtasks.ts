import {CloudtasksDirective} from './src/cloudtasks.directive';
import {CloudtasksService} from './src/cloudtasks.service';

export * from './src/cloudtasks.directive';
export * from './src/cloudtasks.service';

export default {
  directives: [CloudtasksDirective],
  providers: [CloudtasksService]
}
