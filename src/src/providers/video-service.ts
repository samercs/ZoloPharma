// Angular references
import { Injectable } from '@angular/core';

// RxJS references
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

// Models and services
import { CompetitionViewModel } from '../providers/competition-service';
import { RiderViewModel } from '../providers/rider-service';
import { HttpClientService } from '../providers/http-client-service';

export class VideoViewModel {
    public id: number;
    public competition: CompetitionViewModel;
    public rider: RiderViewModel;
    public horseName: string;
    public vedioVimeoUrl: string;
}

@Injectable()
export class VideoService {

    constructor(private http: HttpClientService) {}

    // Method that obtains the list of videos according the query sent
    public getAll(query:string = ''): Observable<Array<VideoViewModel>> {
        return this.http.get(`video/${query}`).map(res => res.json());
    }
}