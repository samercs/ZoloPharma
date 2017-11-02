// Angular references
import { Injectable } from '@angular/core';

// RxJS references
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

// Models and services
import { HttpClientService } from '../providers/http-client-service';

export class HorseViewModel {
    public id: number;
    public name: string;
}

@Injectable()
export class HorseService {

    constructor(private http: HttpClientService) {}

    // Method that obtains the list of horses
    public getAll(): Observable<Array<HorseViewModel>> {
        return this.http.get('horse').map(res => res.json());
    }
}