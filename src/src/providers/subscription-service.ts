// Angular references
import { Injectable } from '@angular/core';

// RxJS references
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

// Models and services
import { HttpClientService } from '../providers/http-client-service';

export class SubscriptionListViewModel {
    public name: string;
    public packages: Array<SubscriptionViewModel>;
}

export class SubscriptionViewModel {
    public name: string;
    public id: number;
    public days: number;
    public price: number;
    public subscriptionId: number;
    public createdUtc: Date;
}

@Injectable()
export class SubscriptionService {

    constructor(private http: HttpClientService) {}

    // Method that obtains all the available subscriptions from the server
    public getAvailableSubscriptions(): Observable<Array<SubscriptionViewModel>> {
        return this.http.get('subscription').map(res => res.json()).map(res => {
            return res[0].packages;
        })
    }
}