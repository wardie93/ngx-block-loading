import { Directive, ElementRef, Input, OnChanges, OnDestroy } from '@angular/core';

import { NgxBlockLoadingService } from './ngx-block-loading.service';

@Directive({
    selector: '[ngxBlockLoadingRendering]'
})
export class NgxBlockLoadingRenderingDirective implements OnChanges, OnDestroy {
    @Input('ngxBlockLoadingRendering')
    isRendered: boolean = false;

    constructor(
        private readonly element: ElementRef,
        private readonly loadingService: NgxBlockLoadingService
    ) {}

    ngOnChanges(): void {
        if (this.isRendered) {
            this.loadingService.removeRenderingElement(this.element);
        } else {
            this.loadingService.addRenderingElement(this.element);
        }
    }

    ngOnDestroy(): void {
        this.loadingService.removeRenderingElement(this.element);
    }
}
