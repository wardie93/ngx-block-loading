import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ngxBlockLoading, ngxBlockLoadingFullPage } from 'ngx-block-loading';
import { NgxBlockLoadingDirective } from 'projects/ngx-block-loading/src/public-api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    @ViewChild('template')
    template?: TemplateRef<any>;

    @ViewChild('loadingDirective')
    loadingDirective?: NgxBlockLoadingDirective;

    title = 'ngx-block-loading-app';
    fullPageLoading: boolean = false;
    testRendering: boolean = false;
    useTemplate: boolean = false;
    results: any[] = [];
    iteration: number = 0;

    constructor(private readonly http: HttpClient) { }

    loadingTest(): void {
        this.iteration++;

        this.results = [];

        const httpRequest = this.http.get<any[]>(
            'http://localhost:3000/users'
        ).pipe(ngxBlockLoading(this.loadingDirective));

        if (this.fullPageLoading) {
            httpRequest.pipe(ngxBlockLoadingFullPage());
        }

        httpRequest.subscribe(response => {
            const pageSize = 10 - ((this.iteration % 10) - 1);

            this.results = response.slice(0, pageSize);
        });
    }
}
