import {
    Component,
    ViewChild,
    forwardRef,
    Inject,
    TemplateRef,
    ContentChildren,
    Input,
    QueryList,
    HostListener,
    EventEmitter,
    NgZone
} from '@angular/core';

import { Ng2Dropdown, Ng2MenuItem } from 'ng2-material-dropdown';
import { ChangeEvent, VirtualScrollComponent } from 'angular2-virtual-scroll';

import { TagModel } from '../../core';
import { TagInputComponent } from '../../components';

// rx
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';

@Component({
    selector: 'tag-input-virtualized-dropdown',
    templateUrl: './tag-input-virtualized-dropdown.template.html',
    styles: [`
        /deep/ ng2-dropdown-menu div.ng2-dropdown-menu {
            overflow-y: hidden !important;
            height: 100% !important;
        }
        
        /deep/ ng2-dropdown-menu div.ng2-dropdown-menu__options-container {
            height: inherit;
        }
    `]
})
export class TagInputVirtualizedDropdown {
    /**
     * @name dropdown
     */
    @ViewChild(Ng2Dropdown) public dropdown: Ng2Dropdown;

    /**
     * @name vScroll
     * @desc reference to the virtualized component
     * @type {VirtualScrollComponent}
     */
    @ViewChild(VirtualScrollComponent) public vScroll: VirtualScrollComponent;

    /**
     * @name menuTemplate
     * @desc reference to the template if provided by the user
     * @type {TemplateRef}
     */
    @ContentChildren(TemplateRef) public templates: QueryList<TemplateRef<any>>;

    @Input() public dropdownMenuItemWidth: number;

    @Input() public dropdownMenuItemHeight = 48;

    @Input() public scrollbarWidth: number;

    @Input() public scrollbarHeight: number;

    /**
     * @name offset
     * @type {string}
     */
    @Input() public offset = '50 0';

    /**
     * @name focusFirstElement
     * @type {boolean}
     */
    @Input() public focusFirstElement = false;

    /**
     * - show autocomplete dropdown if the value of input is empty
     * @name showDropdownIfEmpty
     * @type {boolean}
     */
    @Input() public showDropdownIfEmpty = false;

    /**
     * @description observable passed as input which populates the autocomplete items
     * @name autocompleteObservable
     */
    @Input() public autocompleteObservable: (text: string, skip: number, limit: number) => Observable<any>;

    @Input() public loadThresholdOfAutocompleteItems = 95;

    @Input() public totalOfItemsObservable: (text: string) => Observable<number>;

    @Input() public autocompleteObservableFetchLimit = 100;

    /**
     * - desc minimum text length in order to display the autocomplete dropdown
     * @name minimumTextLength
     */
    @Input() public minimumTextLength = 1;

    /**
     * @name displayBy
     */
    @Input() public displayBy = 'display';

    /**
     * @name identifyBy
     */
    @Input() public identifyBy = 'value';

    /**
     * @description a function a developer can use to implement custom matching for the autocomplete
     * @name matchingFn
     */
    @Input() public matchingFn: (value: string, target: TagModel) => boolean =
         (value: string, target: TagModel): boolean => {
            const targetValue = target[this.displayBy].toString();

            return targetValue && targetValue
                .toLowerCase()
                .indexOf(value.toLowerCase()) >= 0;
    }

    /**
     * @name appendToBody
     * @type {boolean}
     */
    @Input() public appendToBody = true;

    /**
     * list of items that match the current value of the input (for autocomplete)
     * @name items
     * @type {TagModel[]}
     */
    public items: TagModel[] = [];

    /**
     * @name _autocompleteItems
     * @type {Array}
     * @private
     */
    private _autocompleteItems: TagModel[] = [];

    /**
     * @name autocompleteItems
     * @param items
     */
    public set autocompleteItems(items: TagModel[]) {
        this._autocompleteItems = items;
    }

