import {
    Directive,
    ElementRef,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { BaseLoadingDirective } from './base-loading.directive';
import { NgxBlockLoadingDirective } from './ngx-block-loading.directive';

@Directive({
    selector: '[ngxBlockRendering]'
})
export class NgxBlockRenderingDirective
    extends BaseLoadingDirective
    implements OnChanges {
    private _isRendering: boolean = true;

    @Input('ngxBlockRendering')
    set isRendering(value: boolean | '') {
        this._isRendering = value !== '' && (value as unknown as boolean);
    }
    get isRendering(): boolean | '' {
        return this._isRendering;
    }

    @Input()
    startOnInit = true;
    @Input()
    forceStart = false;
    @Input()
    loadingDirective?: NgxBlockLoadingDirective;

    // Type for isLoading and forceAdd, without this it doesn't
    // work when the consuming app has strict template type checking enabled
    // See https://angular.io/guide/template-typecheck#input-setter-coercion
    static ngAcceptInputType_isRendered: boolean | '';

    get elementToLoad(): ElementRef | undefined {
        if (this.element?.nativeElement.parentElement) {
            return new ElementRef(this.element?.nativeElement.parentElement);
        }
        return undefined;
    }

    ngOnInit(): void {
        if (this.startOnInit && this.isRendering && !this.loadingDirective) {
            this.start();
        }
        if (this.loadingDirective && this.isRendering) {
            this.loadingDirective.addRenderingElement(this);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isRendered'] && !this.isRendering) {
            if (this.loadingDirective) {
                this.loadingDirective.removeRenderingElement(this);
                this.loadingDirective.stop();
                return;
            }
            this.stop();
        }
        if (changes['forceStart'] && this.isRendering) {
            this.start();
        }
    }
}
