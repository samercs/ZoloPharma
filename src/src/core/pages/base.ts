// Angular
import { Component, Injector } from '@angular/core';

// Core
import { DomainFeature } from '../features/domain.feature';
import { IonicFeature } from '../features/ionic.feature';
import { HelpersFeature } from '../features/helpers.feature';

@Component({ selector: '', template: '' })
export class BasePage {

    private _domain: DomainFeature;
    private _ionic: IonicFeature;
    private _helpers: HelpersFeature;

    constructor(public injector: Injector, 
                public pageName?: string) {
        this._domain = new DomainFeature(injector);
        this._ionic = new IonicFeature(injector);
        this._helpers = new HelpersFeature(this._ionic, this._domain);
    }

    ionViewDidEnter() {
        if (this.pageName) this.helpers.trackView(this.pageName);
    }

    // Allows the page to get access to all the domain features
    public get domain(): DomainFeature {
        return this._domain;
    }

    // Allows the page to get access to all the ionic controllers
    public get ionic(): IonicFeature {
        return this._ionic;
    }

    // Allows the page to get access to all the custom helpers
    public get helpers(): HelpersFeature {
        return this._helpers;
    }
}