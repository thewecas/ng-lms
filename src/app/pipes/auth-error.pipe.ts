import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'authError',
  standalone: true
})
export class AuthErrorPipe implements PipeTransform {

  transform(error: string, ...args: unknown[]): string {
    if (!error) return '';
    else
      return error.substring(5).replaceAll('-', ' ');
  }


}
