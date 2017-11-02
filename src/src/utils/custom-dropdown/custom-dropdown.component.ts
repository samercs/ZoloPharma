// Angular references
import { Component, ViewChild } from '@angular/core';

// Ionic Native references
import { Keyboard } from 'ionic-native';

// Ionic references
import { ViewController, NavParams, InfiniteScroll } from 'ionic-angular';

// MomentsJS references
import * as moment from 'moment';

@Component({
    selector: 'custom-dropdown',
    templateUrl: 'custom-dropdown.component.html'
})
export class CustomDropdown {
    @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

    public title: string;
    public placeholder: string;
    public itemsName: string;
    public showIcons: boolean;

    public alreadySorted: boolean;

    private pageSize: number = 20;
    
    public options: Array<any>;
    public visibleOptions: Array<any>;

    public selectedOption: any;

    constructor(private viewCtrl: ViewController, private paramsCtrl: NavParams) {
        this.title = this.paramsCtrl.get('title');
        this.placeholder = this.paramsCtrl.get('placeholder');
        this.showIcons = this.paramsCtrl.get('showIcons');
        this.itemsName = this.paramsCtrl.get('itemsName');
        this.alreadySorted = this.paramsCtrl.get('alreadySorted');

        this.resetOptions();
        this.visibleOptions = this.options.splice(0, this.pageSize);
    }

    // Method that closes the modal and returns the selected value
    public exit(): void {
        // Close the keyboard if open.
        Keyboard.close();

        this.viewCtrl.dismiss(this.selectedOption);
    }

    // Method that resets the available options
    private resetOptions(): void {
        this.selectedOption = null;
        this.options = this.paramsCtrl.get('options').slice() || [];
        if(!this.alreadySorted) {
            this.options = this.options.sort(this.sortByValueAsc);
        }
    }

    // Method that returns the selected option
    public selectOption(option: any) {
        this.selectedOption = option;
        
        // Close the keyboard if open.
        Keyboard.close();

        this.viewCtrl.dismiss(this.selectedOption);
    }

    // Method that filters the available options according to the text entered on the searchbar
    public filterAvailableOptions(event: any) {
        let enteredText = event.target.value;
        this.resetOptions();

        if (enteredText && enteredText.trim() != '') {
            this.options = this.options.filter((option) => {
                return (option.value.toLowerCase().indexOf(enteredText.toLowerCase()) > -1);
            });
        }

        this.visibleOptions = this.options.splice(0, this.pageSize);
        this.infiniteScroll.enable(true);
    }

    // Method that allows Angular to identify different options
    public identifyOption(index: number, option: any) {
        return option.key;
    }

    // Method used to sort the list of options by value ASC
    private sortByValueAsc(a: any, b: any): number {
        if (a.value < b.value) {
            return -1;
        } else if (a.value > b.value) {
            return 1;
        }
        return 0;
    }

    // Method that loads the next page of options
    public loadMoreOptions(infiniteScroll: InfiniteScroll): void {
        if (this.options.length) {
            setTimeout(() => {
                let nextPageOptions = this.options.splice(0, this.pageSize);
                this.visibleOptions = this.visibleOptions.concat(nextPageOptions);
                infiniteScroll.complete();
            }, 500);
        } else {
            // All options have been shown, infinite scroll is not needed anymore
            infiniteScroll.enable(false);
        }
    }
}