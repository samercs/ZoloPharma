// Angular references
import { OpaqueToken } from '@angular/core';

// Token used to inject the configuration object
export let TOKEN_CONFIG = new OpaqueToken('app.config');

export interface AppConfig {

    // Application name
    appName: string;

    // Application mode
    // When testMode is set to true, the HttpClient won't be called, and mocks will
    // be returned instead. This mode can be used to develop/show the app when the 
    // required api endpoints are not yet ready
    testMode: boolean;

    // Localization
    defaultLanguage: string;
    availableLanguages: Array<string>;

    // Address
    defaultCountryCode: string;
    defaultCountryAreaCode: string;

    // Currency
    currencyIntegerDigits: number;
    currencyDecimalDigits: number;
    decimalSeparatorSymbol: string;

    // Quantity
    quantityIntegerDigits: number;

    // Search results
    pageSize: number;

    // HTTP Client
    timeout: number;
    apiKey: string;

    apiUrlLocal: string;
    apiUrlStaging: string;
    apiUrlProduction: string;

    tokenApiUrlLocal: string;
    tokenApiUrlStaging: string;
    tokenApiUrlProduction: string;
}

// Application Config object
export const APP_CONFIG: AppConfig = {

    // Application name
    appName: 'WatchHorseTV',

    // Application mode
    testMode: false,

    // Localization
    defaultLanguage:    'en',
    availableLanguages: ['en', 'ar'],

    // Address
    defaultCountryCode: 'kw',
    defaultCountryAreaCode: '+965',

     // Currency
    currencyIntegerDigits: 1,
    currencyDecimalDigits: 0,
    decimalSeparatorSymbol: '.',

    // Quantity
    quantityIntegerDigits: 2,

    // Search results
    pageSize: 10,

    // HTTP Client
    timeout:    30000,
    apiKey:     'UY0l7NgHenpPInEGxOKH',

    apiUrlLocal:        'https://localhost:port/api',
    apiUrlStaging:      'https://watchhorsetv-staging.azurewebsites.net/api',
    apiUrlProduction:   'https://watchhorsetv.azurewebsites.net/api',

    tokenApiUrlLocal:        'https://localhost:port/token',
    tokenApiUrlStaging:      'https://watchhorsetv-staging.azurewebsites.net/token',
    tokenApiUrlProduction:   'https://watchhorsetv.azurewebsites.net/token'
};