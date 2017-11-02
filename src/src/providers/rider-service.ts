// Angular references
import { Injectable } from '@angular/core';

// RxJS references
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

// Models and services
import { HttpClientService } from '../providers/http-client-service';

export class RiderViewModel {
    public id: number;
    public name: string;
}

@Injectable()
export class RiderService {

    constructor(private http: HttpClientService) {}

    // Method that obtains the list of riders
    public getAll(): Observable<Array<RiderViewModel>> {
        return this.http.get('rider').map(res => res.json());
    }
}