var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { HighlightPipe, DragProvider, OptionsProvider } from './core';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { DeleteIconComponent, TagComponent, TagInputComponent, TagInputDropdown, TagInputVirtualizedDropdown, TagInputForm, TagRipple } from './components';
var COMPONENTS = [
    TagInputComponent,
    DeleteIconComponent,
    TagInputForm,
    TagComponent,
    HighlightPipe,
    TagInputDropdown,
    TagInputVirtualizedDropdown,
    TagRipple
];
var optionsProvider = new OptionsProvider();
var TagInputModule = (function () {
    function TagInputModule() {
    }
    TagInputModule.withDefaults = function (options) {
        optionsProvider.setOptions(options);
    };
    TagInputModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                FormsModule,
                Ng2DropdownModule,
                VirtualScrollModule
            ],
            declarations: COMPONENTS,
            exports: COMPONENTS,
            providers: [
                DragProvider
            ]
        })
    ], TagInputModule);
    return TagInputModule;
}());
export { TagInputModule };
//# sourceMappingURL=tag-input.module.js.map