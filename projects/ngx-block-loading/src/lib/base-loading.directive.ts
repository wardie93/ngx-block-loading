import { AnimationStyleMetadata, AUTO_STYLE, style } from '@angular/animations';
import {
    Directive,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    Renderer2,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';
import { Subject } from 'rxjs';
import {
    AnimationHelperService
} from './animation-helper.service';
import {
    NgxBlockLoadingOptions,
    NGX_BLOCK_LOADING_OPTIONS
} from './ngx-block-loading.options';

@Directive()
export abstract class BaseLoadingDirective implements OnDestroy {
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
    @Input()
    template?: TemplateRef<any>;

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

    abstract get elementToLoad(): ElementRef | undefined;

    constructor(
        protected element: ElementRef,
        protected readonly viewContainerRef: ViewContainerRef,
        protected readonly renderer: Renderer2,
        @Inject(NGX_BLOCK_LOADING_OPTIONS)
        protected readonly options: NgxBlockLoadingOptions,
        protected readonly animationHelper: AnimationHelperService
    ) {
        this.inTime = this.options.inTime!;
        this.outTime = this.options.outTime!;
        this.loaderOutTime = this.options.loaderOutTime!;
        this.containerHeight = this.options.containerHeight!;
        this.loadingContainerClass = this.options.loadingContainerClass!;
        this.loadingClass = this.options.loadingClass!;
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    start(): void {
        this.updateLoadingElement(true);
    }

    stop(): void {
        this.updateLoadingElement(false);
    }

    protected updateLoadingElement(isLoading: boolean): void {
        if (isLoading) {
            this.animationHelper.tryCreateLoadingElement(
                this.elementToLoad,
                this.getLoadingElement(),
                {
                    loading: this.loadingClass,
                    container: this.loadingContainerClass
                },
                {
                    containerLoading: this.loadingContainerStyle,
                    containerNotLoading: this.notLoadingContainerStyle
                },
                this.inTime,
                this.renderer,
                this.template == undefined
            );
        } else {
            // Waiting a tick here because we need to let Angular finish rendering
            // It is likely that it actually hasn't
            setTimeout(
                () => this.animationHelper.tryRemoveLoadingElement(
                    this.elementToLoad,
                    {
                        container: this.loadingContainerClass
                    },
                    {
                        loading: this.loadingStyle,
                        loadingContainer: this.loadingContainerStyle,
                        notLoading: this.notLoadingStyle
                    },
                    {
                        outTime: this.outTime,
                        loaderOutTime: this.loaderOutTime
                    },
                    this.renderer
                ),
                0
            );
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

    private getLoadingElement(): ElementRef {
        let loadingElement: ElementRef;

        if (this.template) {
            loadingElement = this.getTemplateElement();
        } else {
            loadingElement = new ElementRef(this.renderer.createElement('div'));
        }

        return loadingElement;
    }
}
