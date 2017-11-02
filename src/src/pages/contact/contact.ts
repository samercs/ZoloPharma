// Angular
import { Component, Injector } from '@angular/core';

// Pages
import { UserBasePage } from '../../core/pages/user-base';

// Animations
import { FadeIn, FadeInDown, FadeInUp } from '../../utils/animations';

// Analytics config
import { AnalyticsConfig } from '../../providers/analytics-service';

@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html',
    animations: [
        FadeIn('backgroundImageFadeIn', '1000ms linear'),
        FadeInDown('mainTitleFadeInDown', '500ms 500ms linear'),
        FadeIn('emailSocialFadeIn', '300ms 1000ms linear'),
        FadeIn('phoneSocialFadeIn', '300ms 1300ms linear'),
        FadeIn('facebookSocialFadeIn', '300ms 1600ms linear'),
        FadeIn('instagramSocialFadeIn', '300ms 1900ms linear'),
        FadeInUp('subscriptionsButtonFadeInUp', '300ms 2100ms linear')
    ]
})
export class ContactPage extends UserBasePage {

    // Animation states
    public backgroundImageState: string = 'inactive';
    public mainTitleState: string = 'inactive';
    public emailSocialState: string = 'inactive';
    public phoneSocialState: string = 'inactive';
    public facebookSocialState: string = 'inactive';
    public instagramSocialState: string = 'inactive';
    public subscriptionsButtonState: string = 'inactive';

    constructor(public injector: Injector) {
        super(injector, AnalyticsConfig.pages.contactPage);
    }

    ionViewDidEnter(): void {
        super.ionViewDidEnter();
        this.applyPageAnimations();
    }

    // Method that shows the subscriptions details page
    public showSubscriptionsDetails(): void {
        //this.helpers.redirectTo(SubscriptionListPage);
    }

    private applyPageAnimations(): void {
        this.backgroundImageState = 'active';
        this.mainTitleState = 'active';
        this.emailSocialState = 'active';
        this.phoneSocialState = 'active';
        this.facebookSocialState = 'active';
        this.instagramSocialState = 'active';
        this.subscriptionsButtonState = 'active';
    }
}