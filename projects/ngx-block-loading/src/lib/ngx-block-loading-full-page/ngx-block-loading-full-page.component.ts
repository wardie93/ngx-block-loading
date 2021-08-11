import {
    animate,
    animation,
    AnimationStyleMetadata,
    style
} from '@angular/animations';
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
import { isLoadingFullPage } from '../blocking.operator';
import {
    NgxBlockLoadingOptions,
    NGX_BLOCK_LOADING_OPTIONS
} from '../ngx-block-loading.options';

@Component({
    selector: 'ngx-block-loading-full-page',
    templateUrl: './ngx-block-loading-full-page.component.html',
    styleUrls: ['./ngx-block-loading-full-page.component.scss']
})
export class NgxBlockLoadingFullPageComponent
    implements OnChanges, HasAnimations
{
    @Input()
    template?: TemplateRef<any>;
    @Input()
    loaderOutTime: string;
    @Input()
    loadingClass: string;
    @Input()
    loadingFullPageClass: string;
    @Input('loading')
    isLoading?: boolean;

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
        @Inject(NGX_BLOCK_LOADING_OPTIONS)
        private readonly options: NgxBlockLoadingOptions,
        public readonly animationHelper: AnimationHelperService
    ) {
        this.loaderOutTime = this.options.loaderOutTime!;
        this.loadingClass = this.options.loadingClass!;
        this.loadingFullPageClass = this.options.loadingFullPageClass!;

        isLoadingFullPage
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(loading => {
                if (this.isLoading == undefined) {
                    this.updateLoading(loading);
                }
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const loadingChanges = changes['loading'];
        if (loadingChanges) {
            this.updateLoading(loadingChanges.currentValue);
        }
    }

    private updateLoading(loading: boolean): void {
        if (loading) {
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
