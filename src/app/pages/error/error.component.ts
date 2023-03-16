import { Component } from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
	selector: 'error',
	templateUrl: '404.html'			
})

export class Error404Component { 

	constructor( 
        		private titleService: Title
        	)
	{
		// Change Page Title
		this.titleService.setTitle('Pindo | Not Found');		
	}
}