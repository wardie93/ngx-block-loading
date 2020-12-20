import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NgxBlockLoadingService {
    loadingSource = new BehaviorSubject<boolean>(false);
    fullPageLoadingSource = new BehaviorSubject<boolean>(false);

    private runningRequests: string[] = [];
    private rendering: Element[] = [];
    private fullPageLoadingCount: number = 0;

    get loading(): boolean {
        return this.loadingSource.value;
    }

    get loadingAsync(): Observable<boolean> {
        return this.loadingSource;
    }

    get fullPageLoading(): boolean {
        return this.fullPageLoadingSource.value;
    }

    get fullPageLoadingAsync(): Observable<boolean> {
        return this.fullPageLoadingSource;
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

    addFullPageLoading(): void {
        this.fullPageLoadingCount++;
        this.changeFullPageLoading();
    }

    removeFullPageLoading(): void {
        this.fullPageLoadingCount--;
        this.changeFullPageLoading();
    }

    private changeLoading() {
        const val =
            this.runningRequests.length > 0 || this.rendering.length > 0;

        this.loadingSource.next(val);
    }

    private changeFullPageLoading(): void {
        const val = this.fullPageLoadingCount > 0;
        this.fullPageLoadingSource.next(val);
    }
}
