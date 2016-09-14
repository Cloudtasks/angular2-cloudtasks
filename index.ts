import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';

import { CloudtasksDirective } from './src/directive';
import { CloudtasksService } from './src/service';

export * from './src/directive';
export * from './src/service';

export default {
  directives: [ CloudtasksDirective ],
  providers: [ CloudtasksService ]
}

@NgModule({
  declarations: [ CloudtasksDirective ],
  exports: [ CloudtasksDirective ]
})
export class CloudtasksModule {
	constructor(@Optional() @SkipSelf() parentModule: CloudtasksModule) {
    if (parentModule) {
      throw new Error('CloudtasksModule already loaded; Import in root module only.');
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CloudtasksModule,
      providers: [ CloudtasksService ]
    };
  }
}
