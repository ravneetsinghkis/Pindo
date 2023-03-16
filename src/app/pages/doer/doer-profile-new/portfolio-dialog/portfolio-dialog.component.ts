import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
// declare var $: any;
// declare var jQuery: any;
declare var Swiper: any;
import { Globalconstant } from '../../../../global_constant';
import { CommonService } from 'src/app/commonservice';
@Component({
  selector: 'portfolio-dialog',
  templateUrl: 'portfolio-dialog.html',
})

export class PortfolioDialog {
  // portfolio_url: any;
  gallery_url:string='';
  portfolio_id: number;
  doer_id:number;
  doerProfilePortfolioDetails:any=[];
  folder_name:string;

  constructor(public dialogRef: MatDialogRef<PortfolioDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private router: Router,
    public myGlobals: Globalconstant,
    public commonservice: CommonService,
  ) {
    this.portfolio_id = this.data.portfolioId;
    this.doer_id = this.data.doerId;
  }

  ngOnInit() {
    // this.image_url = this.myGlobals.uploadUrl + '/assets/images/album/photo_1';
    // this.portfolio_url = this.myGlobals.uploadUrl+'/gallery/'+this.doer_id+'/';
    this.gallery_url = this.myGlobals.uploadUrl+'/doer_gallery/';
    this.getDoerCategoryListByDoerIdApi();
  }

  ngAfterViewInit() {
    // var galleryThumbs = new Swiper('.portfolio-thumb-slider .gallery-thumbs', {
    //   spaceBetween: 10,
    //   slidesPerView: 4,
    //   freeMode: true,
    //   watchSlidesVisibility: true,
    //   watchSlidesProgress: true,
    // });
    // var galleryTop = new Swiper('.portfolio-thumb-slider .gallery-top', {
    //   spaceBetween: 10,
    //   navigation: {
    //     nextEl: '.portfolio-thumb-slider .swiper-button-next',
    //     prevEl: '.portfolio-thumb-slider .swiper-button-prev',
    //   },
    //   thumbs: {
    //     swiper: galleryThumbs
    //   }
    // });

  }

  closeDialog(): void {
    this.dialogRef.close('close');
    // $("#nb-global-spinner").hide();
  }

  /**
   * Shows portfolio slider details
   */
  showPortfolioSliderDetails(){
    var galleryTop = new Swiper('.portfolio-thumb-slider .gallery-top', {
      spaceBetween: 10,
      loop: true,
      loopedSlides: 5, //looped slides should be the same
      navigation: {
        nextEl: '.portfolio-thumb-slider .swiper-button-next',
        prevEl: '.portfolio-thumb-slider .swiper-button-prev',
      },
    });
    var galleryThumbs = new Swiper('.portfolio-thumb-slider .gallery-thumbs', {
      spaceBetween: 10,
      slidesPerView: 4,
      touchRatio: 0.2,
      loop: true,
      loopedSlides: 5, //looped slides should be the same
      slideToClickedSlide: true,
    });
    galleryTop.controller.control = galleryThumbs;
    galleryThumbs.controller.control = galleryTop;
  }

  getDoerCategoryListByDoerIdApi() {
    this.commonservice.postCommunityHttpCall(
      {
        // url: '/api/pinner/get-doer-profile-single-portfolio-details',
        url: '/api/pinner/get-doer-profile-single-photo-gallery-details',
        data: { id: this.portfolio_id },
        contenttype: "application/json"
      })
      .then(result => {
        console.log("result = ", result);
        if (result.status == 1) {
          this.doerProfilePortfolioDetails = result.data.rows[0].photos;
          this.folder_name = result.data.rows[0].folder_name;
          // this.portfolio_url = this.portfolio_url+result.data.rows[0].folder_name+'/';
          // console.log( this.portfolio_url);
          // console.log(this.doerProfilePortfolioDetails);
          setTimeout(() => {
            this.showPortfolioSliderDetails();
          }, 300)
        }
      });
  }

}