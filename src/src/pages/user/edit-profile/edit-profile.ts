// Angular
import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// RxJS
import { Observable } from 'rxjs/Observable';

// Models
import { EditUserProfileViewModel, PhoneNumberViewModel } from '../../../providers/user-service';
import { UserProfileViewModel, ChangePasswordModel } from '../../../providers/user-service';
import { CountryInfoViewModel } from '../../../providers/country-service';

// Pages
import { UserBasePage } from '../../../core/pages/user-base';

// Utils
import { CustomDropdown } from '../../../utils/custom-dropdown/custom-dropdown.component';
import { ValidationHelper } from '../../../utils/validation/validation.helper';

// Animations
import { FadeInUp, FadeInRight, FadeIn } from '../../../utils/animations';

// Analytics config
import { AnalyticsConfig } from '../../../providers/analytics-service';

@Component({
    selector: 'page-edit-profile',
    templateUrl: 'edit-profile.html',
    animations: [
        FadeIn('firstNameFieldFadeIn', '300ms linear'),
        FadeIn('lastNameFieldFadeIn', '300ms 300ms linear'),
        FadeIn('emailFieldFadeIn', '300ms 600ms linear'),
        FadeIn('countryFieldFadeIn', '300ms 900ms linear'),
        FadeIn('phoneCodeFieldFadeIn', '300ms 1200ms linear'),
        FadeIn('phoneNumberFieldFadeIn', '300ms 1500ms linear'),
        FadeInUp('updateProfileButtonFadeInUp', '300ms 1800ms linear'),
        FadeInRight('passwordTabFadeInRight', '300ms 2100ms linear'),
    ]
})
export class EditProfilePage extends UserBasePage {

    public selectedTab: string = 'personalDetailsTab';

    // Animation states
    public firstNameFieldState: string = 'inactive';
    public lastNameFieldState: string = 'inactive';
    public emailFieldState: string = 'inactive';
    public countryFieldState: string = 'inactive';
    public phoneCodeFieldState: string = 'inactive';
    public phoneNumberFieldState: string = 'inactive';
    public updateProfileButtonState: string = 'inactive';

    // Profile form related properties
    private profileModel: UserProfileViewModel;
    public profileForm: FormGroup;
    public profileFormSubmitAttempt: boolean;
    public hasChanged: boolean;

    // Change password form related properties
    public changePasswordForm: FormGroup;
    public changePasswordSubmitAttempt: boolean;

    // Country properties
    public selectedCountry: CountryInfoViewModel;
    public countryList: Array<CountryInfoViewModel>;

