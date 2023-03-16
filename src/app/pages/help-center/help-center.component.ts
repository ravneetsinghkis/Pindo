import { Component,ViewChild } from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators,EmailValidator} from '@angular/forms';
import { Router,ActivatedRoute} from '@angular/router';
import {AppComponent} from '../../app.component';
import {Title} from "@angular/platform-browser";
import { CommonService } 			from '../../commonservice';
import {MatSnackBar} from '@angular/material';
// import { ViewEncapsulation } from '@angular/core';
declare var $: any;
@Component({
	selector: 'help-center',
	templateUrl: './help-center.component.html',
  	styleUrls: ['./help-center.component.scss']
})



export class HelpCenterComponent  { 
	
	public userdata:any = {};
	public success_msg = '';
	public reg_class = '';
	public errorMsg  = '';
	public pageLoder = false;
	public activate_email;any;
 	public email='';
 	public user_id:any;
 	public user_type:any;
 	public pinData:any;
 	public chatImage   = '';
 	public files       = '';
 
 	public formSupport1 = {
				issueType:'',
				pinId: '',
				subject: '',
				message: '',
		 	}

	@ViewChild('formSupport') sform: any;
	
	constructor(public snackBar: MatSnackBar,  private route: ActivatedRoute, private router: Router,
				private appService: AppComponent, private titleService: Title, public commonService:CommonService
			)
	{	
		this.getPinList();
		//console.log('user_id');
	}

 

 	getPinList() {
 		this.user_id  = atob(localStorage.getItem('frontend_user_id'));
 		this.user_type = atob(localStorage.getItem('user_type'));
	    if (this.user_type==1)  
	    	this.commonService.postHttpCall({url:'/pinners/get-pin-list', data:{'user_id':this.user_id}, contenttype:"application/json"}).then(result=>this.pinListSuccess(result));
	  	else
	    	this.commonService.postHttpCall({url:'/doers/get-pin-list', data:{'user_id':this.user_id}, contenttype:"application/json"}).then(result=>this.pinListSuccess(result));

	  }

	  pinListSuccess(response){
	   
	    if(response.status == 1){   
	        this.pinData = response.data;
	    }
	  }

 	submitSupport(values, validcheck){
 		if (validcheck) {
 			
 			let fd = new FormData();
			var item = {};
			Object.keys(values).forEach(function(key) {
				item[key] = (values[key] == null)?'':values[key];
				fd.append(key, values[key]);
			});

			if (this.chatImage) {
	          fd.append('attachment_file',this.chatImage);
	        } 

	        this.user_type = atob(localStorage.getItem('user_type'));
	        if (this.user_type==1)  
	        	this.commonService.postHttpCall({url:'/pinners/add-help-center', data:fd, contenttype:"form-data"}).then(result=>this.saveHelpSuccess(result));
	        else
	         	this.commonService.postHttpCall({url:'/doers/add-help-center', data:fd, contenttype:"form-data"}).then(result=>this.saveHelpSuccess(result));
  		}
 	}

 	public saveHelpSuccess(result){
 		if(result.status == 1){   
	        this.chatImage = '';
			$('#supprotresetFrm').trigger('click');
			this.responseMessageSnackBar(result.msg);
		}
  	}

  
 	public onChange(fileInput: any){
		this.files = [].slice.call(fileInput.target.files);

		var filename = this.readURL(fileInput.target);

		if (fileInput.target.files && fileInput.target.files[0]) {
			this.chatImage = fileInput.target.files[0];
			console.log(this.chatImage);
 		}
   	}

	 
	public readURL(input) {
      //console.log(this.input);
	    var url = input.value;
	    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
	    // console.log(input.files);
	    if (input.files && input.files && (
	      ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "gif" || ext == "pdf" || ext == "doc" || ext == "docx"
	      )) {
				var total_filename = [];
				var total_html = 'Attached files:';
				for(var i=0;i<input.files.length;i++){
					let fName=input.files[i].name.replace(/^.*\\/, "");
					total_html +='<span>'+ fName + '</span>';
					total_filename.push(input.files[i].name);
				}
				if(total_html!='Attached files:'){
					$(input).parent().find('.file-name').html(total_html);
					$(input).parent().parent().find('.fileUpload-error').html( "");
				}
       
	    } else {
	      $(input).val("");
	      $(input).parent().parent().find('.fileUpload-error').html( "Only image/pdf/doc/docx formats are allowed!");
	    }
  	}

  	public responseMessageSnackBar(message,res_class:any='',vertical_position:any='bottom'){
	    this.snackBar.open(message,'', {
	        duration: 4000,
	        horizontalPosition:'right',
	        verticalPosition:vertical_position,       
	        panelClass:res_class
	    });
	}

}