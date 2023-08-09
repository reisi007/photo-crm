import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {IndexComponent} from './index/index.component';
import {CardComponent} from './card/card.component';
import {CardTitleComponent} from './card/card-title/card-title.component';
import {CardSubtitleComponent} from './card/card-subtitle/card-subtitle.component';
import {CardHeaderComponent} from './card/card-header/card-header.component';
import {CardContentComponent} from './card/card-content/card-content.component';
import {NgHttpCachingConfig, NgHttpCachingModule} from 'ng-http-caching';
import { RestErrorComponent } from './shared/http-clients/rest-error/rest-error.component';

const ngHttpCachingConfig: NgHttpCachingConfig = {
  lifetime: 1000 * 10, // cache expire after 10 seconds
};

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    IndexComponent,
    CardComponent,
    CardTitleComponent,
    CardSubtitleComponent,
    CardHeaderComponent,
    CardContentComponent,
    RestErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgHttpCachingModule.forRoot(ngHttpCachingConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    RestErrorComponent,
  ],
})
export class AppModule {
}
