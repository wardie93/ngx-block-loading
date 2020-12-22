import { Directive, ElementRef, Input, OnChanges, OnDestroy } from '@angular/core';

import { NgxBlockLoadingService } from './ngx-block-loading.service';

@Directive({
    selector: '[ngxBlockRendered]'
})
export class NgxBlockRenderedDirective implements OnChanges, OnDestroy {
    private _isRendered: boolean = false;

    @Input('ngxBlockRendered')
    set isRendered(value: boolean | '') {
        this._isRendered = value !== '' || ((value as unknown) as boolean);
    }
    get isRendered(): boolean | '' {
        return this._isRendered;
    }

    // Type for isLoading, without this it doesn't
    // work when the consuming app has strict template type checking enabled
    // See https://angular.io/guide/template-typecheck#input-setter-coercion
    static ngAcceptInputType_isRendered: boolean | '';

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
