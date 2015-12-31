import {Directive, Injectable, ElementRef, Renderer, Input, OnInit, AfterContentChecked} from 'angular2/core';
//import {MessageBus} from 'angular2/web_worker/worker';
import {CloudtasksService} from './cloudtasks.service';

@Injectable()
@Directive({
	selector: '[ctSrc]',
	host: {
		'(error)': 'onError()'
	}
})
export class CloudtasksDirective implements OnInit, AfterContentChecked {
	@Input('ctSrc') imageSource: string;
	@Input() ctOptions: any;
	@Input() ctDefaultImage: string;
	@Input() ctSize: string;
	@Input() ctForceSize: boolean;

	private el: ElementRef;
	private element: HTMLElement;
	private renderer: Renderer;

	//private bus: MessageBus;

	private settings: any;
	private width: number;
	private height: number;
	private optionsString: string = '/';

	cloudtasks: CloudtasksService;

	constructor(
		el: ElementRef,
		renderer: Renderer,
		cloudtasks: CloudtasksService
	) {
		this.el = el;
		this.renderer = renderer;
		this.element = this.renderer.getNativeElementSync(this.el);

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
			this.imageSource = window.location.protocol +':'+ this.imageSource;
		}

	}

	ngAfterContentChecked() {
		this.calculateSize();
		this.parseOptions();

		if (this.ctDefaultImage || this.settings.defaultImage) {
			this.renderer.setElementStyle(this.el, 'background-image', 'url(//'+ this.getDefaultURL() +')');
		}

		this.renderer.setElementAttribute(this.el, 'src', this.getURL());
	}


	onError() {
		if (this.ctDefaultImage || this.settings.defaultImage) {
			this.renderer.setElementAttribute(this.el, 'src', this.getDefaultURL());
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
		this.getSize() +'/'+
		encodeURIComponent(decodeURIComponent((this.ctDefaultImage || this.settings.defaultImage)));
	}

	calculateSize() {
		if (this.element) {
			this.width = this.element.clientWidth;
			this.height = this.element.clientHeight;

			if (!this.width && !this.height) {
				this.width = this.element.parentElement.clientWidth;
				this.height = this.element.parentElement.clientHeight;
			}
		} else {
			// Probably running Inside WebWorker
			// TODO: Implement UI side code
			/*this.bus.initChannel("CT_Directive_MessageBus");
	    this.bus.from("CT_Directive_MessageBus").observer((message: any) => {
	      let size = JSON.parse(message);

	      this.width = size.width;
	      this.height = size.height;
	    });*/
		}
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

		for (let key in options) {
			if (!options.hasOwnProperty(key)) {
				continue;
			}

			const value = options[key];

			if (value) {
				if (typeof value === 'string') {
					this.optionsString = this.optionsString + key +':'+ value +'/';
				} else {
					this.optionsString = this.optionsString + key +'/';
				}
			}
		}
	}
}
