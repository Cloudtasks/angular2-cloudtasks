import { CloudtasksDirective } from './src/directive';
import { CloudtasksService } from './src/service';

export * from './src/directive';
export * from './src/service';

export default {
  directives: [ CloudtasksDirective ],
  providers: [ CloudtasksService ]
}
