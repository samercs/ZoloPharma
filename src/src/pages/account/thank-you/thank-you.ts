// Angular
import { Component, Injector } from '@angular/core';

// Pages
import { BasePage } from '../../../core/pages/base';
import { TabsContainerPage } from '../../tabs-container/tabs-container';

// Animations
import { FadeInUp, FadeIn } from '../../../utils/animations';

// Analytics config
import { AnalyticsConfig } from '../../../providers/analytics-service';

@Component({
    selector: 'page-thank-you',
    templateUrl: 'thank-you.html',
    animations: [
        FadeIn('titleFieldFadeIn', '300ms linear'),
        FadeIn('introTextFieldFadeIn', '300ms 300ms linear'),
        FadeInUp('redirectButtonFadeInUp', '300ms 600ms linear')
    ]
})
export class ThankYouPage extends BasePage {

    // Animation states
    public titleFieldState: string = 'inactive';
    public introTextFieldState: string = 'inactive';
    public redirectButtonState: string = 'inactive';

    constructor(public injector: Injector) {
        super(injector, AnalyticsConfig.pages.thankYouPage);
    }

    ionViewDidEnter() {
        super.ionViewDidEnter();
        this.applyPageAnimations();
    }

    // Method that redirects the user to the home page
    public redirectToSearchPage(): void {
        this.helpers.redirectTo(TabsContainerPage, true);
    }

    private applyPageAnimations(): void {
        this.titleFieldState = 'active';
        this.introTextFieldState = 'active';
        this.redirectButtonState = 'active';
    }
}