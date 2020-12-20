import { TestBed } from '@angular/core/testing';

import { NgxBlockLoadingInterceptor } from './ngx-block-loading.interceptor';

describe('LoadingInterceptor', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [NgxBlockLoadingInterceptor]
        })
    );

    it('should be created', () => {
        const interceptor: NgxBlockLoadingInterceptor = TestBed.inject(
            NgxBlockLoadingInterceptor
        );
        expect(interceptor).toBeTruthy();
    });
});
