import {
  Directive,
  Injectable,
  Inject,
  ElementRef,
  Renderer,
  Input,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { Location } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { CloudtasksService } from './service';

@Injectable()
@Directive({
  selector: '[ctSrc]',
  host: {
    '(error)': 'onError()'
  }
})
export class CloudtasksDirective implements OnInit, AfterViewInit {
  @Input('ctSrc') imageSource: string;
  @Input() ctOptions: any;
  @Input() ctPlaceholderImage: string;
  @Input() ctSize: string;
  @Input() ctForceSize: boolean;

  private el: any;

  private settings: any;
  private width: number;
  private height: number;
  private optionsString: string = '/';

  private tries: number = 0;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private location: Location,
    private elRef: ElementRef,
    private renderer: Renderer,
    private cloudtasks: CloudtasksService
  ) {
    this.el = this.elRef.nativeElement;

    this.settings = this.cloudtasks.getSettings();
  }

  ngOnInit() {
    if (!this.settings.clientId.length) {
      throw('Cloudtasks: You need to configure your clientId.');
    }

    if (!this.imageSource) {
      throw('Cloudtasks: You need to provide an URL string on [ngSrc].');
    }
  }

  ngAfterViewInit() {
    this.parseOptions();

    if (this.ctSize) {
      this.init();
    } else {
      var rect = this.el.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;

      if (!this.width && !this.height) {
        rect = this.el.parentElement.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;

        this.init();
      } else {
        this.init();
      }
    }
  }

  init() {
    if (this.ctPlaceholderImage || this.settings.placeholderImage) {
      this.renderer.setElementStyle(this.el, 'background-image', 'url(//'+ this.getDefaultURL() +')');
    }

    this.renderer.setElementAttribute(this.el, 'src', this.getURL());
  }

  onError() {
    if (this.tries === 0) {
      this.tries += 1;
      if (this.ctPlaceholderImage || this.settings.placeholderImage) {
        this.renderer.setElementAttribute(this.el, 'src', this.getDefaultURL());
      }
    } else if (this.tries === 1) {
      this.tries += 1;
      this.renderer.setElementAttribute(this.el, 'src', this.getErrorURL());
    }
  }

  getURL(): string {
    return '//'+ (this.settings.dev ? 'dev-' : '') +'images.cloudtasks.io/'+
      this.settings.clientId +
      this.optionsString +
      this.getSize() +'/'+
      encodeURIComponent(decodeURIComponent(this.resolve(this.imageSource)));
  }

  getDefaultURL(): string {
    return '//'+ (this.settings.dev ? 'dev-' : '') +'images.cloudtasks.io/'+
      this.settings.clientId +'/'+
      this.optionsString +
      this.getSize() +'/'+
      encodeURIComponent(decodeURIComponent(this.resolve(this.ctPlaceholderImage || this.settings.placeholderImage)));
  }

  getErrorURL(): string {
    return '//'+ (this.settings.dev ? 'dev-' : '') +'images.cloudtasks.io/'+
      this.settings.clientId +'/'+
      this.optionsString +
      this.getSize() +'/'+
      encodeURIComponent(decodeURIComponent('https://cloudtasks.ctcdn.co/images/cloudtasks_fill_blue-512x512.png'));
  }

  getSize(): string {
    let calc = '';

    if (this.ctSize) {
      calc = this.ctSize;
    } else {
      if (!this.ctForceSize) {
        if (this.width) {
          for (var x = 0; x < this.settings.photoWidths.length; x++) {
            if (this.settings.photoWidths[x] < this.width) {
              calc += this.settings.photoWidths[x-1] ? this.settings.photoWidths[x-1] : this.settings.photoWidths[x];
              break;
            }
          }
        }

        if (this.height && (!this.width || this.width/this.height <= 4 )) {
          for (var y = 0; y < this.settings.photoHeights.length; y++) {
            if (this.settings.photoHeights[y] < this.height) {
              calc += 'x'+ (this.settings.photoHeights[y-1] ? this.settings.photoHeights[y-1] : this.settings.photoHeights[y]);
              break;
            }
          }
        }
      } else {
        if (this.width) {
          calc = this.width.toString();
        }

        if (this.height) {
          calc = calc +'x'+ this.height;
        }
      }

      if (!calc) {
        calc = 'origxorig';
      } else if (calc.toString().indexOf('x') === -1) {
        calc = calc +'x';
      }
    }

    return calc;
  }

  parseOptions() {
    let options = Object.assign({}, this.settings.options);

    if (this.ctOptions) {
      options = Object.assign(options, this.ctOptions);
    }

    let optionsString = '/';

    for (let key in options) {
      if (!options.hasOwnProperty(key)) {
        continue;
      }

      const value = options[key];

      if (value) {
        if (typeof value === 'string') {
          optionsString = optionsString + key +':'+ value +'/';
        } else {
          optionsString = optionsString + key +'/';
        }
      }
    }

    this.optionsString = optionsString;
  }

  resolve(url: any) {
    var loc = this.location.path().split('/');
    loc.pop();
    var base: any = this.document.location.origin + loc.join('/') + '/';

    var a: any;

    if('string' !== typeof url || !url) {
      // wrong or empty url
      return null;
    } else if (url.match(/^[a-z]+\:\/\//i)) {
      // url is absolute already 
      return url;
    } else if (url.match(/^\/\//)) { 
      // url is absolute already
      return 'http:' + url;
    } else if ('string' !== typeof base) {
      a = this.renderer.createElement(this.el, 'a');
      // try to resolve url without base
      a.href = url;

      if(!a.hostname || !a.protocol || !a.pathname) { 
        // url not valid 
        return null;
      }

      return 'http://'+url;
    } else { 
      // check base
      base = this.resolve(base);

      if (base === null) {
        // wrong base
        return null;
      }
    }

    a = this.renderer.createElement(this.el, 'a');
    a.href = base;

    if (url[0] === '/') {
      // rooted path
      base = [];
    } else {
      // relative path
      base = a.pathname.split('/');
      base.pop(); 
    }
    url = url.split('/');

    for (var i = 0; i < url.length; ++i) {
      // current directory
      if (url[i] === '.') {
        continue;
      }
      // parent directory
      if (url[i] === '..') {
        if ('undefined' === typeof base.pop() || base.length === 0) {
          // wrong url accessing non-existing parent directories
          return null;
        }
      } else {
        // child directory
        base.push(url[i]); 
      }
    }

    return a.protocol + '//' + a.hostname + base.join('/');
  }
}
