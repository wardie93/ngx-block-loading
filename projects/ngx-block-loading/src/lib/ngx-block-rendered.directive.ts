import { Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NgxBlockLoadingService } from './ngx-block-loading.service';

@Directive({
    selector: '[ngxBlockRendered]'
})
export class NgxBlockRenderedDirective implements OnChanges, OnDestroy {
    private _isRendered: boolean = false;

    @Input('ngxBlockRendered')
    set isRendered(value: boolean | '') {
        this._isRendered =  value !== '' && value === true;
    }
    get isRendered(): boolean | '' {
        return this._isRendered;
    }

    @Input()
    forceAdd: boolean = false;

    // Type for isLoading, without this it doesn't
    // work when the consuming app has strict template type checking enabled
    // See https://angular.io/guide/template-typecheck#input-setter-coercion
    static ngAcceptInputType_isRendered: boolean | '';

    constructor(
        private readonly element: ElementRef,
        private readonly loadingService: NgxBlockLoadingService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['isRendered']) {
            if (this.isRendered) {
                this.loadingService.removeRenderingElement(this.element);
            } else {
                this.loadingService.addRenderingElement(this.element);
            }
        }
        if(changes['forceAdd'] && this.forceAdd) {
            this.loadingService.addRenderingElement(this.element);
        }
    }

    ngOnDestroy(): void {
        this.loadingService.removeRenderingElement(this.element);
    }
}
