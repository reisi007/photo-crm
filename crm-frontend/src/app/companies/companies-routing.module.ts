import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CompaniesComponent} from './companies.component';
import {CreateCompanyPageComponent} from './create-company-page/create-company-page.component';
import {UpdateCompanyComponent} from './update-company-form/update-company.component';

const routes: Routes = [
  {path: '', component: CompaniesComponent},
  {path: 'create', component: CreateCompanyPageComponent},
  {path: 'update/{id}', component: UpdateCompanyComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompaniesRoutingModule {
}
