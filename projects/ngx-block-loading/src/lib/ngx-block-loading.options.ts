import { InjectionToken, TemplateRef } from '@angular/core';

export const NGX_BLOCK_LOADING_OPTIONS = new InjectionToken(
    'NGX_BLOCK_LOADING_OPTIONS'
);

export interface NgxBlockLoadingOptions {
    routesToIgnore: Array<string | RegExp>;
    loadingTemplate?: TemplateRef<any>;
    defaultInTime?: string;
    defaultOutTime?: string;
    defaultLoaderOutTime?: string;
    defaultContainerHeight?: string;
    defaultLoadingContainerClass?: string;
    defaultLoadingClass?: string;
    defaultLoadingFullPageClass?: string;
}

export const DEFAULT_OPTIONS: NgxBlockLoadingOptions = {
    routesToIgnore: [],
    defaultInTime: '0.25s',
    defaultOutTime: '0.25s',
    defaultLoaderOutTime: '0.25s',
    defaultContainerHeight: '100px',
    defaultLoadingContainerClass: 'ngx-block-loading--container',
    defaultLoadingClass: 'ngx-block-loading',
    defaultLoadingFullPageClass: 'ngx-block-loading__full-page'
};
