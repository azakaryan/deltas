import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {ErrorHandler, NgModule} from "@angular/core";
import {ErrorHandlerService} from "./services/error-handler/error-handler.service";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatToolbarModule} from "@angular/material/toolbar";
import {RestService} from "./services/api/rest.service";
import {ModelsService} from "./services/api/models/models.service";
import {ModelDetailsService} from "./services/api/model-details/model-details.service";
import {NotificationService} from "./services/notification/notification.service";
import {NavigationService} from "./services/navigation/navigation.service";
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatToolbarModule,
    MatSnackBarModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    RouterModule,
    HttpClientModule,
  ],
  providers: [
    RestService,
    ModelsService,
    ModelDetailsService,
    NotificationService,
    NavigationService,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
  ],
})
export class CoreModule { }

