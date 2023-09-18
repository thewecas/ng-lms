import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snakbar: MatSnackBar) {}

  /**
   * Displays a snakbar
   * @param message - content to be dispalyed
   * @param className - error | success | warn | info
   * @param isHttpError - if true then formats the error message to easily readable string
   */
  show(message: string, className: string, isHttpError: boolean = false) {
    if (isHttpError) {
      message = this.formatErrorMessage(message);
    }
    const config = new MatSnackBarConfig();
    config.horizontalPosition = 'end';
    config.verticalPosition = 'top';
    config.announcementMessage = message;
    // config.duration = 3000;
    config.panelClass = ['toast', className];
    this.snakbar.open(message, ' ', config);
  }

  /**
   * Function to format the error message to easily readable string
   * replaces '-' with space & converts to title case
   * @param err - error message from the HttpErrorResponse
   * @returns - formated error message
   */
  private formatErrorMessage(err: string) {
    const op = err
      .split('_')
      .map(
        (str) =>
          str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase()
      );
    return op.join(' ');
  }
}
