import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-service-doer-details',
  templateUrl: './service-doer-details.component.html',
  styleUrls: ['./service-doer-details.component.css']
})
export class ServiceDoerDetailsComponent implements OnInit {

  @ViewChild('popUpVar')
  popupref;	
  
  constructor(public renderer: Renderer2, public el: ElementRef) { }

  ngOnInit() {
  }

  togglePopup() {
  	if (this.popupref.nativeElement.classList.contains('opened')){
  		this.renderer.removeClass(this.popupref.nativeElement, 'opened');
  		this.renderer.removeClass(document.body, 'popup-open');
  	} else {
  		this.renderer.addClass(this.popupref.nativeElement, 'opened');
  		this.renderer.addClass(document.body, 'popup-open');
  	}
  }

}
