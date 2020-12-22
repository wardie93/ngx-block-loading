import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'ngx-block-loading-app';
    fullPageLoading: boolean = false;
    testRendering: boolean = false;
    results: any[] = [];

    constructor(private readonly http: HttpClient) {}

    loadingTest(): void {
        this.results = [];
        this.http
            .get<any[]>(
                'http://slowwly.robertomurray.co.uk/delay/5000/url/https://jsonplaceholder.typicode.com/posts'
            )
            .subscribe(response => {
                this.results = response.slice(0, 10);
            });
    }
}
