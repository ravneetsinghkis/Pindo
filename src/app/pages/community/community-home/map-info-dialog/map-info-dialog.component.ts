import { Component, OnInit, Inject, ViewChild, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
declare var $: any;
import { MatSnackBar } from '@angular/material';
import { CommonService } from '../../../../commonservice';
import { Globalconstant } from '../../../../global_constant';
import { MatSlideToggleChange } from '@angular/material';
import Swal from 'sweetalert2'
declare var $: any;
declare var Swiper: any;

@Component({
  selector: 'map-info-dialog',
  templateUrl: 'map-info-dialog.html',
})
export class MapInfoDialog {
  mapObj: any;
  latitude: any;
  longitude: any;
  single_number_community: any = [];
  community_user_id: any;
  @Output() listingPopulated = new EventEmitter();
  constructor(public dialogRef: MatDialogRef<MapInfoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder, public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, private ref: ChangeDetectorRef, public snackBar: MatSnackBar, public myGlobals: Globalconstant
  ) {

  }
  ngOnInit() {
    this.initMap();
    this.singleCommunityActivity();
    if (this.data.community_user_id != 'community_user_id') {
      this.community_user_id = this.data.community_user_id;
    }
  }

  /**
   * Load the map when open the popup
   */
  initMap() {
    this.latitude = parseFloat(this.data.latitude);
    this.longitude = parseFloat(this.data.longitude);
    // Create the map.
    this.mapObj = {
      zoom: 8,
      center: { lat: this.latitude, lng: this.longitude },

      navigationControl: false,
      mapTypeControl: false,
      scaleControl: false,
      draggable: false,
      zoomControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: JSON.parse(this.myGlobals.styles),
      mapTypeId: 'roadmap'
    };
    const map: any = new google.maps.Map(document.getElementById('map2'), this.mapObj);

    const marker: any = new google.maps.Marker({
      position: { lat: this.latitude, lng: this.longitude },
      map: map,
      title: this.latitude + ',' + this.longitude
    });
  }
  /**
     * Closes dialog
     */
  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Singles community activity number (post , pins, dors, pinners)
   */
  singleCommunityActivity() {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/single-community-details', data: { community_id: this.data.communityid }, contenttype: "application/json" }).then(result => {
      if (result.status == 1) {
        this.single_number_community = result.data;
      }
    });

  }

  /**
   * Adds join to community by community id
   
   * @param communityid 
   */
  addJoinCommunity(communityid) {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/add-user-community', data: { community_id: communityid }, contenttype: "application/json" }).then(result => {
      console.log('resultant', result);
      if (result.status == 1) {
        this.listingPopulated.emit(true);
        this.responseMessageSnackBar(result.msg);
        this.dialogRef.close();
      }
    });

  }

  /**
   * Removes join from community by community id
   * @param communityid 
   */
  removeJoinCommunity(communityid) {
    console.log('this.data', this.data);
    Swal({

      title: 'Are you sure you want to leave the Community ?' + this.data.communityname,
      text: '',
      // type: '',
      showCancelButton: true,
      confirmButtonColor: '#bad141',
      cancelButtonColor: "#bad141",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((resultswal) => {
      if (resultswal.value) {
        this.commonservice.postCommunityHttpCall({ url: '/api/pinner/delete-user-community', data: { id: this.data.community_user_id }, contenttype: "application/json" }).then(result => {
          if (result.status == 1) {
            this.listingPopulated.emit(true);
            this.responseMessageSnackBar(result.msg);
            this.dialogRef.close();
          }
        });
      } else if (resultswal.dismiss === Swal.DismissReason.cancel) {
        this.closeDialog();
      }
    })

  }
  /**
 * Responses message snack bar for show alert
 * @param message 
 * @param [res_class] 
 */
  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }

}