// Angular
import { Component, Injector } from '@angular/core';

// Pages
import { UserBasePage } from '../../../core/pages/user-base';
import { EditProfilePage } from '../edit-profile/edit-profile'

// Models
import { UserProfileViewModel } from '../../../providers/user-service';

// MomentsJS
import * as moment from 'moment';

// Animations
import { FadeInUp, FadeInRight, FadeIn } from '../../../utils/animations';

// Analytics config
import { AnalyticsConfig } from '../../../providers/analytics-service';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
    animations: [
        FadeIn('firstNameFieldFadeIn', '300ms linear'),
        FadeIn('lastNameFieldFadeIn', '300ms 300ms linear'),
        FadeIn('phoneNumberFieldFadeIn', '300ms 600ms linear'),
        FadeIn('emailFieldFadeIn', '300ms 900ms linear'),
        FadeIn('subscriptionFieldFadeIn', '300ms 1200ms linear'),
        FadeInRight('signOutButtonFadeInRight', '300ms 1800ms linear'),
        FadeInUp('editProfileButtonFadeInUp', '300ms 1500ms linear'),
    ]
})
export class SettingsPage extends UserBasePage {

    public userProfile: UserProfileViewModel;
    public subscriptionDaysLeft: number;
    public isSubscriptionExprired: boolean;

    // Animation states
    public firstNameFieldState: string = 'inactive';
    public lastNameFieldState: string = 'inactive';
    public phoneNumberFieldState: string = 'inactive';
    public emailFieldState: string = 'inactive';
    public subscriptionFieldState: string = 'inactive';
    public signOutButtonState: string = 'inactive';
    public editProfileButtonState: string = 'inactive';

    constructor(public injector: Injector) {
        super(injector, AnalyticsConfig.pages.settingsPage);

        this.ionic.eventsCtrl.subscribe(this.domain.eventService.UserProfileUpdated, () => {
            this.initializePage();
        });
    }

    ionViewDidEnter() {
        super.ionViewDidEnter();
        this.initializePage();
    }

    // Method that obtains the profile details of the user
    private initializePage(): void {
        this.helpers.showLoadingMessage().then(() => {
            this.domain.userService.getUserProfileDetails()
                .subscribe((result: any) => {
                    this.userProfile = result;
                    this.checkSubscriptionStatus();
                    this.helpers.hideLoadingMessage().then(() => {
                        this.applyPageAnimations();
                    })
                }, error => {
                    this.helpers.hideLoadingMessage().then(() => {
                        let errorMessage = this.helpers.getErrorMessage(error);
                        this.helpers.showBasicAlertMessage('ERROR', errorMessage);
                    });
                });
        });
    }

    // Method that obtains the days left until the end of the subscription and check
    // if the subscriptions is expired or not
    private checkSubscriptionStatus(): void {
        let expiration = moment.utc(this.userProfile.subscriptionEndDateUtc),
            today = moment.utc(),
            expirationDate = moment({
                year: expiration.year(),
                month: expiration.month(),
                day: expiration.date()
            }),
            todaysDate = moment({
                year: today.year(),
                month: today.month(),
                day: today.date()
            });
        this.subscriptionDaysLeft = expirationDate.diff(todaysDate, 'days');
        this.isSubscriptionExprired = this.subscriptionDaysLeft < 0;
    }

    // Method that updates the subscription of the user
    public updateSubscription(): void {
        //this.helpers.redirectTo(SubscriptionListPage);
    }

    // Method that shows the edit profile page
    public editProfile(): void {
        this.helpers.redirectTo(EditProfilePage);
    }

    // Method that logs the user out 
    public logout(): void {
        let confirmCallback = () => {
            setTimeout(() => {
                let category = AnalyticsConfig.categories.account, event = AnalyticsConfig.events.account.logout;
                this.helpers.trackEvent(category, event).then(() => {
                    this.domain.accountService.logOut();
                });
            }, 500);
        }, cancelCallback = () => {
            setTimeout(() => { this.helpers.hideAlertMessage(); }, 500);
        }, message = this.domain.translateService.instant('LOG_OUT_CONFIRMATION');

        this.helpers.showAlertMessageWithCallbacks('LOG_OUT', message, [{ buttonText: 'CANCEL', callback: cancelCallback }, { buttonText: 'OK', callback: confirmCallback }]);

    }

    private applyPageAnimations(): void {
        this.firstNameFieldState = 'active';
        this.lastNameFieldState = 'active';
        this.phoneNumberFieldState = 'active';
        this.emailFieldState = 'active';
        this.subscriptionFieldState = 'active';
        this.signOutButtonState = 'active';
        this.editProfileButtonState = 'active';
    }
}