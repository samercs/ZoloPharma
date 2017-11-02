// Angular
import { Component, Injector } from '@angular/core';

// Pages
import { UserBasePage } from '../../core/pages/user-base';
import { FavoritesPage } from '../user/favorites/favorites';
import { SettingsPage } from '../user/settings/settings';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../account/home/home';

@Component({
    selector: 'page-tabs-container',
    templateUrl: 'tabs-container.html'
})
export class TabsContainerPage extends UserBasePage {

    public tabSearch: any = HomePage;
    public tabResults: any = HomePage;
    public tabFavorites: any = FavoritesPage;
    public tabContact: any = ContactPage;
    public tabSettings: any = SettingsPage;

    constructor(public injector: Injector) {
        super(injector);
    }
}