    /**
     * @name autocompleteItems
     * @desc array of items that will populate the autocomplete
     * @type {Array<string>}
     */
    @Input() public get autocompleteItems(): TagModel[] {
        const items = this._autocompleteItems;

        if (!items) {
            return [];
        }

        return items.map((item: TagModel) => {
            return typeof item === 'string' ? {
                [this.displayBy]: item,
                [this.identifyBy]: item
            } : item;
        });
    }

    @Input() public flexibleMenuHeight: boolean = false;

    constructor(
        @Inject(forwardRef(() => TagInputComponent)) private tagInput: TagInputComponent
    ) {}

    /**
     * @name ngOnInit
     */
    public ngOnInit(): void {
        if (this.loadThresholdOfAutocompleteItems > 100 || this.loadThresholdOfAutocompleteItems < 0) {
            this.loadThresholdOfAutocompleteItems = 95;
        }

        this.onItemClicked()
            .subscribe(this.requestAdding);

        // reset itemsMatching array when the dropdown is hidden
        this.onHide()
            .subscribe(this.resetItems);

        this.tagInput.inputForm.onKeyup
            .subscribe(this.show);

        if (this.autocompleteObservable) {
            this.tagInput
                .onTextChange
                .filter((text: string) => text.trim().length >= this.minimumTextLength)
                .subscribe((text: string) =>
                    this.getItemsFromObservable(text, 0, this.autocompleteObservableFetchLimit));

            if (this.totalOfItemsObservable) {
                this.vScroll
                    .end
                    .debounceTime(350)
                    .filter((e: ChangeEvent) => {
                        const autocompleteItemsCount = this.autocompleteItems.length - this.tagInput.items.length;
                        const scrolled = Math.floor((e.end * 100) / autocompleteItemsCount);

                        return this.autocompleteItems.length > 0
                            && scrolled >= this.loadThresholdOfAutocompleteItems
                            && !this.tagInput.isLoading;
                    })
                    .flatMap((e: ChangeEvent) => this.totalOfItemsObservable(this.tagInput.inputTextValue))
                    .filter(total => total > this.autocompleteItems.length + this.autocompleteObservableFetchLimit)
                    .subscribe(
                        () => this.getItemsFromObservable(this.tagInput.inputTextValue,
                            this.autocompleteItems.length, this.autocompleteObservableFetchLimit)
                    );
            }
        }

        this.dropdown.onShow.subscribe(() => {
            setTimeout(() => this.vScroll.refresh(), 150);
        });
    }

    /**
     * @name updatePosition
     */
    public updatePosition(): void {
        const position = this.tagInput.inputForm.getElementPosition();
        this.dropdown.menu.updatePosition(position);
    }

    /**
     * @name isVisible
     * @returns {boolean}
     */
    public get isVisible(): boolean {
        return this.dropdown.menu.state.menuState.isVisible;
    }

    /**
     * @name onHide
     * @returns {EventEmitter<Ng2Dropdown>}
     */
    public onHide(): EventEmitter<Ng2Dropdown> {
        return this.dropdown.onHide;
    }

    /**
     * @name onItemClicked
     * @returns {EventEmitter<string>}
     */
    public onItemClicked(): EventEmitter<string> {
        return this.dropdown.onItemClicked;
    }

    /**
     * @name selectedItem
     * @returns {Ng2MenuItem}
     */
    public get selectedItem(): Ng2MenuItem {
        return this.dropdown.menu.state.dropdownState.selectedItem;
    }

    /**
     * @name state
     * @returns {DropdownStateService}
     */
    public get state(): any {
        return this.dropdown.menu.state;
    }

