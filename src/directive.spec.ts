import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { async, TestBed } from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';

import { CloudtasksModule } from './index';
import { CloudtasksService } from './service';

@Component({
  selector: 'TestComponent',
  template: ``
})
class TestComponent {
  constructor(cloudtasks: CloudtasksService) {
    cloudtasks.setId('YOUR_CLIENT_ID');
  }
}

describe('CloudtasksDirective', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        CloudtasksModule.forRoot()
      ],
      declarations: [
        TestComponent
      ],
      providers: [
        { provide: Location, useClass: SpyLocation }
      ]
    });
  });

  it('should set img src', async(() => {
    TestBed.overrideComponent(TestComponent, {
      set: {
        template: `<img ctSrc="http://example.com/image.jpg" [ctOptions]="{trim: true}" ctSize="origxorig"/>`
      }
    });

    TestBed.compileComponents().then(() => {
      const fixture = TestBed.createComponent(TestComponent);
      let compiled = fixture.debugElement.nativeElement.children[0];

      fixture.detectChanges();

      expect(compiled.src).toMatch(/\/\/images.cloudtasks.io\/YOUR_CLIENT_ID/);
    });
  }));

  it('should resolve img src', async(() => {
    TestBed.overrideComponent(TestComponent, {
      set: {
        template: `<img ctSrc="image.jpg" [ctOptions]="{trim: true}" ctSize="origxorig"/>`
      }
    });

    TestBed.compileComponents().then(() => {
      const fixture = TestBed.createComponent(TestComponent);
      let compiled = fixture.debugElement.nativeElement.children[0];

      fixture.detectChanges();

      expect(compiled.src).toMatch(/http%3A%2F%2Flocalhost%2Fimage.jpg/);
    });
  }));

  it('should detect element size', async(() => {
    TestBed.overrideComponent(TestComponent, {
      set: {
        template: `<img ctSrc="http://example.com/image.jpg" style="width: 800px; height: 600px"/>`
      }
    });

    TestBed.compileComponents().then(() => {
      const fixture = TestBed.createComponent(TestComponent);
      let compiled = fixture.debugElement.nativeElement.children[0];

      fixture.detectChanges();

      expect(compiled.src).toMatch(/800x600/);
    });
  }));

  it('should detect parent element size', async(() => {
    TestBed.overrideComponent(TestComponent, {
      set: {
        template: `<div style="width: 800px; height: 600px"><img ctSrc="http://example.com/image.jpg"/></div>`
      }
    });

    TestBed.compileComponents().then(() => {
      const fixture = TestBed.createComponent(TestComponent);
      let compiled = fixture.debugElement.nativeElement.querySelector('img');

      fixture.detectChanges();

      expect(compiled.src).toMatch(/800x600/);
    });
  }));

  it('should force size', async(() => {
    TestBed.overrideComponent(TestComponent, {
      set: {
        template: `<img ctSrc="http://example.com/image.jpg" style="width: 823px; height: 312px" ctForceSize="true"/>`
      }
    });

    TestBed.compileComponents().then(() => {
      const fixture = TestBed.createComponent(TestComponent);
      let compiled = fixture.debugElement.nativeElement.children[0];

      fixture.detectChanges();

      expect(compiled.src).toMatch(/823x312/);
    });
  }));

  it('should pass options', async(() => {
    TestBed.overrideComponent(TestComponent, {
      set: {
        template: `<img ctSrc="http://example.com/image.jpg" [ctOptions]="{trim: true}"/>`
      }
    });

    TestBed.compileComponents().then(() => {
      const fixture = TestBed.createComponent(TestComponent);
      let compiled = fixture.debugElement.nativeElement.children[0];

      fixture.detectChanges();

      expect(compiled.src).toMatch(/trim/);
    });
  }));
  
  it('should set placeholder image', async(() => {
    TestBed.overrideComponent(TestComponent, {
      set: {
        template: `<img ctSrc="http://example.com/image.jpg" ctPlaceholderImage="http://example.com/placeholderImage.jpg"/>`
      }
    });

    TestBed.compileComponents().then(() => {
      const fixture = TestBed.createComponent(TestComponent);
      let compiled = fixture.debugElement.nativeElement.children[0];
      
      fixture.detectChanges();

      expect(compiled.style['background-image']).toMatch(/placeholderImage/);
    });
  }));
});
