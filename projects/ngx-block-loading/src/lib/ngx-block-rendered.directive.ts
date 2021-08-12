import {
    Directive,
    ElementRef,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { BaseLoadingDirective } from './base-loading.directive';

@Directive({
    selector: '[ngxBlockRendered]'
})
export class NgxBlockRenderedDirective
    extends BaseLoadingDirective
    implements OnChanges
{
    private _isRendered: boolean = false;

    @Input('ngxBlockRendered')
    set isRendered(value: boolean | '') {
        this._isRendered = value !== '' && value === true;
    }
    get isRendered(): boolean | '' {
        return this._isRendered;
    }

    @Input()
    startOnInit = true;
    @Input()
    forceStart = false;

    // Type for isLoading and forceAdd, without this it doesn't
    // work when the consuming app has strict template type checking enabled
    // See https://angular.io/guide/template-typecheck#input-setter-coercion
    static ngAcceptInputType_isRendered: boolean | '';

    protected get elementToLoad(): ElementRef | undefined {
        if (this.element?.nativeElement.parentElement) {
            return new ElementRef(this.element?.nativeElement.parentElement);
        }
        return undefined;
    }

    ngOnInit(): void {
        if (this.startOnInit && !this.isRendered) {
            this.start();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isRendered'] && this.isRendered) {
            this.stop();
        }
        if (changes['forceStart'] && !this.isRendered) {
            this.start();
        }
    }
}
