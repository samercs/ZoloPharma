// Angular
import { Component, Injector } from '@angular/core';

// Ionic Native
import { StatusBar } from 'ionic-native';

// Pages
import { BasePage } from '../../../core/pages/base';
import { RegisterPage } from '../register/register';
import { LogInPage } from '../login/login';

// Animations
import { FadeInUp } from '../../../utils/animations';

// Analytics config
import { AnalyticsConfig } from '../../../providers/analytics-service';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
	animations: [
		FadeInUp('firstButtonFadeInUp', '500ms 500ms linear'),
		FadeInUp('secondButtonFadeInUp', '500ms 1000ms linear'),
	]
})
export class HomePage extends BasePage {

	private localVideElementId: string = 'local-video';

	// Animation states
	public firstButtonState: string = 'inactive';
	public secondButtonState: string = 'inactive';

	constructor(public injector: Injector) {
		super(injector, AnalyticsConfig.pages.homePage);
	}

	ionViewDidLoad() {
		this.ionic.platform.ready().then(() => {
			StatusBar.styleLightContent();
			window.setTimeout(() => {
				this.applyPageAnimations();
			}, 1000);
		});
	}

	// Method that loads the video
	private loadLocalVideo(): void {
		let video = <HTMLVideoElement>document.getElementById(this.localVideElementId);
		video.play();
		window.setTimeout(() => {
			video.style.visibility = 'visible';
			this.applyPageAnimations();
		}, 1000);
	}

	// Method that redirects the user to the register page
	public redirectToRegisterPage(): void {
		this.helpers.redirectTo(RegisterPage);
	}

	// Method that redirects the user to the login page
	public redirectToLoginPage(): void {
		this.helpers.redirectTo(LogInPage);
	}

	private applyPageAnimations(): void {
		this.firstButtonState = 'active';
		this.secondButtonState = 'active';
	}
}