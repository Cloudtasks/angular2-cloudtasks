import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';

import {Component, View} from 'angular2/core';

import {CloudtasksService} from '../src/cloudtasks.service';
import {CloudtasksDirective} from '../src/cloudtasks.directive';

export function main() {
	describe('CloudtasksDirective', () => {
		// Create a test component to test directives
		@Component({
			selector: 'TestComponent',
			providers: [CloudtasksService]
		})
		@View({
			template: ``,
			directives: [CloudtasksDirective]
		})
	  class TestComponent {
	  	constructor(cloudtasks: CloudtasksService) {
				cloudtasks.setId('YOUR_CLIENT_ID');
				cloudtasks.settings.options = {};
			}
	  }

		it('should set img src', injectAsync([TestComponentBuilder], (tcb: any) => {
			return tcb.overrideTemplate(TestComponent, `<img [ctSrc]="'http://example.com/image.jpg'" [ctOptions]="{trim: true}" [ctSize]="'origxorig'">`)
				.createAsync(TestComponent).then((fixture: any) => {
					fixture.detectChanges();
        	let compiled = fixture.debugElement.nativeElement.children[0];

					expect(compiled.src).toBe('http://images.cloudtasks.io/YOUR_CLIENT_ID/trim/origxorig/http%3A%2F%2Fexample.com%2Fimage.jpg');
				});
		}));
	});
}