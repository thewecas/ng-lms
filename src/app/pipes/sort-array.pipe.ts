import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortArray',
  standalone: true,
})
export class SortArrayPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(array: any[], field: string, isAscending = true): any[] {
    let flag = -1;
    console.log('before', array);

    if (isAscending) flag = 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    array.sort((item1: any, item2: any) => {
      return (item1[field] > item2[field] ? 1 : -1) * flag;
    });
    console.log('after', array);

    return array;
  }
}
