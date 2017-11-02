// Angular references
import { Injectable, Pipe, PipeTransform } from '@angular/core';

// Config object
import { APP_CONFIG } from '../app/app.config';

@Pipe({ name: 'formatCurrency' })
@Injectable()
export class FormatCurrencyPipe implements PipeTransform {
    transform(value: number) {
        let valueStr = value.toFixed(APP_CONFIG.currencyDecimalDigits),
            valueIntegerPartStr = valueStr.split('.')[0],
            valueDecimalPartStr = valueStr.split('.')[1];

        // Add 0 to the integer part
        while (valueIntegerPartStr.length < APP_CONFIG.currencyIntegerDigits) valueIntegerPartStr = "0" + valueIntegerPartStr;

        return APP_CONFIG.currencyDecimalDigits > 0 
                ? `KD ${valueIntegerPartStr}${APP_CONFIG.decimalSeparatorSymbol}${valueDecimalPartStr}`
                : `KD ${valueIntegerPartStr}`;
    }
}
