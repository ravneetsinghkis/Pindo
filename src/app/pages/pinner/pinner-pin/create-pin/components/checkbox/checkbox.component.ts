import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../../../../field.interface";
import { CommonService }  from '../../../../../../commonservice';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  field: FieldConfig;
  group: FormGroup;	
  formsubmitted = false;

  constructor(public commonservice:CommonService) { }

  ngOnInit() {
  	this.commonservice.listnerDynamicFormSubmit().subscribe((data)=>{
  		this.formsubmitted = data;
  	});
  }

}
