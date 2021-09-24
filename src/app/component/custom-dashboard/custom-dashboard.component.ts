import { Component } from '@angular/core';
import { single } from 'src/app/models/data';

@Component({
  selector: 'app-custom-dashboard',
  templateUrl: './custom-dashboard.component.html',
  styleUrls: ['./custom-dashboard.component.scss'],
})
export class CustomDashboardComponent {
  results = single;
  showDataLabel = true;

  formatDataLabel(value) {
    return value + '%';
  }
}
