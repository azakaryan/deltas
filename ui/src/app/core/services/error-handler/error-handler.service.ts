import { ErrorHandler, Injectable } from "@angular/core";
import {NotificationService} from "../notification/notification.service";

const errorMsgNetwork = 'Please, check your network connectivity\n. It seems there is no internet connection.';
const errorMsgGeneral = 'Something went wrong, please try later.';
const errorMsgBadRequest  = 'Bad Request.';
const errorMsgServer  = 'Server Error, please try later.';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {

  constructor(private notificationsService: NotificationService) {}

  public handleError(error: any): void {
    let errorMsg = errorMsgGeneral;
    const httpStatusCode = error.status;
    console.error(error);

    // If no httpStatusCode then it's a client side typeError. Do not show anything.
    if (!httpStatusCode) return;

    // Handle network issues.
    if (httpStatusCode === 0 && (error.statusText === '' || error.statusText === 'Unknown Error')) errorMsg = errorMsgNetwork;

    else if ( httpStatusCode < 400 ) return; /* Do nothing it's something unexpected. Errors should't be smaller then 400 */

    else if ( httpStatusCode === 400 ) errorMsg = errorMsgBadRequest;

    else if ( httpStatusCode > 400 && httpStatusCode < 500 ) {
      errorMsg = error.error.message;
    } else if (httpStatusCode >= 500 && httpStatusCode < 600) errorMsg = errorMsgServer;

    this.showError(errorMsg);
  }

  /*
   * Private Helpers
   */
  private showError(errorMsg: string): void {
    this.notificationsService.showError(errorMsg);
  }
}
