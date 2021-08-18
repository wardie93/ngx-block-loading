import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import {
    NgxBlockLoadingFullPageComponent
} from './ngx-block-loading-full-page/ngx-block-loading-full-page.component';
import { NgxBlockLoadingDirective } from './ngx-block-loading.directive';
import {
    DEFAULT_OPTIONS, NgxBlockLoadingOptions, NGX_BLOCK_LOADING_OPTIONS
} from './ngx-block-loading.options';
import { NgxBlockRenderingDirective } from './ngx-block-rendering.directive';


export interface LoadingProviderOptions {
    provider?: Provider;
    config?: NgxBlockLoadingOptions;
}

@NgModule({
    imports: [CommonModule],
    declarations: [
        NgxBlockLoadingDirective,
        NgxBlockRenderingDirective,
        NgxBlockLoadingFullPageComponent
    ],
    exports: [
        NgxBlockLoadingDirective,
        NgxBlockRenderingDirective,
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
        loadingTemplate:
            options?.loadingTemplate || defaultOptions.loadingTemplate,
        inTime: options?.inTime || defaultOptions.inTime,
        outTime: options?.outTime || defaultOptions.outTime,
        loaderOutTime: options?.loaderOutTime || defaultOptions.loaderOutTime,
        containerHeight:
            options?.containerHeight || defaultOptions.containerHeight,
        loadingContainerClass:
            options?.loadingContainerClass ||
            defaultOptions.loadingContainerClass,
        loadingClass: options?.loadingClass || defaultOptions.loadingClass,
        loadingFullPageClass:
            options?.loadingFullPageClass || defaultOptions.loadingFullPageClass
    };
}
