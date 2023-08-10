import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RestErrorComponent} from './http-clients/rest-error/rest-error.component';
import {CardComponent} from './card/card.component';
import {CardSubtitleComponent} from './card/card-subtitle/card-subtitle.component';
import {CardTitleComponent} from './card/card-title/card-title.component';
import {CardHeaderComponent} from './card/card-header/card-header.component';
import {CardContentComponent} from './card/card-content/card-content.component';
import {RequiredComponent} from './required/required.component';


@NgModule({
  declarations: [
    RestErrorComponent,
    CardComponent,
    CardTitleComponent,
    CardSubtitleComponent,
    CardHeaderComponent,
    CardContentComponent,
    RequiredComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    RestErrorComponent,
    CardComponent,
    CardTitleComponent,
    CardSubtitleComponent,
    CardHeaderComponent,
    CardContentComponent,
    RequiredComponent,
  ],
})
export class SharedModule {
}
