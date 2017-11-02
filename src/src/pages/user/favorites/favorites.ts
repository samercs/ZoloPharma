// Angular
import { Component, Injector, ViewChild } from '@angular/core';

// Ionic
import { Content, ItemSliding } from 'ionic-angular';

// Pages
import { UserBasePage } from '../../../core/pages/user-base';

// Models
import { VideoViewModel } from '../../../providers/video-service';

// Animations
import { FadeIn } from '../../../utils/animations';

// Analytics config
import { AnalyticsConfig } from '../../../providers/analytics-service';

@Component({
    selector: 'page-favorites',
    templateUrl: 'favorites.html',
    animations: [
        FadeIn('favoritesFadeIn', '600ms linear')
    ]
})
export class FavoritesPage extends UserBasePage {
    @ViewChild(Content) content: Content;

    public videos: Array<VideoViewModel>;
    public favoritesState: string = 'inactive';

    constructor(public injector: Injector) {
        super(injector, AnalyticsConfig.pages.favoritesPage);
    }

    ionViewDidEnter() {
        super.ionViewDidEnter();
        this.videos = null;
        this.favoritesState = 'inactive';
        this.initializePage();
    }

    // Method that obtains the list of favorites videos from the user
    private initializePage(): void {
        this.helpers.showLoadingMessage().then(() => {
            this.domain.userService.getAllFavorites()
                .subscribe((results: any) => {
                    this.videos = results;
                    this.helpers.hideLoadingMessage().then(() => {
                        this.applyPageAnimations();
                    });
                }, error => {
                    this.helpers.hideLoadingMessage().then(() => {
                        let errorMessage = this.helpers.getErrorMessage(error);
                        this.helpers.showBasicAlertMessage('ERROR', errorMessage);
                    });
                });
        });
    }

    // Method that redirects the user to the video details page
    public openVideo(selectedVideo: VideoViewModel, item: ItemSliding): void {
        // Close the sliding item first
        item.close();

        //this.helpers.redirectTo(VideoDetailsPage, false, { video: selectedVideo });
    }

    // Method that deletes the video from the favorites
    public deleteFavorite(selectedVideo: VideoViewModel, item: ItemSliding): void {

        // Close the sliding item first
        item.close();

        let message = this.domain.translateService.instant('VIDEO_DETAILS_PAGE.FAVORITES_REMOVING');
        this.helpers.showToastMessage(message).then(() => {
            
            this.domain.userService.removeFromFavorites(selectedVideo.id).subscribe((result: string) => {
                let index = this.videos.indexOf(selectedVideo);
                if (index !== -1) { this.videos.splice(index, 1); }
                this.helpers.showToastMessage(result, true);
                
                let category = AnalyticsConfig.categories.videos, event = AnalyticsConfig.events.videos.removeFromFavorites;
                this.helpers.trackEvent(category, event, `${selectedVideo.rider.name} (${selectedVideo.horseName}) - ${selectedVideo.competition.name}`);
            }, error => {
                this.helpers.hideToastMessage().then(() => {
                    let errorMessage = this.helpers.getErrorMessage(error);
                    this.helpers.showBasicAlertMessage('ERROR', errorMessage);
                });
            });
        });
    }

    private applyPageAnimations(): void {
        this.favoritesState = 'active';
    }
}