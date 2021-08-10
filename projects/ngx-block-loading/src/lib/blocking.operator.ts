import { NgxBlockLoadingDirective } from 'projects/ngx-block-loading/src/lib/ngx-block-loading.directive';
import { defer, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

export function ngxBlockLoading(
    ...directives: Array<NgxBlockLoadingDirective | undefined>
) {
    const loadingDirectives: NgxBlockLoadingDirective[] = directives
        .filter(d => d != undefined)
        .map(d => d as NgxBlockLoadingDirective);

    return function <T>(source: Observable<T>): Observable<T> {
        return defer(() => {
            loadingDirectives.forEach(d => d.updateLoadingElement(true));

            return source.pipe(
                finalize(() => {
                    loadingDirectives.forEach(d =>
                        d.updateLoadingElement(false)
                    );
                })
            );
        });
    };
}
