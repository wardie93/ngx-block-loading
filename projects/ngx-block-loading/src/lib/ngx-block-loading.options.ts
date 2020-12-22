import { InjectionToken, TemplateRef } from '@angular/core';

export const NGX_BLOCK_LOADING_OPTIONS = new InjectionToken(
    'NGX_BLOCK_LOADING_OPTIONS'
);

export interface NgxBlockLoadingOptions {
    routesToIgnore: Array<string | RegExp>;
    loadingTemplate?: TemplateRef<any>;
    inTime?: string;
    outTime?: string;
    loaderOutTime?: string;
    containerHeight?: string;
    loadingContainerClass?: string;
    loadingClass?: string;
    loadingFullPageClass?: string;
}

export const DEFAULT_OPTIONS: NgxBlockLoadingOptions = {
    routesToIgnore: [],
    inTime: '0.25s',
    outTime: '0.25s',
    loaderOutTime: '0.25s',
    containerHeight: '100px',
    loadingContainerClass: 'ngx-block-loading--container',
    loadingClass: 'ngx-block-loading',
    loadingFullPageClass: 'ngx-block-loading__full-page'
};
