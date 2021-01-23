import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { fullPageLoading } from 'ngx-block-loading';

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
            // 'https://slowwly.robertomurray.co.uk/delay/5000/url/https://jsonplaceholder.typicode.com/posts'
            // 'https://jsonplaceholder.typicode.com/todos/1'
            'https://api.mocki.io/v1/a567c0a7'
        );

        if (this.fullPageLoading) {
            httpRequest.pipe(fullPageLoading());
        }

        httpRequest.subscribe(response => {
            this.results = response.slice(0, 10);
        });
    }
}
