// Angular
import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Models and services
import { PasswordResetViewModel } from '../../../providers/account-service';
import { ValidationHelper } from '../../../utils/validation/validation.helper';

// Pages
import { BasePage } from '../../../core/pages/base';

// Animations
import { FadeInUp, FadeIn } from '../../../utils/animations';

// Analytics config
import { AnalyticsConfig } from '../../../providers/analytics-service';

@Component({
    selector: 'page-password-reset',
    templateUrl: 'password-reset.html',
    animations: [
        FadeIn('introTextFadeIn', '300ms linear'),
        FadeIn('emailFieldFadeIn', '300ms 300ms linear'),
        FadeInUp('sendPasswordButtonFadeIn', '300ms 600ms linear')
    ]
})
export class PasswordResetPage extends BasePage {

    public needPasswordForm: FormGroup;
    public submitAttempt: boolean;
    public model: PasswordResetViewModel;

    // Animation states
    public introTextState: string = 'inactive';
    public emailFieldState: string = 'inactive';
    public sendPasswordButtonState: string = 'inactive';

    constructor(public injector: Injector,
                private formBuilder: FormBuilder) {
        super(injector, AnalyticsConfig.pages.passwordResetPage);
        this.initializeForm();
    }

    ionViewDidEnter() {
        super.ionViewDidEnter();
        this.applyPageAnimations();
    }

    // Method that initializes the form
    private initializeForm(): void {
        this.model = new PasswordResetViewModel();
        this.submitAttempt = false;

        this.needPasswordForm = this.formBuilder.group({
            email: ['', [Validators.required, ValidationHelper.emailValidator]]
        });
    }

    // Method that redirects the user to the previous page
    public goBack(): void {
        this.ionic.navCtrl.pop();
    }

    // Method that sends the email to the server
    public sendInstructions(): void {
        this.submitAttempt = true;

        if (this.needPasswordForm.valid) {
            this.helpers.showLoadingMessage().then(() => {

                // Initialize the model with the information from the form
                this.model.email = this.needPasswordForm.get('email').value;

                this.domain.accountService.resetPassword(this.model).subscribe((result: any) => {
                    this.helpers.hideLoadingMessage().then(() => {
                        let category = AnalyticsConfig.categories.account, event = AnalyticsConfig.events.account.passwordReset;
                        this.helpers.trackEvent(category, event).then(() => {
                            // Show a message to the user
                            let message = result ? result.message : this.domain.translateService.instant('PASSWORD_RESET_PAGE.RESULT');
                            this.showSuccessMessage(message);
                        });
                    });
                }, (error) => {
                    this.helpers.hideLoadingMessage().then(() => {
                        let errorMessage = this.helpers.getErrorMessage(error);
                        this.helpers.showBasicAlertMessage('ERROR', errorMessage);
                    });
                });

            });

        }
    }

    // Method that shows the result to the user and then goes to the previous page
    private showSuccessMessage(result): void {
        let callback = () => {
            this.helpers.hideAlertMessage().then(() => {
                this.goBack();
            });
        },
            buttonText = this.domain.translateService.instant('OK');
        this.helpers.showAlertMessageWithCallbacks('SUCCESS', result, [{ buttonText: buttonText, callback: callback }]);
    }

    private applyPageAnimations(): void {
        this.emailFieldState = 'active';
        this.introTextState = 'active';
        this.sendPasswordButtonState = 'active';
    }
}
