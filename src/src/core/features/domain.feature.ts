// Angular
import { Injector } from '@angular/core';

// Services
import { EventService } from "../../providers/event-service";
import { AccountService } from '../../providers/account-service';
import { SubscriptionService } from '../../providers/subscription-service';
import { CountryService } from '../../providers/country-service';
import { RiderService } from '../../providers/rider-service';
import { HorseService } from '../../providers/horse-service';
import { CompetitionService } from '../../providers/competition-service';
import { VideoService } from '../../providers/video-service';
import { UserService } from '../../providers/user-service';
import { AnalyticsService } from '../../providers/analytics-service';

// Ng2 Translate
import { TranslateService } from 'ng2-translate';

// Config
import { TOKEN_CONFIG, AppConfig } from '../../app/app.config';

export class DomainFeature {

    private _eventService: EventService;
    private _accountService: AccountService;
    private _subscriptionService: SubscriptionService;
    private _countryService: CountryService;
    private _riderService: RiderService;
    private _horseService: HorseService;
    private _competitionService: CompetitionService;
    private _videoService: VideoService;
    private _userService: UserService;
    private _analyticsService: AnalyticsService;
    private _translateService: TranslateService;
    private _config: AppConfig;

    constructor(private _injector: Injector) { }

    // Config object
    public get config(): AppConfig {
        if (!this._config) {
            this._config = this._injector.get(TOKEN_CONFIG);
        }
        return this._config;
    }

    // TranslateService
    public get translateService(): TranslateService {
        if (!this._translateService) {
            this._translateService = this._injector.get(TranslateService);
        }
        return this._translateService;
    }

    // EventService
    public get eventService(): EventService {
        if (!this._eventService) {
            this._eventService = this._injector.get(EventService);
        }
        return this._eventService;
    }

    // AccountService
    public get accountService(): AccountService {
        if (!this._accountService) {
            this._accountService = this._injector.get(AccountService);
        }
        return this._accountService;
    }

    // SubscriptionService
    public get subscriptionService(): SubscriptionService {
        if (!this._subscriptionService) {
            this._subscriptionService = this._injector.get(SubscriptionService);
        }
        return this._subscriptionService;
    }

    // CountryService
    public get countryService(): CountryService {
        if (!this._countryService) {
            this._countryService = this._injector.get(CountryService);
        }
        return this._countryService;
    }

    // RiderService
    public get riderService(): RiderService {
        if (!this._riderService) {
            this._riderService = this._injector.get(RiderService);
        }
        return this._riderService;
    }

    // HorseService
    public get horseService(): HorseService {
        if (!this._horseService) {
            this._horseService = this._injector.get(HorseService);
        }
        return this._horseService;
    }

    // CompetitionService
    public get competitionService(): CompetitionService {
        if (!this._competitionService) {
            this._competitionService = this._injector.get(CompetitionService);
        }
        return this._competitionService;
    }

    // VideoService
    public get videoService(): VideoService {
        if (!this._videoService) {
            this._videoService = this._injector.get(VideoService);
        }
        return this._videoService;
    }

    // UserService
    public get userService(): UserService {
        if (!this._userService) {
            this._userService = this._injector.get(UserService);
        }
        return this._userService;
    }

    // AnalyticsService
    public get analyticsService(): AnalyticsService {
        if (!this._analyticsService) {
            this._analyticsService = this._injector.get(AnalyticsService);
        }
        return this._analyticsService;
    }
}