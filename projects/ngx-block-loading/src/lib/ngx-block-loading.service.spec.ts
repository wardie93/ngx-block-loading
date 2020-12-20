import { TestBed } from '@angular/core/testing';

import { NgxBlockLoadingService } from './ngx-block-loading.service';

describe('LoadingService', () => {
    let service: NgxBlockLoadingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NgxBlockLoadingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
