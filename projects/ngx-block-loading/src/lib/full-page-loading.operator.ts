import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

let loadingCount = 0;

export const isLoadingFullPage = new BehaviorSubject<boolean>(false);

function updateLoading(): void {
    isLoadingFullPage.next(loadingCount > 0);
}

export function fullPageLoading() {
    return function <T>(source: Observable<T>): Observable<T> {
        source
            .pipe(
                finalize(() => {
                    loadingCount--;
                    updateLoading();
                })
            )
            .subscribe();
        loadingCount++;
        updateLoading();
        return source;
    };
}
