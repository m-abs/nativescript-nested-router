import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { NSLocationStrategy } from 'nativescript-angular/router/ns-location-strategy';

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent {
    constructor(router: Router, locationstrategy: NSLocationStrategy) {
      router.events.subscribe((e) => {
          const states = locationstrategy._getStates();
          console.log(`Router Event:\n\t${e.toString()}\n\tstates: ${JSON.stringify(states)}`);
      });
    }
}
