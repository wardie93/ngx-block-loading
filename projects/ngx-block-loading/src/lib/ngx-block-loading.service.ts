import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NgxBlockLoadingService {
    loadingSource = new BehaviorSubject<boolean>(false);

    private runningRequests: string[] = [];
    private rendering: Element[] = [];

    get loading(): boolean {
        return this.loadingSource.value;
    }

    get loadingAsync(): Observable<boolean> {
        return this.loadingSource;
    }

    addRunningRequest(request: string): void {
        if (!this.runningRequests.includes(request)) {
            this.runningRequests.push(request);
        }

        this.changeLoading();
    }

    removeRunningRequest(request: string): void {
        const requestIndex = this.runningRequests.indexOf(request);

        if (requestIndex > -1) {
            this.runningRequests.splice(requestIndex, 1);
        }

        this.changeLoading();
    }

    addRenderingElement(element: ElementRef): void {
        const parent = element.nativeElement.parentElement;
        if (!this.rendering.some(e => e == parent)) {
            this.rendering.push(parent);
            this.changeLoading();
        }
    }

    removeRenderingElement(element: ElementRef): void {
        const parent = element.nativeElement.parentElement;

        const index = this.rendering.indexOf(parent);

        if (index !== -1) {
            this.rendering.splice(index, 1);
            this.changeLoading();
        }
    }

    private changeLoading() {
        const val =
            this.runningRequests.length > 0 || this.rendering.length > 0;

        this.loadingSource.next(val);
    }
}
