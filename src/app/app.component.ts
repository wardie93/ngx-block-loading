import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ngxBlockLoadingFullPage } from 'ngx-block-loading';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    @ViewChild('template')
    template?: TemplateRef<any>;

    title = 'ngx-block-loading-app';
    fullPageLoading: boolean = false;
    testRendering: boolean = false;
    useTemplate: boolean = false;
    results: any[] = [];

    constructor(private readonly http: HttpClient) {}

    loadingTest(): void {
        this.results = [];

        const httpRequest = this.http.get<any[]>(
            'http://localhost:3000/users'
        );

        if (this.fullPageLoading) {
            httpRequest.pipe(ngxBlockLoadingFullPage());
        }

        httpRequest.subscribe(response => {
            this.results = response.slice(0, 10);
        });
    }
}
