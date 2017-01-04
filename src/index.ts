import {
  NgModule,
  ModuleWithProviders,
  Inject,
  Optional,
  OpaqueToken
} from '@angular/core';

import { CloudtasksDirective } from './directive';
import { CloudtasksService } from './service';

export * from './directive';
export * from './service';

export const NG2CLOUDTASKS_FORROOT_GUARD = new OpaqueToken('NG2CLOUDTASKS_FORROOT_GUARD');
export function provideForRootGuard(cloudtasksService: CloudtasksService): any {
  if (cloudtasksService) {
    throw new Error(
      `CloudtasksModule.forRoot() called twice. Lazy loaded modules should declare directives directly.`
    );
  }
  return 'guarded';
}

@NgModule({
  declarations: [ CloudtasksDirective ],
  exports: [ CloudtasksDirective ]
})
export class CloudtasksModule {
  constructor(@Optional() @Inject(NG2CLOUDTASKS_FORROOT_GUARD) guard: any) {}

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CloudtasksModule,
      providers: [ CloudtasksService ]
    };
  }
}
