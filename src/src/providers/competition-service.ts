// Angular references
import { Injectable } from '@angular/core';

// RxJS references
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

// Models and services
import { HttpClientService } from '../providers/http-client-service';

export class CompetitionViewModel {
    public id: number;
    public name: string;
    public sponsor: any;
    public dateUtc: Date;
    public location: string;
    public startListFileUrl: string;
    public scoreFileUrl: string;
    public invitationsFileUrl: string;
}

@Injectable()
export class CompetitionService {

    constructor(private http: HttpClientService) {}

    // Method that obtains the list of competitions
    public getAll(): Observable<Array<CompetitionViewModel>> {
        return this.http.get('competition').map(res => res.json());
    }

    // Method that returns the encoded URL for opening a PDF with InAppBrowser plugin
    public getGoogleDocsUrlForPdf(url: string): string {
        // URL used to display PDF files since Android's webview does not have PDF viewer built-in
        // http://stackoverflow.com/a/26310942/3915438
        let fullUrl = `https://docs.google.com/gview?embedded=true&url=${url}`;
        return encodeURI(fullUrl);
    }
}