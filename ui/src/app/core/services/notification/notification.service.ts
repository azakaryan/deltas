import { Injectable } from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  public showError(message: string): void {
    this.snackBar.open(message, 'Error', { panelClass: "mat-error-dialog" });
  }

  public showInfo(message: string): void {
    this.snackBar.open(message, 'Success!', { panelClass: "mat-success-dialog" });
  }
}
