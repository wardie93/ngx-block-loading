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
    - [Module Only](#module-only)
    - [Element Levels](#element-levels)
  - [TODO](#todo)

## Demo

For a demo, download the repository, then run the following commands

```
npm run serve:lib
npm start
```

The first command will compile `ngx-block-loading`, the second command will open a demo site that shows this working.

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
import { CoreModule } from './core/core.module';
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

You also need to mark the element that you are loading for as using the full page version of loading.

```html
<div ngxBlockLoading [fullPage]></div>
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

Most of the options across these levels are the same, so will just mark the options that are available at each level.

### Input parameters

| Input                 | Default                      | Module             | Element            | Full Page          | Details |
| --------------------- | ---------------------------- | ------------------ | ------------------ | ------------------ | ------- |
| inTime                | 0.25s                        | :heavy_check_mark: | :heavy_check_mark: | :x:                |         |
| outTime               | 0.25s                        | :heavy_check_mark: | :heavy_check_mark: | :x:                |         |
| loaderOutTime         | 0.25s                        | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |         |
| containerHeight       | 100px                        | :heavy_check_mark: | :heavy_check_mark: | :x:                |         |
| loadingContainerClass | ngx-block-loading--container | :heavy_check_mark: | :heavy_check_mark: | :x:                |         |
| loadingClass          | ngx-block-loading            | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |         |
| loadingFullPageClass  | ngx-block-loading__full-page | :heavy_check_mark: | :x:                | :heavy_check_mark: |         |
| template              |                              | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |         |

### Module Only

There is only one option that is configurable only at the module level.

| Input          | Default | Details                                               |
| -------------- | ------- | ----------------------------------------------------- |
| routesToIgnore | []      | The routes to ignore when displaying the loading gifs |


### Element Levels

There is one option that can only be used at element level - an override for whether or not the loading animation should be displayed in this case.

## TODO

- [ ] Make template work at element level and not just full page level
- [ ] Investigate if I need the full page component like I think I do