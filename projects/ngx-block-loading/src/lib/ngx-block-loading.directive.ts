import {
    animate,
    animation,
    AnimationPlayer,
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
    SimpleChanges
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AnimationHelperService, HasAnimations } from './animation-helper.service';
import { NGX_BLOCK_LOADING_OPTIONS, NgxBlockLoadingOptions } from './ngx-block-loading.options';
import { NgxBlockLoadingService } from './ngx-block-loading.service';

@Directive({
    selector: '[ngxBlockLoading]'
})
export class NgxBlockLoadingDirective
    implements OnChanges, OnDestroy, HasAnimations {
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
    @Input('ngxBlockLoading')
    isLoading: boolean = false;
    @Input()
    fullPage: boolean = false;

    private loadingElement?: ElementRef;
    private hasLoadingElement: boolean = false;
    player?: AnimationPlayer;
    private onDestroy$ = new Subject();

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
        private readonly loadingService: NgxBlockLoadingService,
        private readonly renderer: Renderer2,
        @Inject(NGX_BLOCK_LOADING_OPTIONS)
        private readonly options: NgxBlockLoadingOptions,
        public readonly animationHelper: AnimationHelperService
    ) {
        this.inTime = this.options.defaultInTime || '0.25s';
        this.outTime = this.options.defaultOutTime || '0.25s';
        this.loaderOutTime = this.options.defaultLoaderOutTime || '0.25s';
        this.containerHeight = this.options.defaultContainerHeight || '100px';
        this.loadingContainerClass =
            this.options.defaultLoadingContainerClass ||
            'ngx-block-loading--container';
        this.loadingClass =
            this.options.defaultLoadingClass || 'ngx-block-loading';

        this.loadingService.loadingSource
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(loading => {
                this.updateLoading(loading);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isLoading']) {
            this.updateLoadingElement(this.loadingService.loading);
        }
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private updateLoading(loading: boolean): void {
        if (this.fullPage) {
            if (loading) {
                this.loadingService.addFullPageLoading();
            } else {
                this.loadingService.removeFullPageLoading();
            }
        } else {
            this.updateLoadingElement(loading);
        }
    }

    private updateLoadingElement(loading: boolean): void {
        const isLoading = loading || this.isLoading === true;
        if (isLoading && !this.hasLoadingElement) {
            this.createLoadingElement();
        } else if (!isLoading && this.hasLoadingElement) {
            // Waiting a tick here because we need to let Angular finish rendering
            // It is likely that it actually hasn't
            setTimeout(() => this.removeLoadingElement(), 0);
        }
    }

    private createLoadingElement(): void {
        this.renderer.addClass(
            this.element.nativeElement,
            this.loadingContainerClass
        );
        this.loadingElement = new ElementRef(
            this.renderer.createElement('div')
        );
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
            () => {
                this.hasLoadingElement = false;
                this.animationHelper.animate(
                    this,
                    this.loadingElement,
                    animation([
                        this.loadingStyle,
                        animate(this.loaderOutTime, this.notLoadingStyle)
                    ]),
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
