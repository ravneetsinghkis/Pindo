import { MaterialModule } from './../../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';

import { CommunityHomeRoutingModule } from './community-home-routing.module';
import { CommunityHomeComponent } from './community-home.component';
import { BookmarkedListComponent } from './bookmarked-list/bookmarked-list.component';

import { NguiMapModule} from '@ngui/map';
import {PopoverModule} from "ngx-popover";

// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import {MatButtonToggleModule} from '@angular/material/button-toggle';
// import {MatSlideToggleModule} from '@angular/material/slide-toggle';
// import {MatTooltipModule} from '@angular/material/tooltip';
// import {MatRadioModule} from '@angular/material/radio';
// import {MatSelectModule} from '@angular/material/select';


import { CreatePostDialog } from './create-post-dialog/create-post-dialog.component';
import { CreateReportDialog } from './create-report-dialog/create-report-dialog.component';
import { InvitePindoDialog } from './invite-pindo-dialog/invite-pindo-dialog.component';
import { MapInfoDialog } from './map-info-dialog/map-info-dialog.component';
import { ReplyDialog } from './reply-dialog/reply-dialog.component';
import { CreatePostTwoDialog } from './create-post-two-dialog/create-post-two-dialog.component';
import { CreatePostThreeDialog } from './create-post-three-dialog/create-post-three-dialog.component';
import { MomentModule } from 'ngx-moment';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
//import { RatingModule } from 'ng-starrating';
import { TruncateModule } from 'ng2-truncate';
import { StarRatingModule } from 'angular-star-rating';
import { CreatePostCommonDialogComponent } from './create-post-common-dialog/create-post-common-dialog.component';
import { RequestCommunityComponent } from 'src/app/shared/request-community/request-community.component';
import { RequestCommunityModule } from 'src/app/shared/request-community/request-community.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CommunityHomeRoutingModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?libraries=places,geocoder&key=AIzaSyDX6v5ZrzvzuTdBnDiDswr8U0BTV0vJNOA'}),
    PopoverModule,
    //RatingModule,
    StarRatingModule.forRoot(),
    TruncateModule,
    // MatCardModule,
    // MatButtonModule,
    // MatIconModule,
    // MatButtonToggleModule,
    // MatSlideToggleModule,
    // MatTooltipModule,
    // MatRadioModule,
    // MatSelectModule,
    MaterialModule,
    InfiniteScrollModule,
    RequestCommunityModule,
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        'm': 59
      }
    })
  ],
  declarations: [
    CommunityHomeComponent,
    CreatePostDialog,
    InvitePindoDialog,
    BookmarkedListComponent,
    MapInfoDialog,
    ReplyDialog,
    CreatePostTwoDialog,
    CreatePostThreeDialog,
    CreateReportDialog, 
    CreatePostCommonDialogComponent
  ],
  entryComponents: [
    CreatePostDialog,
    InvitePindoDialog,
    MapInfoDialog,
    ReplyDialog, 
    CreatePostTwoDialog,
    CreatePostThreeDialog,
    CreateReportDialog, 
    CreatePostCommonDialogComponent,
    RequestCommunityComponent
  ]
})
export class CommunityHomeModule { }
