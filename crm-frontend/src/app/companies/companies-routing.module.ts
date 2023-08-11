import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CompaniesComponent} from './companies.component';
import {CreateCompanyPageComponent} from './create-company-page/create-company-page.component';
import {UpdateCompanyPageComponent} from './update-company-page/update-company-page.component';

const routes: Routes = [
  {path: '', component: CompaniesComponent},
  {path: 'create', component: CreateCompanyPageComponent},
  {path: ':id', component: UpdateCompanyPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompaniesRoutingModule {
}
