import { Component } from '@angular/core';

import { RouterExtensions } from 'nativescript-angular/router';
import { NSLocationStrategy } from 'nativescript-angular/router/ns-location-strategy';

@Component({
    selector: 'my-home',
    templateUrl: './home/home.component.html'
})
export class HomeComponent {
  public selectedIndex: number = 0;

  constructor(private router: RouterExtensions, private locationstrategy: NSLocationStrategy) {
  }

  navigateToDogsRoot() {
    this.router.navigate([
      '/home',
      { outlets: { dogoutlet: ['dogs'] } }
    ]);
  }

  navigateToCatsRoot() {
    console.dir(this.locationstrategy._getStates().pop());
    this.router.navigate([
      '/home',
      { outlets: { catoutlet: ['cats'] } }
    ]);
  }

  tabViewIndexChange(index: number) {
    switch(index) {
      case 0: 
        this.navigateToDogsRoot();
        break;
      case 1:
        this.navigateToCatsRoot();
        break;    
    }
  }
}
