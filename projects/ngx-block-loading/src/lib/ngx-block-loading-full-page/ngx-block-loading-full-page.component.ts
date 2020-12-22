import { animate, animation, AnimationStyleMetadata, style } from '@angular/animations';
import {
    Component,
    ElementRef,
    Inject,
    Input,
    OnChanges,
    SimpleChanges,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
    AnimationHelperService,
    AnimationPlayerWrapper,
    HasAnimations
} from '../animation-helper.service';
import { NGX_BLOCK_LOADING_OPTIONS, NgxBlockLoadingOptions } from '../ngx-block-loading.options';
import { NgxBlockLoadingService } from '../ngx-block-loading.service';

@Component({
    selector: 'ngx-block-loading-full-page',
    templateUrl: './ngx-block-loading-full-page.component.html',
    styleUrls: ['./ngx-block-loading-full-page.component.scss']
})
export class NgxBlockLoadingFullPageComponent
    implements OnChanges, HasAnimations {
    @Input()
    template?: TemplateRef<any>;
    @Input()
    loaderOutTime: string;
    @Input()
    loadingClass: string;
    @Input()
    loadingFullPageClass: string;
    @Input('loading')
    isLoading: boolean = false;
    @Input()
    fullPage: boolean = false;

    @ViewChild('element', { static: false })
    element?: ElementRef;

    loading: boolean = false;
    players: AnimationPlayerWrapper[] = [];
    private onDestroy$ = new Subject();

    private get loadingStyle(): AnimationStyleMetadata {
        return style({
            visibility: 'visible',
            opacity: 1
        });
    }

    private get notLoadingStyle(): AnimationStyleMetadata {
        return style({
            visibility: 'hidden',
            opacity: 0
        });
    }

    constructor(
        private readonly loadingService: NgxBlockLoadingService,
        @Inject(NGX_BLOCK_LOADING_OPTIONS)
        private readonly options: NgxBlockLoadingOptions,
        public readonly animationHelper: AnimationHelperService
    ) {
        this.loaderOutTime = this.options.defaultLoaderOutTime!;
        this.loadingClass = this.options.defaultLoadingClass!;
        this.loadingFullPageClass = this.options.defaultLoadingFullPageClass!;

        this.loadingService.fullPageLoadingSource
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(loading => {
                this.updateLoading(loading);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['loading']) {
            this.updateLoading(this.loadingService.fullPageLoading);
        }
    }

    private updateLoading(loading: boolean): void {
        const value = loading || this.isLoading;
        if (value) {
            this.loading = true;
        } else {
            this.removeFullPageLoading();
        }
    }

    private removeFullPageLoading(): void {
        this.animationHelper.animate(
            this,
            this.element,
            animation([
                this.loadingStyle,
                animate(this.loaderOutTime, this.notLoadingStyle)
            ]),
            true,
            () => {
                this.loading = false;
            }
        );
    }
}
