import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { VirtualScrollModule } from 'angular2-virtual-scroll';

import {
    TagInputComponent,
    TagInputForm,
    DeleteIconComponent,
    TagInputDropdown,
    TagInputVirtualizedDropdown,
    TagComponent,
    TagRipple
} from './components';

import { HighlightPipe } from './core';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        Ng2DropdownModule,
        VirtualScrollModule
    ],
    declarations: [
        TagInputComponent,
        DeleteIconComponent,
        TagInputForm,
        TagComponent,
        HighlightPipe,
        TagInputDropdown,
        TagInputVirtualizedDropdown,
        TagRipple
    ],
    exports: [
        TagInputComponent,
        DeleteIconComponent,
        TagInputForm,
        TagComponent,
        HighlightPipe,
        TagInputDropdown,
        TagInputVirtualizedDropdown,
        TagRipple
    ]
})
export class TagInputModule {}

export * from './components';
