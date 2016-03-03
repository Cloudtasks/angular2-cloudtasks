import {Directive, Injectable, ElementRef, Renderer, Input, OnInit, AfterViewInit} from 'angular2/core';
import {DOM} from 'angular2/src/platform/dom/dom_adapter';
import {Ruler} from 'angular2/src/platform/browser/ruler';
import {CloudtasksService} from './cloudtasks.service';

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

	private cloudtasks: CloudtasksService;

	private elRef: ElementRef;
	private el: ElementRef;
	private renderer: Renderer;

	//private bus: MessageBus;

	private settings: any;
	private width: number;
	private height: number;
	private optionsString: string = '/';

	private tries: number = 0;

	constructor(
		elRef: ElementRef,
		renderer: Renderer,
		cloudtasks: CloudtasksService
	) {
		this.elRef = elRef;
		this.el = elRef.nativeElement;
		this.renderer = renderer;

		this.cloudtasks = cloudtasks;
		this.settings = cloudtasks.getSettings();
	}

	ngOnInit() {
		if (!this.settings.clientId.length) {
			throw('Cloudtasks: You need to configure your clientId.');
		}

		if (!this.imageSource) {
			throw('Cloudtasks: You need to provide an URL string on [ngSrc].');
		}

		if (this.imageSource.indexOf('http') === -1) {
			this.imageSource = window.location.protocol + this.imageSource;
		}

	}

	ngAfterViewInit() {
		this.parseOptions();

		if (this.ctSize) {
			this.init();
		} else {
			new Ruler(DOM).measure(this.elRef)
				.then((rect: any) => {
					this.width = rect.width;
					this.height = rect.height;

					this.init();

					/*console.log(DOM.parentElement(this.el));
					console.log(this.elRef);
					console.log(this.elRef.parent);
					if (!this.width && !this.height) {
						new Ruler(DOM).measure(this.elRef)
							.then((rect: any) => {
								console.log('parent: ', rect);
								this.width = rect.width;
								this.height = rect.height;

								this.init();
							});
					} else {
						this.init();
					}*/
				});
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
			encodeURIComponent(decodeURIComponent(this.imageSource));
	}

	getDefaultURL(): string {
		return '//'+ (this.settings.dev ? 'dev-' : '') +'images.cloudtasks.io/'+
			this.settings.clientId +'/'+
			this.optionsString +
			this.getSize() +'/'+
			encodeURIComponent(decodeURIComponent((this.ctPlaceholderImage || this.settings.placeholderImage)));
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
			options = Object.assign(options, eval(this.ctOptions));
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
}
