import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { NGX_BLOCK_LOADING_OPTIONS, NgxBlockLoadingOptions } from './ngx-block-loading.options';
import { NgxBlockLoadingService } from './ngx-block-loading.service';

@Injectable()
export class NgxBlockLoadingInterceptor implements HttpInterceptor {
    private routesToIgnore: Array<string | RegExp>;

    constructor(
        @Inject(NGX_BLOCK_LOADING_OPTIONS) config: NgxBlockLoadingOptions,
        private readonly service: NgxBlockLoadingService
    ) {
        this.routesToIgnore = config.routesToIgnore || [];
    }

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        if (!this.shouldIgnoreRoute(request)) {
            this.service.addRunningRequest(request.urlWithParams);
        }

        return next.handle(request).pipe(
            finalize(() => {
                this.service.removeRunningRequest(request.urlWithParams);
            })
        );
    }

    private shouldIgnoreRoute(request: HttpRequest<any>): boolean {
        const url = request.url;

        return (
            this.routesToIgnore.findIndex(route =>
                typeof route === 'string'
                    ? route === url
                    : route instanceof RegExp
                    ? route.test(url)
                    : false
            ) > -1
        );
    }
}