    constructor(public injector: Injector, 
                public formBuilder: FormBuilder) {
        super(injector, AnalyticsConfig.pages.editProfilePage);

        // Creates the form without data
        this.initializeForms();

        this.helpers.showLoadingMessage().then(() => {
            Observable.forkJoin([
                this.domain.countryService.getCountries(),
                this.domain.userService.getUserProfileDetails()
            ]).subscribe((results: [Array<CountryInfoViewModel>, UserProfileViewModel]) => {
                this.countryList = results[0];
                this.profileModel = results[1];

                // Set the selected country
                let userAreaCode = this.profileModel.phoneNumber.split(' ')[0];
                this.selectedCountry = this.countryList.find(country => country.phoneCountryCode === userAreaCode);

                // Initialize the form with the user profile data
                this.initializeForms(this.profileModel);

                this.profileForm.valueChanges
                    .debounceTime(500)
                    .subscribe(formValues => {
                        this.hasChanged = (<string>formValues.firstName).trim() !== this.profileModel.firstName.trim()
                            || (<string>formValues.lastName).trim() !== this.profileModel.lastName.trim()
                            || (<string>formValues.email).trim() !== this.profileModel.email.trim()
                            || (<string>formValues.phoneNumber).trim() !== this.profileModel.phoneNumber.split(' ')[1].trim()
                            || (<string>formValues.phoneCountryCode).trim() !== this.profileModel.phoneNumber.split(' ')[0].trim();
                    });

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
    private initializeForms(profileModel?: UserProfileViewModel): void {
        this.profileFormSubmitAttempt = false;
        this.changePasswordSubmitAttempt = false;

        let firstName = profileModel ? profileModel.firstName : '',
            lastName = profileModel ? profileModel.lastName : '',
            email = profileModel ? profileModel.email : '',
            phoneNumber = profileModel ? profileModel.phoneNumber.split(' ')[1] : '',
            countryName = this.selectedCountry ? this.selectedCountry.name : '',
            phoneCountryCode = this.selectedCountry ? this.selectedCountry.phoneCountryCode : this.domain.config.defaultCountryAreaCode;

        this.profileForm = this.formBuilder.group({
            firstName: [firstName, [Validators.required, Validators.maxLength(30)]],
            lastName: [lastName, [Validators.required, Validators.maxLength(30)]],
            email: [email, [Validators.required, ValidationHelper.emailValidator]],
            phoneCountryCode: [phoneCountryCode, [Validators.required, ValidationHelper.phoneCountryCodeValidator]],
            phoneNumber: [phoneNumber, [Validators.required, ValidationHelper.phoneNumberValidator]],
            countryName: [countryName, [Validators.required, Validators.maxLength(30)]]
        });

        this.changePasswordForm = this.formBuilder.group({
            currentPassword: ['', [Validators.required, Validators.maxLength(30)]],
            password: ['', [Validators.required, ValidationHelper.passwordValidator]],
            confirmPassword: ['']
        }, {
                // The matching password validation is related to the entire form, 
                // and not with just a single field
                validator: ValidationHelper.matchingPasswordsValidator
            });
    }

    // Method that creates the profileModel with the information of the profile form
    private getProfileModelFromForm(): EditUserProfileViewModel {
        let profileModel = new EditUserProfileViewModel();

        profileModel.firstName = this.profileForm.get('firstName').value;
        profileModel.lastName = this.profileForm.get('lastName').value;
        profileModel.email = this.profileForm.get('email').value;

        profileModel.phoneNumberViewModel = new PhoneNumberViewModel();
        profileModel.phoneNumberViewModel.phoneCountryCode = this.profileForm.get('phoneCountryCode').value;
        profileModel.phoneNumberViewModel.phoneLocalNumber = this.profileForm.get('phoneNumber').value;

        return profileModel;
    }

    // Method that creates the ChangePasswordModel with the information of the password form
    private getChangePasswordModelFromForm(): ChangePasswordModel {
        let changePasswordModel = new ChangePasswordModel();

        changePasswordModel.oldPassword = this.changePasswordForm.get('currentPassword').value;
        changePasswordModel.newPassword = this.changePasswordForm.get('password').value;
        changePasswordModel.confirmPassword = this.changePasswordForm.get('confirmPassword').value;

        return changePasswordModel;
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
                this.profileForm.get('phoneCountryCode').setValue(selectedCountry.phoneCountryCode);
                this.profileForm.get('countryName').setValue(selectedCountry.name);
            }
        });
        countryDropdown.present();
    }

    // Method that saves the changes made in the form
    public saveProfileChanges(): void {
        this.profileFormSubmitAttempt = true;
        if (this.profileForm.valid) {
            this.helpers.showLoadingMessage().then(() => {
                let profileModel = this.getProfileModelFromForm();
                this.domain.userService.updateProfile(profileModel).subscribe(() => {
                    this.helpers.hideLoadingMessage().then(() => {
                        this.hasChanged = this.profileFormSubmitAttempt = false;
                        this.ionic.navCtrl.pop().then(() => {
                            // Publish the event to update the Settings Page
                            this.ionic.eventsCtrl.publish(this.domain.eventService.UserProfileUpdated);
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

    // Method that saves the changes made in the form
    public savePasswordChanges(): void {
        this.changePasswordSubmitAttempt = true;
        if (this.changePasswordForm.valid) {
            this.helpers.showLoadingMessage().then(() => {
                let changePasswordModel = this.getChangePasswordModelFromForm();
                this.domain.userService.changePassword(changePasswordModel).subscribe(() => {
                    this.helpers.hideLoadingMessage().then(() => {
                        this.resetPasswordForm();
                        let message = this.domain.translateService.instant('EDIT_PROFILE_PAGE.SUCCESS_MESSAGE');
                        this.helpers.showToastMessage(message, true);
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

    // Method that initialize the changePassword form with empty data
    private resetPasswordForm(): void {
        this.changePasswordForm = this.formBuilder.group({
            currentPassword: ['', [Validators.required, Validators.maxLength(30)]],
            password: ['', [Validators.required, ValidationHelper.passwordValidator]],
            confirmPassword: ['']
        }, {
                // The matching password validation is related to the entire form, 
                // and not with just a single field
                validator: ValidationHelper.matchingPasswordsValidator
            });
        this.changePasswordSubmitAttempt = false;
    }

    private applyPageAnimations(): void {
        this.firstNameFieldState = 'active';
        this.lastNameFieldState = 'active';
        this.phoneNumberFieldState = 'active';
        this.emailFieldState = 'active';
        this.phoneCodeFieldState = 'active';
        this.countryFieldState = 'active';
        this.updateProfileButtonState = 'active';
    }
}