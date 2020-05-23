import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {

  transform(value: any, decimals: number = 0): any {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

}
