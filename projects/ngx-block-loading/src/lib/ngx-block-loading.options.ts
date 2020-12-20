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
