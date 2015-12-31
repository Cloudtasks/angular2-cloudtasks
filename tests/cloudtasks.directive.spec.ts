import {Component, View} from 'angular2/core';

import {CloudtasksDirective} from '../src/cloudtasks.directive';

export function main() {
	describe('CloudtasksDirective', () => {
		// Create a test component to test directives
		@Component({
			selector: 'TestComponent'
		})
		@View({
			template: `<img [ctSrc]="{{imgUrl}}" [ctOptions]="{trim: true}" [ctSize]="'origxorig'">`,
			directives: [CloudtasksDirective]
		})
	  class TestComponent {}

		it('is defined', injectAsync([TestComponentBuilder], (tcb) => {
			expect(CloudtasksDirective).toBeDefined();
		});
	});
}