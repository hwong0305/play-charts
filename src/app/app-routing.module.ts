import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomDashboardComponent } from './component/custom-dashboard/custom-dashboard.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    pathMatch: 'full',
  },
  {
    path: 'custom',
    component: CustomDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
