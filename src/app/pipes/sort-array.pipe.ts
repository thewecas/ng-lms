import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortArray',
  standalone: true,
})
export class SortArrayPipe implements PipeTransform {

  transform(array: any[], field: string, isAscending: boolean = true): any[] {

    let flag = -1;
    if (isAscending)
      flag = 1;

    array.sort(
      (item1: any, item2: any) => {
        return (item1[field] > item2[field] ? 1 : -1) * flag;
      }
    );

    return array;
  }

}
