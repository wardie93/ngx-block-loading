import {
    Directive,
    ElementRef,
    Inject,
    Input,
    OnChanges, Renderer2,
    SimpleChanges, ViewContainerRef
} from '@angular/core';
import {
    AnimationHelperService
} from './animation-helper.service';
import { BaseLoadingDirective } from './base-loading.directive';
import {
    NgxBlockLoadingOptions,
    NGX_BLOCK_LOADING_OPTIONS
} from './ngx-block-loading.options';

@Directive({
    selector: '[ngxBlockLoading]',
    exportAs: 'ngxBlockLoading'
})
export class NgxBlockLoadingDirective extends BaseLoadingDirective
    implements OnChanges {
    private _isLoading: boolean = false;

    @Input('ngxBlockLoading')
    set isLoading(value: boolean | '') {
        this._isLoading = value !== '' || (value as unknown as boolean);
    }
    get isLoading(): boolean | '' {
        return this._isLoading;
    }

    // Type for isLoading, without this it doesn't
    // work when the consuming app has strict template type checking enabled
    // See https://angular.io/guide/template-typecheck#input-setter-coercion
    static ngAcceptInputType_isLoading: boolean | '';

    protected get elementToLoad(): ElementRef | undefined {
        return this.element;
    }

    constructor(
        element: ElementRef,
        viewContainerRef: ViewContainerRef,
        renderer: Renderer2,
        @Inject(NGX_BLOCK_LOADING_OPTIONS)
        options: NgxBlockLoadingOptions,
        animationHelper: AnimationHelperService
    ) {
        super(element, viewContainerRef, renderer, options, animationHelper);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const isLoadingChanges = changes['isLoading'];
        if (isLoadingChanges) {
            this.updateLoadingElement(isLoadingChanges.currentValue);
        }
    }
}
