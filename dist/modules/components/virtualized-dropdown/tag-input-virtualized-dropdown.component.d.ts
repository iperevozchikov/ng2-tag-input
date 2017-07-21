import { TemplateRef, QueryList, EventEmitter } from '@angular/core';
import { Ng2Dropdown, Ng2MenuItem } from 'ng2-material-dropdown';
import { VirtualScrollComponent } from 'angular2-virtual-scroll';
import { TagModel } from '../../core';
import { TagInputComponent } from '../../components';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
export declare class TagInputVirtualizedDropdown {
    private tagInput;
    dropdown: Ng2Dropdown;
    vScroll: VirtualScrollComponent;
    templates: QueryList<TemplateRef<any>>;
    dropdownMenuItemWidth: number;
    dropdownMenuItemHeight: number;
    scrollbarWidth: number;
    scrollbarHeight: number;
    offset: string;
    focusFirstElement: boolean;
    showDropdownIfEmpty: boolean;
    autocompleteObservable: (text: string, skip: number, limit: number) => Observable<any>;
    totalOfItemsObservable: (text: string) => Observable<number>;
    autocompleteObservableFetchLimit: number;
    minimumTextLength: number;
    displayBy: string;
    identifyBy: string;
    matchingFn: (value: string, target: TagModel) => boolean;
    appendToBody: boolean;
    items: TagModel[];
    private _autocompleteItems;
    autocompleteItems: TagModel[];
    constructor(tagInput: TagInputComponent);
    ngOnInit(): void;
    updatePosition(): void;
    readonly isVisible: boolean;
    onHide(): EventEmitter<Ng2Dropdown>;
    onItemClicked(): EventEmitter<string>;
    readonly selectedItem: Ng2MenuItem;
    readonly state: any;
    show: () => void;
    scrollListener(): void;
    private requestAdding;
    private createTagModel(item);
    private getMatchingItems(value);
    private setItems(items);
    private resetItems;
    private populateItems(data, concat);
    private getItemsFromObservable;
    private setLoadingState(state);
}
