# ngx-block-loading

A loading spinner for Angular applications that appears when HTTP requests are running, and optionally when elements are rendering.

[![npm version](https://badge.fury.io/js/ngx-block-loading.svg)](https://badge.fury.io/js/ngx-block-loading)

## Table of contents
- [ngx-block-loading](#ngx-block-loading)
  - [Table of contents](#table-of-contents)
  - [Demo](#demo)
  - [Installation](#installation)
    - [NPM](#npm)
  - [Getting started](#getting-started)
    - [Full Page Blocking](#full-page-blocking)
    - [Rendering](#rendering)
  - [Customisation](#customisation)
    - [Input parameters](#input-parameters)
    - [Styles](#styles)

## Demo

For a demo, download the repository, then run the following commands

```
npm run start-fake-api
npm run watch:lib
npm start
```

The first command will start a fake API that is used to test the rendering part of the library, the second will compile `ngx-block-loading`, the third command will open a demo site that shows this working.

## Installation
Install `ngx-block-loading` via NPM, using the command below.

### NPM
```shell
npm install --save ngx-block-loading
```

## Getting started
Import the `NgxBlockLoadingModule` in your root application module:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxBlockLoadingModule } from 'ngx-block-loading';

@NgModule({
  //...
  imports: [
    //...
    NgxBlockLoadingModule.forRoot()
  ],
  //...
})
export class AppModule { }
```

You must mark a HTML element as being an element that will have a block loading element displayed over the top of it.

```html
<div ngxBlockLoading></div>
```

This will create a new element within this marked HTML element that will display a loading gif. This can be customised using CSS classes. See [Customisation](#customisation)

### Full Page Blocking

If you want to block the whole page when loading in a certain case you need to have the full page loading component added.

```html
<ngx-block-loading-full-page></ngx-block-loading-full-page>
```

You also need to mark the HTTP request as being a full page loading request.

```typescript
this.http.get('https://test.com').pipe(ngxBlockLoadingFullPage())
```

### Rendering

You can also keep the loading gif on top of the element until a certain amount of rendering is done. This is done by putting a directive against the element that is rendering and passing `false` when rendering `true` when finished. The most common usage for this is `ngFor`

```html
<tr *ngFor="let result of results; let isLast = last" [ngxBlockRendered]="isLast">
```

## Customisation

There are multiple levels at which you can customise.

1. Module import level
2. Element level
3. Full page element level

Most of the options across these levels are the same, so he options are just marked with what is available at each level.

### Input parameters

| Input                 | Default                      | Module             | Element            | Full Page          | Details                                                                                                         |
| --------------------- | ---------------------------- | ------------------ | ------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------- |
| inTime                | 0.25s                        | :heavy_check_mark: | :heavy_check_mark: | :x:                | The length of time to animate the element that is block loading is shrunk to the specified height.              |
| outTime               | 0.25s                        | :heavy_check_mark: | :heavy_check_mark: | :x:                | The length of time to animate the element back to its normal size.                                              |
| loaderOutTime         | 0.25s                        | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | The length of time to take in removing the loading gif.                                                         |
| containerHeight       | 100px                        | :heavy_check_mark: | :heavy_check_mark: | :x:                | The height to take with the blocking loading gif.                                                               |
| loadingContainerClass | ngx-block-loading--container | :heavy_check_mark: | :heavy_check_mark: | :x:                | The CSS class to put on the container for the block loading gif.                                                |
| loadingClass          | ngx-block-loading            | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | The CSS class to put on the loading element itself.                                                             |
| loadingFullPageClass  | ngx-block-loading__full-page | :heavy_check_mark: | :x:                | :heavy_check_mark: | The extra class that goes on the full page version of the loading element itself.                               |
| template              |                              | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | The Angular template inserted as the loading element.                                                           |
| ngxBlockLoading       |                              | :x:                | :heavy_check_mark: | :x:                | Override whether or not to display the loading element. If this is specified running HTTP requests are ignored. |
| isLoading             |                              | :x:                | :x:                | :heavy_check_mark: | Override whether or not to display the loading element. If this is specified running HTTP requests are ignored. |
| routesToIgnore        | []                           | :heavy_check_mark: | :x:                | :x:                | The routes to ignore when displaying the loading gifs                                                           |

### Styles

In order to use the default styles you want to add the following to your regular `scss` file.

```scss
@import 'ngx-block-loading/assets/ngx-block-loading.scss';
```
