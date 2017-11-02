// Angular references
import { Component, ViewChild, Inject } from '@angular/core';

// Ionic references
import { Nav, Platform, MenuController, ModalController, Events } from 'ionic-angular';

// Ionic Native references
import { Splashscreen, GoogleAnalytics } from 'ionic-native';

// Models and services
import { EventService } from '../providers/event-service';
import { LanguageService } from '../providers/language-service';
import { AccountService } from '../providers/account-service';
import { AnalyticsService } from '../providers/analytics-service';

// Pages
import { HomePage } from '../pages/account/home/home';
import { TabsContainerPage } from '../pages/tabs-container/tabs-container'

// Config object
import { TOKEN_CONFIG, AppConfig } from '../app/app.config';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) navCtrl: Nav;

	public rootPage;

	// Language properties
	public selectedLanguage: string;
	public changeLanguageText: string;
	public availableLanguages: Array<string>;

	constructor(public platform: Platform,
				private menuCtrl: MenuController,
				private modalCtrl: ModalController,
				private eventCtrl: Events,
				private accountService: AccountService,
				private eventService: EventService,
				private languageService: LanguageService,
				private analyticsService: AnalyticsService,
				@Inject(TOKEN_CONFIG) config: AppConfig) {
		this.availableLanguages = config.availableLanguages;
		this.initializeApp();
	}

	private initializeApp(): void {
		this.platform.ready().then(() => {
			Splashscreen.hide();

			// use Google analytics as the analytics provider
			this.analyticsService.initializeAnalytics(GoogleAnalytics).then(() => {
				this.initializeStartPageAndEvents();
			});
		});
	}

	// Method that initializes the language and account details, and subscribes
	// to the account and navigation related events
	private initializeStartPageAndEvents(): void {

		this.rootPage = HomePage;

		// Initialize the language
		this.initializeDefaultLanguage().then(() => {

			// Put in memory data that we keep in storage
			this.accountService.initializeAccountStatus().then((loggedIn) => {
				//this.rootPage = loggedIn ? TabsContainerPage : HomePage;
			});
		});
		this.initializeEvents();
	}

	// Method that initializes the default language
	private initializeDefaultLanguage(): Promise<any> {
		return this.languageService.initializeLanguage().then(language => {
			this.selectedLanguage = language;
			this.changeLanguageText = this.availableLanguages.filter((language) => language != this.selectedLanguage)[0];
			this.setProperAligment();
		});
	}

	// Method that subscribes to all the events in the app
	private initializeEvents(): void {

		// Handles what to do when the user logs in or logs out
		this.eventCtrl.subscribe(this.eventService.UserLoginStatusChanged, (isLoggedIn) => {
			// Redirect to home when logging out to prevent the user to stay in a page that requires to be logged in
			if (!isLoggedIn) {
				this.menuCtrl.close().then(() => {
					this.navCtrl.setRoot(HomePage);
				});
			}
		});

		// Handle what to do when the user needs to be redirected to any page of the app
		this.eventCtrl.subscribe(this.eventService.NavigationRedirectTo, (redirectionModel) => {
			this.handlePageRedirect(redirectionModel.page, redirectionModel.openAsRoot, redirectionModel.params);
		});
	}

	// Method that handles what to do when the user wants to open a page
	private handlePageRedirect(targetPage: any, openAsRoot?: boolean, params?: any): Promise<any> {
		if (openAsRoot) {
			// Try to set the page as the root page
			return this.navCtrl.setRoot(targetPage, params).catch(() => {
				this.navCtrl.setRoot(HomePage);
			});
		} else {
			// Try to add the page to the current navigation stack
			return this.navCtrl.push(targetPage, params).catch(() => {
				this.navCtrl.setRoot(HomePage);
			});
		}
	}

	// Method that changes the language
	public toggleLanguage(): void {
		let targetLanguage = this.availableLanguages.find(lang => lang !== this.selectedLanguage);
		this.menuCtrl.close().then(() => {
			this.handlePageRedirect(TabsContainerPage, true).then(() => {
				this.languageService.changeLanguage(targetLanguage).then(newLanguage => {
					this.selectedLanguage = newLanguage;
					this.deleteCachedData();
					this.setProperAligment();
				});
			});
		});
	}

	// Method that aligns the text to the left or right according the selected language
	private setProperAligment(): void {
		// Add a class with the language to the ion-app element to apply custom styles
		let appElement = document.getElementsByTagName('ion-app');
		if (appElement) {

			// Remove the previous language if any
			var regx = new RegExp('\\blang*[-]\\w*\\b', 'g');
			appElement[0].className = appElement[0].className.replace(regx, '');

			// Add the new language
			appElement[0].className += appElement[0].className ? ` lang-${this.selectedLanguage}` : `lang-${this.selectedLanguage}`;
		}
	}

	// Method that deletes the cached data when changing the language
	private deleteCachedData(): void {
		// TODO: add calls to the services that needs to be reset
	}
}
