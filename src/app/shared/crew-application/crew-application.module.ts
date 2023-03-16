import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { CrewApplicationComponent } from './crew-application.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    exports: [CrewApplicationComponent],
    declarations: [CrewApplicationComponent],
    providers: [],
})
export class CrewApplicationModule {
}