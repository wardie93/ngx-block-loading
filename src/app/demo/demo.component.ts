import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ngxBlockLoading, NgxBlockLoadingDirective, ngxBlockLoadingFullPage } from 'ngx-block-loading';

@Component({
    selector: 'app-demo',
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.scss']
})
export class DemoComponent {
    @ViewChild('template')
    template?: TemplateRef<any>;

    @ViewChild('loadingDirective')
    loadingDirective?: NgxBlockLoadingDirective;

    fullPageLoading: boolean = false;
    testRendering: boolean = false;
    useTemplate: boolean = false;
    results: any[] = [];
    iteration: number = 0;

    constructor(private readonly http: HttpClient) { }

    loadingTest(): void {
        this.iteration++;

        this.results = [];

        let httpRequest = this.http.get<any[]>(
            'http://localhost:3000/users'
        );

        if (this.fullPageLoading) {
            httpRequest = httpRequest.pipe(ngxBlockLoadingFullPage());
        }
        else {
            httpRequest = httpRequest.pipe(ngxBlockLoading(this.loadingDirective));
        }

        httpRequest.subscribe(response => {
            const pageSize = 10 - ((this.iteration % 10) - 1);

            this.results = response.slice(0, pageSize);
        });
    }
}