    /**
     *
     * @name show
     */
    public show = (): void => {
        const value: string = this.tagInput.inputForm.value.value.trim();
        const position: ClientRect = this.tagInput.inputForm.getElementPosition();
        const items: TagModel[] = this.getMatchingItems(value);
        const hasItems: boolean = items.length > 0;
        const showDropdownIfEmpty: boolean = this.showDropdownIfEmpty && hasItems && !value;
        const hasMinimumText: boolean = value.length >= this.minimumTextLength;

        const assertions: boolean[] = [
            hasItems,
            this.isVisible === false,
            hasMinimumText
        ];

        const showDropdown: boolean = (assertions.filter(item => item).length === assertions.length) ||
            showDropdownIfEmpty;
        const hideDropdown: boolean = this.isVisible && (!hasItems || !hasMinimumText);

        // set items
        this.setItems(items);

        if (this.flexibleMenuHeight) {
            const el: HTMLElement = this.dropdown.menu['element']['nativeElement']['children'][0];

            const totalHeight = items.length * this.dropdownMenuItemHeight;

            if (el.style.height) {
                el.style.cssText.replace(/(height\:)\s*[0-9]+(px|%)\s*(!important)?;?/i, '');
            }

            const newHeight = totalHeight < 400 ? (totalHeight + 10).toString() + 'px' : '100%';

            el.setAttribute('style', el.style.cssText + `height: ${newHeight} !important;`);
        }

        if (showDropdown && !this.isVisible) {
            this.dropdown.show(position);
        } else if (hideDropdown) {
            this.dropdown.hide();
        }
    }

    /**
     * @name scrollListener
     */
    @HostListener('window:scroll')
    public scrollListener(): void {
        if (!this.isVisible) {
            return;
        }

        this.updatePosition();
    }

    /**
     * @name requestAdding
     * @param item {Ng2MenuItem}
     */
    private requestAdding = (item: Ng2MenuItem): void => {
        if (!item) {
            return;
        }

        const model = this.createTagModel(item);

        // add item
        this.tagInput.onAddingRequested(true, model);

        // hide dropdown
        this.dropdown.hide();
    }

    /**
     * @name createTagModel
     * @param item
     * @return {{}}
     */
    private createTagModel(item: Ng2MenuItem): TagModel {
        const display = typeof item.value === 'string' ? item.value : item.value[this.displayBy];
        const value = typeof item.value === 'string' ? item.value : item.value[this.identifyBy];

        return {
            ...item.value,
            [this.tagInput.displayBy]: display,
            [this.tagInput.identifyBy]: value
        };
    }

    /**
     *
     * @param value {string}
     * @returns {any}
     */
    private getMatchingItems(value: string): TagModel[] {
        if (!value && !this.showDropdownIfEmpty) {
            return [];
        }

        return this.autocompleteItems.filter((item: TagModel) => {
            const hasValue: boolean = this.tagInput.tags.some(tag => {
                const identifyBy = this.tagInput.identifyBy;
                const model = typeof tag.model === 'string' ? tag.model : tag.model[identifyBy];

                return model === item[this.identifyBy];
            });

            return this.matchingFn(value, item) && hasValue === false;
        });
    }

    /**
     * @name setItems
     */
    private setItems(items: TagModel[]): void {
        this.items = items;
    }

    /**
     * @name resetItems
     */
    private resetItems = (): void => {
        this.items = [];

        if (this.autocompleteObservable) {
            this.autocompleteItems = [];
        }
    }

    /**
     * @name populateItems
     * @param data
     */
    private populateItems(data: any, concat: boolean): TagInputVirtualizedDropdown {
        const formattedItems = data.map(item => {
            return typeof item === 'string' ? {
                [this.displayBy]: item,
                [this.identifyBy]: item
            } : item;
        });

        this.autocompleteItems = concat ? [...this.autocompleteItems].concat(formattedItems) : formattedItems;

        return this;
    }

    /**
     * @name getItemsFromObservable
     * @param text
     */
    private getItemsFromObservable = (text: string, skip: number, limit: number): void => {
        this.setLoadingState(true);

        this.autocompleteObservable(text, skip, limit)
            .subscribe(data => {
                // hide loading animation
                this.setLoadingState(false)
                    // add items
                    .populateItems(data, skip > 0)
                    // show the dropdown
                    .show();

        }, () => this.setLoadingState(false));
    }

    /**
     * @name setLoadingState
     * @param state
     * @return {TagInputDropdown}
     */
    private setLoadingState(state: boolean): TagInputVirtualizedDropdown {
        this.tagInput.isLoading = state;

        return this;
    }
}
