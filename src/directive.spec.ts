import {
	it,
	inject,
	describe,
	beforeEachProviders,
	TestComponentBuilder,
	fakeAsync,
  tick
} from 'angular2/testing';

import {Component} from 'angular2/core';

import {CloudtasksService} from './service';
import {CloudtasksDirective} from './directive';

export function main() {
	describe('CloudtasksDirective', () => {
		// Create a test component to test directives
		@Component({
			selector: 'TestComponent',
			providers: [CloudtasksService],
			template: ``,
			directives: [CloudtasksDirective]
		})
		class TestComponent {
			constructor(cloudtasks: CloudtasksService) {
				cloudtasks.setId('YOUR_CLIENT_ID');
			}
		}

		it('should set img src', fakeAsync(inject([TestComponentBuilder], (tcb: any) => {
			return tcb.overrideTemplate(TestComponent, `<img ctSrc="http://example.com/image.jpg" [ctOptions]="{trim: true}" ctSize="origxorig"/>`)
				.createAsync(TestComponent).then((fixture: any) => {
					fixture.detectChanges();
					let compiled = fixture.debugElement.nativeElement.children[0];

					tick();
					fixture.detectChanges();
					expect(compiled.src).toMatch(/\/\/images.cloudtasks.io\/YOUR_CLIENT_ID/);
				});
		})));

		it('should resolve img src', fakeAsync(inject([TestComponentBuilder], (tcb: any) => {
			return tcb.overrideTemplate(TestComponent, `<img ctSrc="image.jpg" [ctOptions]="{trim: true}" ctSize="origxorig"/>`)
				.createAsync(TestComponent).then((fixture: any) => {
					fixture.detectChanges();
					let compiled = fixture.debugElement.nativeElement.children[0];

					tick();
					fixture.detectChanges();
					expect(compiled.src).toMatch(/http%3A%2F%2Flocalhost%2Fimage.jpg/);
				});
		})));

		it('should detect element size', fakeAsync(inject([TestComponentBuilder], (tcb: any) => {
			return tcb.overrideTemplate(TestComponent, `<img ctSrc="http://example.com/image.jpg" style="width: 800px; height: 600px"/>`)
				.createAsync(TestComponent).then((fixture: any) => {
					fixture.detectChanges();
					let compiled = fixture.debugElement.nativeElement.children[0];

					tick();
					fixture.detectChanges();
					expect(compiled.src).toMatch(/800x600/);
				});
		})));

		it('should detect parent element size', fakeAsync(inject([TestComponentBuilder], (tcb: any) => {
			return tcb.overrideTemplate(TestComponent, `<div style="width: 800px; height: 600px"><img ctSrc="http://example.com/image.jpg"/></div>`)
				.createAsync(TestComponent).then((fixture: any) => {
					fixture.detectChanges();
					let compiled = fixture.debugElement.nativeElement.querySelector('img');

					tick();
					fixture.detectChanges();
					expect(compiled.src).toMatch(/800x600/);
				});
		})));

		it('should force size', fakeAsync(inject([TestComponentBuilder], (tcb: any) => {
			return tcb.overrideTemplate(TestComponent, `<img ctSrc="http://example.com/image.jpg" style="width: 823px; height: 312px" ctForceSize="true"/>`)
				.createAsync(TestComponent).then((fixture: any) => {
					fixture.detectChanges();
					let compiled = fixture.debugElement.nativeElement.children[0];

					tick();
					fixture.detectChanges();
					expect(compiled.src).toMatch(/823x312/);
				});
		})));

		it('should pass options', fakeAsync(inject([TestComponentBuilder], (tcb: any) => {
			return tcb.overrideTemplate(TestComponent, `<img ctSrc="http://example.com/image.jpg" [ctOptions]="{trim: true}"/>`)
				.createAsync(TestComponent).then((fixture: any) => {
					fixture.detectChanges();
					let compiled = fixture.debugElement.nativeElement.children[0];

					tick();
					fixture.detectChanges();
					expect(compiled.src).toMatch(/trim/);
				});
		})));
		
		it('should set placeholder image', fakeAsync(inject([TestComponentBuilder], (tcb: any) => {
			return tcb.overrideTemplate(TestComponent, `<img ctSrc="http://example.com/image.jpg" ctPlaceholderImage="http://example.com/placeholderImage.jpg"/>`)
				.createAsync(TestComponent).then((fixture: any) => {
					fixture.detectChanges();
					let compiled = fixture.debugElement.nativeElement.children[0];
					
					tick();
					fixture.detectChanges();
					expect(compiled.style['background-image']).toMatch(/placeholderImage/);
				});
		})));
	});
}