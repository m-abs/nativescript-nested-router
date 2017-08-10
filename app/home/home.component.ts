import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions } from 'nativescript-angular/router';
import { NSLocationStrategy } from 'nativescript-angular/router/ns-location-strategy';

import { AndroidApplication, AndroidActivityBackPressedEventData } from 'tns-core-modules/application';
import * as application from 'tns-core-modules/application';
import { isAndroid } from 'tns-core-modules/platform';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/combineLatest';

@Component({
    selector: 'my-home',
    templateUrl: './home/home.component.html',
    styleUrls: [
      './home/home.component.css',
    ]
})
export class HomeComponent {
  public selectedIndex = 0;

  private androidBackPressEvent: (data: AndroidActivityBackPressedEventData) => void;

  private subs: Subscription[] = [];

  private outlets = {};

  constructor(
    private route: ActivatedRoute,
    private router: RouterExtensions,
    private locationstrategy: NSLocationStrategy,
    private ngZone: NgZone,
  ) {
  }

  ngOnInit() {
    this.subs.push(this.route.params.subscribe((params) => {
      if (params['selectedIndex']) {
        this.selectedIndex = params['selectedIndex'];
      }
    }));

  }

  ngAfterContentInit() {
    this.navigateToTabIndex(this.selectedIndex);

    if (isAndroid) {
      application.android.on(AndroidApplication.activityBackPressedEvent, this.androidBackPressEvent = (data: AndroidActivityBackPressedEventData) => {
        const states = this.locationstrategy._getStates();
        const curState = states.pop();

        if (!curState.isPageNavigation && curState.url.indexOf('/home') === 0) {
          this.router.back();
          data.cancel = true;
        }
      });
    }
  }

  ngOnDestroy() {
    if (isAndroid && this.androidBackPressEvent) {
      application.android.off(AndroidApplication.activityBackPressedEvent, this.androidBackPressEvent);
    }

    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }

  public navigateToDogsRoot() {
    this.router.navigate([
      '/home',
      { outlets: { dogoutlet: ['dogs'] } }
    ]);
  }

  public navigateToCatsRoot() {
    this.router.navigate([
      '/home',
      { outlets: { catoutlet: ['cats'] } }
    ]);
  }

  public navigateToCatTab() {
    if (this.selectedIndex === 0) {
      return this.navigateToCatsRoot();
    }
    this.navigateToTabIndex(0);
  }

  public navigateToDogTab() {
    if (this.selectedIndex === 1) {
      return this.navigateToDogsRoot();
    }
    this.navigateToTabIndex(1);
  }

  private currentOutletData() {
    const output = this.outlets || {};

    for (const child of this.route.children) {
      const outlet = child.outlet;

      output[outlet] = [];

      child.url.subscribe((urlSegment) => {
        for (const url of urlSegment) {
          if (url.path) {
            output[outlet].push(url.path);
          }

          if (url.parameters && Object.keys(url.parameters).length > 1) {
            console.dir(url.parameters);
            output[outlet].push(url.parameters);
          }
        }
      });
    }

    this.outlets = output;

    return output;
  }

  private navigateToTabIndex(selectedIndex: number) {
    if (this.selectedIndex === selectedIndex) {
      return;
    }

    const outlets = this.currentOutletData();
    console.dir(outlets);
    if (!outlets) {
      return;
    }

    this.router.navigate([
      '/home',
      {
        selectedIndex,
      },
      {
        outlets,
      }
    ]);
  }

  public tabViewIndexChange(index: number) {
    switch(index) {
      case 0: {
        this.navigateToDogsRoot();
        break;
      }
      case 1: {
        this.navigateToCatsRoot();
        break;
      }
    }
  }
}
