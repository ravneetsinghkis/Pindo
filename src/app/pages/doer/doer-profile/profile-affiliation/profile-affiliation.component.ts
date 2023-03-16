import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-affiliation',
  templateUrl: './profile-affiliation.component.html',
  styleUrls: ['./profile-affiliation.component.css']
})
export class ProfileAffiliationComponent implements OnInit {
 
  @Input()
  isHiddenaffiliation = false;	

  constructor() { }

  ngOnInit() {
  }

}
