// Angular references
import { Injectable } from '@angular/core';

@Injectable()
export class EventService {

	// UserLoginStatusChanged: the user has logged in or out
    public UserLoginStatusChanged: string = 'user:loginStatusChanged';

    // SideMenuOpened: the side menu was opened
    // Ugly fix for Ionic2 issue: https://github.com/driftyco/ionic/issues/9518
    public SideMenuOpened: string = 'menu:Opened';

    // NavigationRedirectTo: event used in the BasePage component to handle the navigation
    // from the entire app in the AppComponent code.
    public NavigationRedirectTo: string = 'navigation:redirectTo';

    // UserProfileUpdated: event used to update the user information in the settings page
    // when the user updates its profile information
    public UserProfileUpdated: string = 'profile:updated'
    
}