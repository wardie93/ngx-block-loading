import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxBlockLoadingModule } from 'ngx-block-loading';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AppRoutingModule, NgxBlockLoadingModule.forRoot()],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
