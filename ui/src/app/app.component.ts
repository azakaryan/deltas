import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AppTitle} from "./core/constants/app.constants";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = AppTitle;
}
