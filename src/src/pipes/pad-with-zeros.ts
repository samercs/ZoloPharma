// Angular references
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'padWithZeros' })
export class PadWithZerosPipe implements PipeTransform {
    transform(value: number, digits: number): string {
        var stringValue = value.toString();
        while (stringValue.length < digits) stringValue = "0" + stringValue;
        return stringValue;
    }
}