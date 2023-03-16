import { CanDeactivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';
import { PendingProfilePopupComponent } from '../shared/pending-profile-popup/pending-profile-popup.component';
import { DeviceDetectorService } from 'ngx-device-detector';
declare var $: any;

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

  constructor(
    public router: Router,
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService
  ) {}

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {

    $('.total_loader').hide();

    if (! component.canDeactivate()) {

      const isMobile = this.deviceService.isMobile();

      let modalParams = <any> {
        maxHeight: "98vh",
        disableClose: true
      };

      if (isMobile) {
        modalParams.maxWidth = "95vw";
      } else {
        modalParams.width = "800px";
      }

      const modal = this.dialog.open(PendingProfilePopupComponent, modalParams);

      return modal.afterClosed().map(result => {
        if (result=='cancel'){
            return false;
        } else if (result=='save'){
            return true;
        } else if (result=='discard'){
            return true;
        }
      }).first();
    } else {
      return true;
    }
  }

}