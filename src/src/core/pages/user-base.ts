// Angular
import { Component, Injector } from '@angular/core';

// Pages
import { BasePage } from './base';

@Component({ selector: '', template: '' })
export class UserBasePage extends BasePage {

    constructor(public injector: Injector, 
                public pageName?: string) {
        super(injector, pageName);
    }

    ionViewDidEnter() {
        // Call ionViewDidenter from the BasePage
        super.ionViewDidEnter();
    }

    ionViewCanEnter() {
        // Check if the user is allowed to enter to the page
        return this.domain.accountService.isLoggedIn();
    }
}