# [angular2-cloudtasks](https://cloudtasks.io)
[![npm version](https://img.shields.io/npm/v/angular2-cloudtasks.svg?style=flat)](https://www.npmjs.com/package/angular2-cloudtasks)
[![Build Status](https://img.shields.io/travis/Cloudtasks/angular2-cloudtasks/master.svg?style=flat)](https://travis-ci.org/Cloudtasks/angular2-cloudtasks)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/bafd522f82da48fda8bb25bee689b32f)](https://www.codacy.com/app/jonnybgod/angular2-cloudtasks)
[![Coverage Status](https://coveralls.io/repos/Cloudtasks/angular2-cloudtasks/badge.svg?branch=master&service=github)](https://coveralls.io/github/Cloudtasks/angular2-cloudtasks?branch=master)
[![devDependency Status](https://david-dm.org/Cloudtasks/angular2-cloudtasks/dev-status.svg)](https://david-dm.org/Cloudtasks/angular2-cloudtasks#info=devDependencies)

[![Github Releases](https://img.shields.io/github/downloads/Cloudtasks/angular2-cloudtasks/latest/total.svg)]()

Allows you to serve highly optimized images to your client apps.

angular-cloudtasks helps using [Cloudtasks.io](https://cloudtasks.io) image processing task by substituting your images sources with the processing URL.

With this you can process your images on the fly applying resize, trim, and even filters to your images. In the end you will save a lot of bandwidth for you and your users as well as improve the overall user experience.

You will need a [Cloudtasks.io](https://cloudtasks.io) account to be able to use this module;

## Installation
First you need to install the npm module:
```sh
npm install angular2-cloudtasks --save
```

If you use SystemJS to load your files, you might have to update your config with this if you don't use `defaultJSExtensions: true`:
```js
System.config({
	packages: {
		"/angular2-cloudtasks": {"defaultExtension": "js"}
	}
});
```

Finally, you can use angular2-cloudtasks in your Angular 2 project.
It is recommended to instantiate `CloudtasksService` in the bootstrap of your application and to never add it to the "providers" property of your components, this way you will keep it as a singleton.
If you add it to the "providers" property of a component it will instantiate a new instance of the service that won't be initialized.

```js
import {CloudtasksService} from 'angular2-cloudtasks/angular2-cloudtasks';

bootstrap(AppComponent, [
	CloudtasksService
]);


import {Component, Injectable} from 'angular2/angular2';
import {CloudtasksService, CloudtasksDirective} from 'angular2-cloudtasks/angular2-cloudtasks';

@Injectable()
@Component({
	selector: 'app',
	template: `<img [ctSrc]="'http://example.com/image.jpg'" [ctOptions]="{trim: true, smart: 'face', filters: 'blur(10):flip()'}">`,
	directives: [CloudtasksDirective]
})
export class AppComponent {
	constructor(cloudtasks: CloudtasksService) {
		// Required: set your cloudtasks.io client id
		cloudtasks.setId('YOUR_CLIENT_ID');

		// Optional: set global options
		cloudtasks.settings.options = {
			trim: false
		}
		// Optional: set global settings
		cloudtasks.settings.placeholderImage = "http://example.com/placeholderImage.jpg";
	}
}
```

## API
### CloudtasksService
#### Settings:
- `clientId`: (string) Cloudtasks.io client id
- `dev`: (boolean) Set environment to dev (default: false)
- `options`: (object) Global options for image processing ([Docs](https://cloudtasks.io/docs/image/#image))
- `photoWidths`: (array) Array of 'Ints' to be used for width approximation calculation
- `photoHeights`: (array) Array of 'Ints' to be used for height approximation calculation
- `placeholderImage`: (string) Set global placeholder image url to be used while waiting for original image (default: '')
	
#### Methods:
- `setId(id: string)`: Sets the client id
- `getSettings()`: Gets the settings

### CloudtasksDirective
- `ctSrc`: (string) (required) Sets original image url
- `ctOptions`: (object) (optional) Sets options for image processing ([Docs](https://cloudtasks.io/docs/image/#image))
- `ctPlaceholderImage`: (string) (optional) Sets placeholder image url to be used while waiting for original image
- `ctSize`: (string) (optional) Sets size for image processing (if not set we will try to check the best size automatically)
- `ctForceSize`: (boolean) (optional) Forces the exact size for image processing

Example:
```html
<img [ctSrc]="'{{imgUrl}}'" [ctSize]="'800x600'" [ctOptions]="{trim: true, smart: 'face', filters: 'blur(10):flip()'}" [ctPlaceholderImage]="'http://example.com/placeholderImage.jpg'" [ctForceSize]="true">
```

## License

(The MIT License)

Copyright (c) 2015 [Reality Connect](http://reality-connect.pt)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[npm-url]: https://npmjs.org/package/angular2-cloudtasks
[npm-image]: https://badge.fury.io/js/angular2-cloudtasks.svg
[travis-url]: https://travis-ci.org/Cloudtasks/angular2-cloudtasks
[travis-image]: https://travis-ci.org/Cloudtasks/angular2-cloudtasks.svg?branch=master
