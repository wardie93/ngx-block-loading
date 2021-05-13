import {
    animate,
    animation,
    AnimationStyleMetadata,
    AUTO_STYLE,
    style
} from '@angular/animations';
import {
    Directive,
    ElementRef,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    Renderer2,
    SimpleChanges,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    AnimationHelperService,
    AnimationPlayerWrapper,
    HasAnimations
} from './animation-helper.service';
import {
    NgxBlockLoadingOptions,
    NGX_BLOCK_LOADING_OPTIONS
} from './ngx-block-loading.options';
import { NgxBlockLoadingService } from './ngx-block-loading.service';

@Directive({
    selector: '[ngxBlockLoading]'
})
export class NgxBlockLoadingDirective
    implements OnChanges, OnDestroy, HasAnimations
{
    @Input()
    inTime: string;
    @Input()
    outTime: string;
    @Input()
    loaderOutTime: string;
    @Input()
    containerHeight: string;
    @Input()
    loadingContainerClass: string;
    @Input()
    loadingClass: string;

    private _isLoading: boolean = false;

    @Input('ngxBlockLoading')
    set isLoading(value: boolean | '') {
        this._isLoading = value !== '' || (value as unknown as boolean);
        // Only override loading if the value isn't blank
        // If the value is blank this means that the directive is empty
        this.overrideLoading = value !== '';
    }
    get isLoading(): boolean | '' {
        return this._isLoading;
    }
    @Input()
    template?: TemplateRef<any>;

    private loadingElement?: ElementRef;
    private hasLoadingElement: boolean = false;
    private onDestroy$ = new Subject();
    private overrideLoading: boolean = false;
    players: AnimationPlayerWrapper[] = [];

    // Type for isLoading, without this it doesn't
    // work when the consuming app has strict template type checking enabled
    // See https://angular.io/guide/template-typecheck#input-setter-coercion
    static ngAcceptInputType_isLoading: boolean | '';

    private get loadingContainerStyle(): AnimationStyleMetadata {
        return style({
            height: this.containerHeight
        });
    }

    private get loadingStyle(): AnimationStyleMetadata {
        return style({
            visibility: 'visible',
            opacity: 1
        });
    }

    private get notLoadingContainerStyle(): AnimationStyleMetadata {
        return style({
            height: this.element?.nativeElement?.scrollHeight || AUTO_STYLE
        });
    }

    private get notLoadingStyle(): AnimationStyleMetadata {
        return style({
            visibility: 'hidden',
            opacity: 0
        });
    }

    constructor(
        private element: ElementRef,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly renderer: Renderer2,
        private readonly loadingService: NgxBlockLoadingService,
        @Inject(NGX_BLOCK_LOADING_OPTIONS)
        private readonly options: NgxBlockLoadingOptions,
        public readonly animationHelper: AnimationHelperService
    ) {
        this.inTime = this.options.inTime!;
        this.outTime = this.options.outTime!;
        this.loaderOutTime = this.options.loaderOutTime!;
        this.containerHeight = this.options.containerHeight!;
        this.loadingContainerClass = this.options.loadingContainerClass!;
        this.loadingClass = this.options.loadingClass!;

        this.loadingService.loadingSource
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(loading => {
                if (!this.overrideLoading) {
                    this.updateLoading(loading);
                }
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const isLoadingChanges = changes['isLoading'];
        if (isLoadingChanges) {
            this.updateLoadingElement(isLoadingChanges.currentValue);
        }
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private updateLoading(isLoading: boolean): void {
        this.updateLoadingElement(isLoading);
    }

    private updateLoadingElement(isLoading: boolean): void {
        if (isLoading && !this.hasLoadingElement) {
            this.createLoadingElement();
        } else if (!isLoading && this.hasLoadingElement) {
            // Waiting a tick here because we need to let Angular finish rendering
            // It is likely that it actually hasn't
            setTimeout(() => this.removeLoadingElement(), 0);
        }
    }

    private getTemplateElement(): ElementRef {
        this.viewContainerRef.clear();
        const viewRef = this.viewContainerRef.createEmbeddedView(
            this.template!
        );
        const element = viewRef.rootNodes[0];
        const duplicatedElement = element.cloneNode(true);
        this.viewContainerRef.clear();
        return new ElementRef(duplicatedElement);
    }

    private createLoadingElement(): void {
        this.renderer.addClass(
            this.element.nativeElement,
            this.loadingContainerClass
        );

        if (this.template) {
            this.loadingElement = this.getTemplateElement();
        } else {
            this.loadingElement = new ElementRef(
                this.renderer.createElement('div')
            );
        }

        this.renderer.appendChild(
            this.element.nativeElement,
            this.loadingElement!.nativeElement
        );
        this.renderer.addClass(
            this.loadingElement!.nativeElement,
            this.loadingClass
        );

        this.hasLoadingElement = true;

        this.animationHelper.animate(
            this,
            this.element,
            animation([
                this.notLoadingContainerStyle,
                animate(this.inTime, this.loadingContainerStyle)
            ])
        );
    }

    private removeLoadingElement(): void {
        this.players.forEach(player => {
            if (!this.animationHelper.isAnimationPlayerDone(player)) {
                player.player.destroy();
            }
        });
        this.animationHelper.animate(
            this,
            this.element,
            animation([
                this.loadingContainerStyle,
                animate(
                    this.outTime,
                    style({
                        height: this.element.nativeElement.scrollHeight
                    })
                )
            ]),
            true,
            () => {
                this.hasLoadingElement = false;
                this.animationHelper.animate(
                    this,
                    this.loadingElement,
                    animation([
                        this.loadingStyle,
                        animate(this.loaderOutTime, this.notLoadingStyle)
                    ]),
                    true,
                    () => {
                        this.renderer.removeChild(
                            this.element.nativeElement,
                            this.loadingElement!.nativeElement
                        );

                        this.renderer.removeClass(
                            this.element.nativeElement,
                            this.loadingContainerClass
                        );
                    }
                );
            }
        );
    }
}
