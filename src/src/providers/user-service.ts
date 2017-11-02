// Angular references
import { Injectable } from '@angular/core';

// RxJS references
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

// MomentsJS references
import * as moment from 'moment';

// Models and services
import { VideoViewModel } from '../providers/video-service';
import { HttpClientService } from '../providers/http-client-service';
import { AccountService } from '../providers/account-service';

export class UserProfileViewModel {
    public email: string;
    public firstName: string;
    public lastName: string;
    public phoneNumber: string;
    public subscriptionEndDateUtc: Date
    public subscriptionStatus: string;
}

export class PhoneNumberViewModel {
    public phoneCountryCode: string;
    public phoneLocalNumber: string;
}

export class EditUserProfileViewModel {
    public firstName: string;
    public lastName: string;
    public email: string;
    public phoneNumberViewModel: PhoneNumberViewModel;
}

export class ChangePasswordModel {
    public oldPassword: string;
    public newPassword: string;
    public confirmPassword: string;
}

@Injectable()
export class UserService {

    constructor(private http: HttpClientService,
        private accountService: AccountService) { }

    // Method that obtains the list of favorite videos
    public getAllFavorites(): Observable<Array<VideoViewModel>> {
        let token = this.accountService.getCurrentToken();
        return this.http.get('user/current/favorite-video', token).map(res => res.json());
    }

    // Method that checks if a video is included in the favorites from the user
    public isVideoInFavorites(aVideo: VideoViewModel): Observable<boolean> {
        let token = this.accountService.getCurrentToken();
        return this.http.get('user/current/favorite-video', token)
            .map(res => res.json())
            .map((favorites: Array<VideoViewModel>) => {

                if (!favorites || !favorites.length)
                    return false;

                let included = favorites.find(video => video.vedioVimeoUrl === aVideo.vedioVimeoUrl);
                return included ? true : false;
            });
    }

    // Method that adds a video to the user favorites list
    public addToFavorites(videoId: number): Observable<string> {
        let token = this.accountService.getCurrentToken();
        return this.http.post(`user/current/${videoId}/add-favorite`, null, token)
            .map(res => res.json())
            .map(res => res.message);
    }

    // Method that removes a video from the user favorites list
    public removeFromFavorites(videoId: number): Observable<string> {
        let token = this.accountService.getCurrentToken();
        return this.http.post(`user/current/${videoId}/remove-favorite`, null, token)
            .map(res => res.json())
            .map(res => res.message);
    }

    // Method that checks if the user has a valid subscription
    public hasValidSubscription(): Observable<boolean> {
        let token = this.accountService.getCurrentToken();
        return this.http.get('user/current/profile', token)
            .map(res => res.json())
            .map((userProfile: UserProfileViewModel) => {

                if (userProfile.subscriptionStatus === 'No Subscription') {
                    return false;
                }

                let now = moment(),
                    subscriptionEndDateUtc = moment(userProfile.subscriptionEndDateUtc),
                    difference = subscriptionEndDateUtc.diff(now, 'days');

                return difference >= 0 ? true : false;
            });
    }

    // Method that returns the profile details of the user
    public getUserProfileDetails(): Observable<UserProfileViewModel> {
        let token = this.accountService.getCurrentToken();
        return this.http.get('user/current/profile', token).map(res => res.json());
    }

    // Method that updates the profile details of the user
    public updateProfile(model: EditUserProfileViewModel): Observable<string> {
        let token = this.accountService.getCurrentToken();
        return this.http.put('user/current/profile', model, token);
    }

    // Method that changes the password of the user
    public changePassword(model: ChangePasswordModel): Observable<string> {
        let token = this.accountService.getCurrentToken();
        return this.http.put('user/current/change-password', model, token);
    }
}