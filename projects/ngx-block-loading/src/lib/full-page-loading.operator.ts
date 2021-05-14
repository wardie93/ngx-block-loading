import { BehaviorSubject, defer, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

let loadingCount = 0;

export const isLoadingFullPage = new BehaviorSubject<boolean>(false);

function updateLoading(): void {
    isLoadingFullPage.next(loadingCount > 0);
}

export function ngxBlockLoadingFullPage() {
    return function <T>(source: Observable<T>): Observable<T> {
        return defer(() => {
            loadingCount++;
            updateLoading();
            return source.pipe(
                finalize(() => {
                    loadingCount--;
                    updateLoading();
                })
            );
        });
    };
}
