import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {IndexComponent} from './index/index.component';
import {NgHttpCachingConfig, NgHttpCachingModule} from 'ng-http-caching';
import {SharedModule} from './shared/shared.module';
import {HttpClientModule} from '@angular/common/http';

const ngHttpCachingConfig: NgHttpCachingConfig = {
  lifetime: 1000 * 10, // cache expire after 10 seconds
};

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    IndexComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgHttpCachingModule.forRoot(ngHttpCachingConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
