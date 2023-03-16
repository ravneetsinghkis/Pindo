import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../commonservice';
import { CrystalLightbox } from 'ngx-crystal-gallery';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-doer-photo-listing',
  templateUrl: './doer-photo-listing.component.html',
  styleUrls: ['./doer-photo-listing.component.scss']
})
export class DoerPhotoListingComponent implements OnInit {

  @ViewChild('popUpVar')
  popupref;	

  @Input() doerID;
  doerFolderListing = [];

  selectedFolderId = null;

  myImages:any = [];
  myConfig: any = {
  	masonry: false,
  	masonryMaxHeight: 95,
  	masonryGutter: 6,
  	loop: false,
  	backgroundOpacity: 0.85,
  	animationDuration: 100,
  	counter: true,
  	lightboxMaxHeight: '100vh - 86px',
  	lightboxMaxWidth: '100%'
  } 
  selectedFolderDescription:any = null;

  constructor(public commonservice:CommonService,public renderer: Renderer2, public el: ElementRef,private lightbox: CrystalLightbox) { }

  ngOnInit() {
  	this.getFolder();
  }

  togglePopup(indexVal='') {
  	if(this.popupref.nativeElement.classList.contains('opened')){
  		this.renderer.removeClass(this.popupref.nativeElement,'opened');
  		this.renderer.removeClass(document.body, 'popup-open');
      this.selectedFolderId = null;
      this.selectedFolderDescription = null;
  	}
  	else{
      //console.log(this.doerFolderListing[indexVal]);
  		this.selectedFolderId = this.doerFolderListing[indexVal]['id'];
      this.selectedFolderDescription = this.doerFolderListing[indexVal]['description'];
  		this.renderer.addClass(this.popupref.nativeElement,'opened');
  		this.renderer.addClass(document.body, 'popup-open');
  		this.getImages();
  	}
  }

  getFolder() {
  	this.commonservice.postHttpCall({url:'/get-doer-image-folders',data: {'doer_id':this.doerID}, contenttype:"application/json"}).then(result=>this.getFolderSuccess(result));
  }

  getFolderSuccess(response) {
  	if(response.status == 1) {
  		this.doerFolderListing = response.data;
  	}
  }

  getImages() {
  	this.commonservice.postHttpCall({url:'/get-doer-images',data: {'folder_id':this.selectedFolderId}, contenttype:"application/json"}).then(result=>this.getImagesSuccess(result));
  }

  getImagesSuccess(response) {
  	if(response.status == 1) {
  		//$('.total_loader').show();
  		this.myImages = response.data;
  		// setTimeout(() => {
  		// 	$('.total_loader').hide();
  		// },2000)
  	}
  }

}
