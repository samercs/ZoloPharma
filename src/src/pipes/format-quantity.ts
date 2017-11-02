// Angular references
import { Injectable, Pipe, PipeTransform } from '@angular/core';

// Config object
import { APP_CONFIG } from '../app/app.config';

@Pipe({ name: 'formatQuantity' })
@Injectable()
export class FormatQuantityPipe implements PipeTransform {
    transform(value: number) {
        var stringValue = value ? value.toString() : '';
        while (stringValue.length < APP_CONFIG.quantityIntegerDigits) stringValue = "0" + stringValue;
        return stringValue;
    }
}
