// Angular
import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Models and services
import { RegisterViewModel, PhoneNumberViewModel } from '../../../providers/account-service';
import { ValidationHelper } from '../../../utils/validation/validation.helper';
import { CountryInfoViewModel } from '../../../providers/country-service';

// Pages
import { BasePage } from '../../../core/pages/base';
import { ThankYouPage } from '../thank-you/thank-you';

// Utils
import { CustomDropdown } from '../../../utils/custom-dropdown/custom-dropdown.component';

// Animations
import { FadeInUp, FadeIn } from '../../../utils/animations';

// Analytics config
import { AnalyticsConfig } from '../../../providers/analytics-service';

@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
    animations: [
        FadeIn('firstNameFieldFadeIn', '300ms linear'),
        FadeIn('lastNameFieldFadeIn', '300ms 300ms linear'),
        FadeIn('emailFieldFadeIn', '300ms 600ms linear'),
        FadeIn('countryFieldFadeIn', '300ms 900ms linear'),
        FadeIn('phoneCodeFieldFadeIn', '300ms 1200ms linear'),
        FadeIn('phoneNumberFieldFadeIn', '300ms 1500ms linear'),
        FadeIn('passwordFieldFadeIn', '300ms 1800ms linear'),
        FadeIn('confirmPasswordFieldFadeIn', '300ms 2100ms linear'),
        FadeInUp('registerButonFadeInUp', '300ms 2400ms linear')
    ]
})
export class RegisterPage extends BasePage {

    public registerForm: FormGroup;
    public submitAttempt: boolean;
    public model: RegisterViewModel;

    // Country properties
    public selectedCountry: CountryInfoViewModel;
    public countryList: Array<CountryInfoViewModel>;

    // Animation states
    public firstNameFieldState: string = 'inactive';
    public lastNameFieldState: string = 'inactive';
    public emailFieldState: string = 'inactive';
    public countryFieldState: string = 'inactive';
    public phoneCodeFieldState: string = 'inactive';
    public phoneNumberFieldState: string = 'inactive';
    public passwordFieldState: string = 'inactive';
    public confirmPasswordFieldState: string = 'inactive';
    public registerButonState: string = 'inactive';

    constructor(public injector: Injector, 
                public formBuilder: FormBuilder) {
        super(injector, AnalyticsConfig.pages.registerPage);

        // Creates the form without data
        this.createEmptyForm();

        this.helpers.showLoadingMessage().then(() => {
            // Get the list of countries
            this.domain.countryService.getCountries()
                .subscribe(list => {
                    this.countryList = list;

                    // Set the default country
                    this.selectedCountry = this.countryList.find(country => country.isoCode.toLowerCase() === this.domain.config.defaultCountryCode);
                    this.registerForm.get('countryName').setValue(this.selectedCountry.name);

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

    // Method that initializes the form
    private createEmptyForm(): void {
        this.model = new RegisterViewModel();
        this.submitAttempt = false;

        this.registerForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.maxLength(30)]],
            lastName: ['', [Validators.required, Validators.maxLength(30)]],
            email: ['', [Validators.required, ValidationHelper.emailValidator]],
            phoneCountryCode: [this.domain.config.defaultCountryAreaCode, [Validators.required, ValidationHelper.phoneCountryCodeValidator]],
            phoneNumber: ['', [Validators.required, ValidationHelper.phoneNumberValidator]],
            countryName: ['', [Validators.required, Validators.maxLength(30)]],
            password: ['', [Validators.required, ValidationHelper.passwordValidator]],
            confirmPassword: ['']
        }, {
                // The matching password validation is related to the entire form, 
                // and not with just a single field
                validator: ValidationHelper.matchingPasswordsValidator
            });
    }

    // Method that creates the model with the information of the form
    private getModelFromForm(): RegisterViewModel {
        let model = new RegisterViewModel();

        model.firstName = this.registerForm.get('firstName').value;
        model.lastName = this.registerForm.get('lastName').value;
        model.email = this.registerForm.get('email').value;
        model.password = this.registerForm.get('password').value;
        model.confirmPassword = this.registerForm.get('confirmPassword').value;

        model.phoneNumberViewModel = new PhoneNumberViewModel();

        model.phoneNumberViewModel.phoneCountryCode = this.registerForm.get('phoneCountryCode').value;
        model.phoneNumberViewModel.phoneLocalNumber = this.registerForm.get('phoneNumber').value;

        return model;
    }

    // Method that opens the custom dropdown component with the list of countries
    public showCountriesDropdown() {
        let title = this.domain.translateService.instant('CUSTOM_DROPDOWN.SELECT_COUNTRY'),
            placeholder = this.domain.translateService.instant('CUSTOM_DROPDOWN.ENTER_COUNTRY_NAME'),
            itemsName = this.domain.translateService.instant('CUSTOM_DROPDOWN.COUNTRY_NAME');


        let options = this.countryList.map((country) => {
            return { key: country.isoCode, value: country.name };
        }), countryDropdown = this.ionic.modalCtrl.create(CustomDropdown,
            {
                title: title,
                placeholder: placeholder,
                showIcons: true,
                itemsName: itemsName,
                options: options
            });

        countryDropdown.onDidDismiss(selectedOption => {
            if (selectedOption) {
                let selectedCountry = this.countryList.find(country => country.isoCode.toLowerCase() === selectedOption.key.toLowerCase());
                this.selectedCountry = selectedCountry;
                this.registerForm.get('countryName').setValue(selectedCountry.name);
                this.registerForm.get('phoneCountryCode').setValue(selectedCountry.phoneCountryCode);
            }
        });
        countryDropdown.present();
    }

    // Method that sends the user information to the server
    public register(): void {
        this.submitAttempt = true;
        if (this.registerForm.valid) {
            this.helpers.showLoadingMessage().then(() => {
                this.model = this.getModelFromForm();
                this.domain.accountService.register(this.model).subscribe(() => {
                    this.helpers.hideLoadingMessage().then(() => {
                        let category = AnalyticsConfig.categories.account, event = AnalyticsConfig.events.account.register;
                        this.helpers.trackEvent(category, event).then(() => {
                            this.helpers.redirectTo(ThankYouPage, true);
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

    private applyPageAnimations(): void {
        this.firstNameFieldState = 'active';
        this.lastNameFieldState = 'active';
        this.emailFieldState = 'active';
        this.countryFieldState = 'active';
        this.phoneCodeFieldState = 'active';
        this.phoneNumberFieldState = 'active';
        this.passwordFieldState = 'active';
        this.confirmPasswordFieldState = 'active';
        this.registerButonState = 'active';
    }
}