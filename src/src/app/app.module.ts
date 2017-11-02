// Angular references
import { NgModule, ErrorHandler } from '@angular/core';
import { Http } from '@angular/http';

// Ionic references
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Ng2 Translate and LazyLoadImage references
import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate/ng2-translate';
import { LazyLoadImageModule } from 'ng2-lazyload-image';

// App
import { MyApp } from './app.component';

// Pages
import { BasePage } from '../core/pages/base';
import { UserBasePage } from '../core/pages/user-base';

import { TabsContainerPage } from '../pages/tabs-container/tabs-container';
import { ContactPage } from '../pages/contact/contact';

// Pages - Account
import { HomePage } from '../pages/account/home/home';
import { LogInPage } from '../pages/account/login/login';
import { RegisterPage } from '../pages/account/register/register';
import { PasswordResetPage } from '../pages/account/password-reset/password-reset';
import { ThankYouPage } from '../pages/account/thank-you/thank-you';

// Pages - User
import { FavoritesPage } from '../pages/user/favorites/favorites';
import { SettingsPage } from '../pages/user/settings/settings';
import { EditProfilePage } from '../pages/user/edit-profile/edit-profile';


// Services
import { HttpClientService } from '../providers/http-client-service';
import { AccountService } from '../providers/account-service';
import { EventService } from '../providers/event-service';
import { LanguageService } from '../providers/language-service';
import { CountryService } from '../providers/country-service';
import { SubscriptionService } from '../providers/subscription-service';
import { RiderService } from '../providers/rider-service';
import { HorseService } from '../providers/horse-service';
import { CompetitionService } from '../providers/competition-service';
import { VideoService } from '../providers/video-service';
import { UserService } from '../providers/user-service';
import { AnalyticsService } from '../providers/analytics-service';

// Pipes
import { FormatCurrencyPipe } from '../pipes/format-currency';
import { FormatQuantityPipe } from '../pipes/format-quantity';
import { PadWithZerosPipe } from '../pipes/pad-with-zeros';

// Utils
import { MultiLevelSideMenuComponent } from '../utils/multi-level-side-menu/multi-level-side-menu.component';
import { CustomDropdown } from '../utils/custom-dropdown/custom-dropdown.component';

// Config object
import { TOKEN_CONFIG, APP_CONFIG } from '../app/app.config';

// Custom modules
import { ValidationModule } from '../utils/validation/validation.module';

// Ng2 Translate Loader
export function createTranslateLoader(http: Http) {
	return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

@NgModule({
	declarations: [
		MyApp,
		BasePage,
		UserBasePage,
		TabsContainerPage,
		HomePage,
		LogInPage,
		RegisterPage,
		
		ThankYouPage,
		PasswordResetPage,		
		FavoritesPage,		
		ContactPage,
		SettingsPage,
		EditProfilePage,

		// Pipes
        FormatCurrencyPipe,
        FormatQuantityPipe,
        PadWithZerosPipe,

		// Utils
		MultiLevelSideMenuComponent,
		CustomDropdown
	],
	imports: [
		TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        }),
		ValidationModule,
		LazyLoadImageModule,
		IonicModule.forRoot(MyApp, {
			// Just show the back arrow on ios
			// backButtonText: '',
			// backButtonIcon: 'ios-arrow-back',

			// Prevent jumping on readonly inputs
            scrollAssist: false,
            autoFocusAssist: false
		})
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,

		// Pages
		BasePage,
		UserBasePage,
		TabsContainerPage,
		HomePage,
		LogInPage,
		RegisterPage,		
		ThankYouPage,
		PasswordResetPage,		
		FavoritesPage,		
		ContactPage,
		SettingsPage,
		EditProfilePage,

		// Utils
		CustomDropdown
	],
	providers: [
		Storage,
		LanguageService,
		HttpClientService,
		AccountService,
		EventService,
		CountryService,
		SubscriptionService,
		RiderService,
		HorseService,
		VideoService,
		CompetitionService,
		UserService,
		AnalyticsService,
		{ provide: TOKEN_CONFIG, useValue: APP_CONFIG },
		{ provide: ErrorHandler, useClass: IonicErrorHandler }
	]
})
export class AppModule { }
