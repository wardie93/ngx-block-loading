import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';

import {
    NgxBlockLoadingFullPageComponent
} from './ngx-block-loading-full-page/ngx-block-loading-full-page.component';
import { NgxBlockLoadingRenderingDirective } from './ngx-block-loading-rendering.directive';
import { NgxBlockLoadingDirective } from './ngx-block-loading.directive';
import { NgxBlockLoadingInterceptor } from './ngx-block-loading.interceptor';
import { NGX_BLOCK_LOADING_OPTIONS, NgxBlockLoadingOptions } from './ngx-block-loading.options';

// import 'loading.scss';
export interface LoadingProviderOptions {
    provider?: Provider;
    config?: NgxBlockLoadingOptions;
}

@NgModule({
    imports: [CommonModule],
    declarations: [
        NgxBlockLoadingDirective,
        NgxBlockLoadingRenderingDirective,
        NgxBlockLoadingFullPageComponent
    ],
    exports: [
        NgxBlockLoadingDirective,
        NgxBlockLoadingRenderingDirective,
        NgxBlockLoadingFullPageComponent
    ]
})
export class NgxBlockLoadingModule {
    static forRoot(
        options: LoadingProviderOptions
    ): ModuleWithProviders<NgxBlockLoadingModule> {
        return {
            ngModule: NgxBlockLoadingModule,
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: NgxBlockLoadingInterceptor,
                    multi: true
                },
                options.provider || {
                    provide: NGX_BLOCK_LOADING_OPTIONS,
                    useValue: options.config
                }
            ]
        };
    }
}
