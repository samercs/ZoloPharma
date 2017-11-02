// Angular references
import { Injectable } from '@angular/core';

// RxJS references
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

// Models and services
import { HttpClientService } from '../providers/http-client-service';

export class CountryInfoViewModel {
    public isoCode: string;
    public name: string;
    public phoneCountryCode: string;
}

@Injectable()
export class CountryService {

    constructor(private http: HttpClientService) {}

    // Method that obtains the list of countries
    public getCountries(): Observable<Array<CountryInfoViewModel>> {
        return this.http.get('countries').map(res => res.json());
    }
}