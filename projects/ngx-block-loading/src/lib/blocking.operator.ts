import { NgxBlockRenderedDirective } from 'projects/ngx-block-loading/src/lib/ngx-block-rendered.directive';
import { BehaviorSubject, defer, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxBlockLoadingDirective } from './ngx-block-loading.directive';

function getArray<T>(param: T | T[] | undefined): T[] {
    let array: T[] = [];

    if (param) {
        if (Array.isArray(param)) {
            array = param as T[];
        }
        else {
            array = [param as T];
        }
    }

    return array;
}

let loadingCount = 0;

export const isLoadingFullPage = new BehaviorSubject<boolean>(false);

function updateFullPageLoading(): void {
    isLoadingFullPage.next(loadingCount > 0);

}

export function ngxBlockLoading(
    params: {
        blocking?: NgxBlockLoadingDirective | NgxBlockLoadingDirective[],
        fullPage?: boolean,
        rendering?: NgxBlockRenderedDirective | NgxBlockRenderedDirective[];
    }
) {
    let loadingDirectives = getArray<NgxBlockLoadingDirective>(params.blocking);
    let renderedDirectives = getArray<NgxBlockRenderedDirective>(params.rendering);

    return function <T>(source: Observable<T>): Observable<T> {
        return defer(() => {
            loadingDirectives.forEach(d => d.updateLoadingElement(true));

            if(params.fullPage) {
                loadingCount++;
                updateFullPageLoading();
            }

            return source.pipe(
                finalize(() => {
                    loadingDirectives.forEach(d =>
                        d.updateLoadingElement(false)
                    );
                    if(params.fullPage) {
                        loadingCount--;
                        updateFullPageLoading();
                    }
                })
            );
        });
    };
}
