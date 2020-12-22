import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';

import {
    NgxBlockLoadingFullPageComponent
} from './ngx-block-loading-full-page/ngx-block-loading-full-page.component';
import { NgxBlockLoadingDirective } from './ngx-block-loading.directive';
import { NgxBlockLoadingInterceptor } from './ngx-block-loading.interceptor';
import {
    DEFAULT_OPTIONS,
    NGX_BLOCK_LOADING_OPTIONS,
    NgxBlockLoadingOptions
} from './ngx-block-loading.options';
import { NgxBlockRenderedDirective } from './ngx-block-rendered.directive';

export interface LoadingProviderOptions {
    provider?: Provider;
    config?: NgxBlockLoadingOptions;
}

@NgModule({
    imports: [CommonModule],
    declarations: [
        NgxBlockLoadingDirective,
        NgxBlockRenderedDirective,
        NgxBlockLoadingFullPageComponent
    ],
    exports: [
        NgxBlockLoadingDirective,
        NgxBlockRenderedDirective,
        NgxBlockLoadingFullPageComponent
    ]
})
export class NgxBlockLoadingModule {
    static forRoot(
        options?: LoadingProviderOptions
    ): ModuleWithProviders<NgxBlockLoadingModule> {
        return {
            ngModule: NgxBlockLoadingModule,
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: NgxBlockLoadingInterceptor,
                    multi: true
                },
                options?.provider || {
                    provide: NGX_BLOCK_LOADING_OPTIONS,
                    useValue: setDefaultOptions(options?.config)
                }
            ]
        };
    }
}

function setDefaultOptions(
    options?: NgxBlockLoadingOptions
): NgxBlockLoadingOptions {
    const defaultOptions = DEFAULT_OPTIONS;
    return {
        routesToIgnore:
            options?.routesToIgnore || defaultOptions.routesToIgnore,
        loadingTemplate:
            options?.loadingTemplate || defaultOptions.loadingTemplate,
        defaultInTime: options?.defaultInTime || defaultOptions.defaultInTime,
        defaultOutTime:
            options?.defaultOutTime || defaultOptions.defaultOutTime,
        defaultLoaderOutTime:
            options?.defaultLoaderOutTime ||
            defaultOptions.defaultLoaderOutTime,
        defaultContainerHeight:
            options?.defaultContainerHeight ||
            defaultOptions.defaultContainerHeight,
        defaultLoadingContainerClass:
            options?.defaultLoadingContainerClass ||
            defaultOptions.defaultLoadingContainerClass,
        defaultLoadingClass:
            options?.defaultLoadingClass || defaultOptions.defaultLoadingClass,
        defaultLoadingFullPageClass:
            options?.defaultLoadingFullPageClass ||
            defaultOptions.defaultLoadingFullPageClass
    };
}
