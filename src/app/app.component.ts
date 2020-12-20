import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { delay } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'ngx-block-loading-app';

    fullPageLoading: boolean = false;

    constructor(private readonly http: HttpClient) {}

    loadingTest(): void {
        this.http
            .get('https://jsonplaceholder.typicode.com/posts')
            .pipe(delay(3000))
            .subscribe();
    }
}
