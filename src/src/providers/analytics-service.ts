// Angular references
import { Injectable } from '@angular/core';

// Ionic references
import { Platform } from 'ionic-angular';

export const AnalyticsConfig = {

    // PROD
    trackerId: 'UA-93829316-1',

    // DEV
    // trackerId: 'UA-93997005-1',

    pages: {
        // Account pages
        homePage: 'HomePage',
        loginPage: 'LoginPage',
        registerPage: 'RegisterPage',
        passwordResetPage: 'PasswordResetPage',
        thankYouPage: 'ThankYouPage',

        // Competitions pages
        startListAndResultsPage: 'StartListAndResultsPage',

        // Subscription
        subscriptionListPage: 'SubscriptionListPage',
        
        // Contact
        contactPage: 'ContactPage',

        // User
        editProfilePage: 'EditProfilePage',
        favoritesPage: 'FavoritesPage',
        settingsPage: 'SettingsPage',

        // Videos
        searchPage: 'SearchPage'
    },

    categories: {
        account: 'Account',
        competitions: 'Competitions',
        videos: 'Videos'
    },

    events: {
        account: {
            login: 'Login',
            logout: 'Logout',
            register: 'Register',
            passwordReset: 'PasswordReset'
        },
        competitions: {
            details: 'Details',
            startList: 'StartList',
            results: 'Results'
        },
        videos: {
            openDetails: 'OpenDetails',
            playVideo: 'PlayVideo',
            addToFavorites: 'AddedToFavorites',
            removeFromFavorites: 'RemovedFromFavorites',
            searchByRider: 'SearchByRider',
            searchByHorse: 'SearchByHorse',
            searchByCompetition: 'SearchByCompetition'
        }
    }
}

// Contract that every Analytics Provider must satisfy
interface AnalyticsProvider {
    startTrackerWithId(trackerId: string): Promise<any>;
    trackView(page: string): Promise<any>;
    trackEvent(category: string, name: string, label?: string): Promise<any>;
}

// Mock to be used when running the app in the browser
export class AnalyticsMockProvider implements AnalyticsProvider {
    public startTrackerWithId(trackerId: string): Promise<any> {
        return Promise.resolve(true);
    }
    public trackView(pageName: string): Promise<any> {
        console.log(`[Analytics_View]: ${pageName}`);
        return Promise.resolve(true);
    }
    public trackEvent(category: string, name: string, label?: string): Promise<any> {
        console.log(`[Analytics_Event]: ${category}/${name} ${label || ''}`);
        return Promise.resolve(true);
    }
}

@Injectable()
export class AnalyticsService {

    private enableTracking: boolean = false;
    private analyticsProvider: AnalyticsProvider;

    constructor(private platform: Platform) { }

    // Method that initializes the Analytics provider
    public initializeAnalytics(provider: AnalyticsProvider): Promise<any> {
        
        this.platform.is('cordova')
            ? this.analyticsProvider = provider
            : this.analyticsProvider = new AnalyticsMockProvider();

        if (this.enableTracking) {
            try { return this.analyticsProvider.startTrackerWithId(AnalyticsConfig.trackerId); }
            catch (error) {
                // Avoid breaking the app if the Analytics provider throws an exception
                console.log(`Error starting Analytics: ${error}`);
                return Promise.resolve(true);
            }
        }
        return Promise.resolve(true);
    }

    // Method that tracks the view using the Analytics provider
    public trackView(pageName: string): Promise<any> {
        if (this.enableTracking) {
            try { return this.analyticsProvider.trackView(pageName); }
            catch (error) {
                // Avoid breaking the app if the Analytics provider throws an exception
                console.log('Error tracking view with Analytics', error);
                return Promise.resolve(true);
            }
        }
        return Promise.resolve(true);
    }

    // Method that tracks the event using the Analytics provider
    public trackEvent(category: string, name: string, label?: string): Promise<any> {
        if (this.enableTracking) {
            try { return this.analyticsProvider.trackEvent(category, name, label || ''); }
            catch (error) {
                // Avoid breaking the app if the Analytics provider throws an exception
                console.log('Error tracking event with Analytics', error);
                return Promise.resolve(true);
            }
        }
        return Promise.resolve(true);
    }
}