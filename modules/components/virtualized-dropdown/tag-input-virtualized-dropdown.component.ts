import {
    Component,
    ViewChild,
    forwardRef,
    TemplateRef,
    ContentChildren,
    Input,
    QueryList,
    HostListener,
    EventEmitter,
    NgZone, Type, Injector
} from '@angular/core';

import { Ng2Dropdown, Ng2MenuItem } from 'ng2-material-dropdown';
import { ChangeEvent, VirtualScrollComponent } from 'angular2-virtual-scroll';

import { OptionsProvider, TagModel } from '../../core';
import { TagInputComponent } from '../../components';
import { TagInputDropdownOptions } from '../../defaults';

// rx
import { Observable } from 'rxjs';
import { filter, switchMap, first, debounceTime } from 'rxjs/operators';

const defaults: Type<TagInputDropdownOptions> = forwardRef(() => OptionsProvider.defaults.dropdown);

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
     */
    @ViewChild(VirtualScrollComponent) public vScroll: VirtualScrollComponent;

    /**
     * @name menuTemplate
     * @desc reference to the template if provided by the user
     */
    @ContentChildren(TemplateRef) public templates: QueryList<TemplateRef<any>>;

    @Input() public dropdownMenuItemWidth: number;

    @Input() public dropdownMenuItemHeight = 48;

    @Input() public scrollbarWidth: number;

    @Input() public scrollbarHeight: number;

    /**
     * @name offset
     */
    @Input() public offset: string = new defaults().offset;

    /**
     * @name focusFirstElement
     */
    @Input() public focusFirstElement = new defaults().focusFirstElement;

    /**
     * - show autocomplete dropdown if the value of input is empty
     * @name showDropdownIfEmpty
     */
    @Input() public showDropdownIfEmpty = new defaults().showDropdownIfEmpty;

    @Input() public showDropdownAlways = false;

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
    @Input() public minimumTextLength = new defaults().minimumTextLength;

    /**
     * @name displayBy
     */
    @Input() public displayBy = new defaults().displayBy;

    /**
     * @name identifyBy
     */
    @Input() public identifyBy = new defaults().identifyBy;

    /**
     * @description a function a developer can use to implement custom matching for the autocomplete
     * @name matchingFn
     */
    @Input() public matchingFn: (value: string, target: TagModel) => boolean = new defaults().matchingFn;

    /**
     * @name appendToBody
     */
    @Input() public appendToBody = new defaults().appendToBody;

    /**
     * @name keepOpen
     * @description option to leave dropdown open when adding a new item
     */
    @Input() public keepOpen = new defaults().keepOpen;

    /**
     * @name dynamicUpdate
     */
    @Input() public dynamicUpdate = new defaults().dynamicUpdate;

    /**
     * @name zIndex
     */
    @Input() public zIndex = new defaults().zIndex;

    /**
     * list of items that match the current value of the input (for autocomplete)
     * @name items
     */
    public items: TagModel[] = [];

    /**
     * @name tagInput
     */
    public tagInput: TagInputComponent = this.injector.get(TagInputComponent);

    /**
     * @name _autocompleteItems
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

    constructor(private readonly injector: Injector) {}

    /**
     * @name ngOnInit
     */
    public ngOnInit(): void {
        if (this.loadThresholdOfAutocompleteItems > 100 || this.loadThresholdOfAutocompleteItems < 0) {
            this.loadThresholdOfAutocompleteItems = 95;
        }

        this.onItemClicked().subscribe((item: Ng2MenuItem) => {
            this.requestAdding(item);
        });

        // reset itemsMatching array when the dropdown is hidden
        this.onHide().subscribe(this.resetItems);

        setInterval(() => {
            if (!this.isVisible && this.autocompleteItems.length) {
                this.hide();
            }
        }, 25);

        this.tagInput
            .onTextChange
            .asObservable()
            .pipe(
                debounceTime(200),
                filter((text: string) => !this.keepOpen
                    ? text.trim().length > 0
                    : true
                )
            )
            .subscribe(this.show);


        if (this.totalOfItemsObservable) {
            this.vScroll
                .end
                .asObservable()
                .pipe(
                    debounceTime(350),
                    filter((e: ChangeEvent) => {
                        if (e.end === undefined) {
                            return false;
                        }

                        const autocompleteItemsCount = this.autocompleteItems.length - this.tagInput.items.length;
                        const scrolled = Math.floor((e.end * 100) / autocompleteItemsCount);

                        return this.autocompleteItems.length > 0
                            && scrolled >= this.loadThresholdOfAutocompleteItems
                            && !this.tagInput.isLoading;
                    }),
                    switchMap(() => this.totalOfItemsObservable(this.tagInput.inputTextValue)),
                    filter(total => this.autocompleteItems.length < total)
                )
                .subscribe(
                    () => this.getItemsFromObservable(
                        this.tagInput.inputTextValue,
                        this.autocompleteItems.length,
                        this.autocompleteObservableFetchLimit
                    )
                );
        }

        this.dropdown
            .onShow
            .asObservable()
            .subscribe(() => {
                setTimeout(() => this.vScroll.refresh(), 150);
            });
    }
    /**
     * @name updatePosition
     */
    public updatePosition(): void {
        const position = this.tagInput.inputForm.getElementPosition();

        this.dropdown.menu.updatePosition(position, this.dynamicUpdate);
    }

    /**
     * @name isVisible
     */
    public get isVisible(): boolean {
        return this.dropdown.menu.state.menuState.isVisible;
    }

    /**
     * @name onHide
     */
    public onHide(): EventEmitter<Ng2Dropdown> {
        return this.dropdown.onHide;
    }

    /**
     * @name onItemClicked
     */
    public onItemClicked(): EventEmitter<string> {
        return this.dropdown.onItemClicked;
    }

    /**
     * @name selectedItem
     */
    public get selectedItem(): Ng2MenuItem {
        return this.dropdown.menu.state.dropdownState.selectedItem!;
    }

    /**
     * @name state
     */
    public get state(): any {
        return this.dropdown.menu.state;
    }

    /**
     *
     * @name show
     */
    public show = (): void => {
        const maxItemsReached = this.tagInput.items.length === this.tagInput.maxItems;
        const value = this.getFormValue();
        const hasMinimumText = value.trim().length >= this.minimumTextLength;
        const position = this.calculatePosition();
        const items = this.getMatchingItems(value);
        const hasItems = items.length > 0;
        const isHidden = this.isVisible === false;
        const showDropdownIfEmpty = this.showDropdownIfEmpty && hasItems && !value;
        const isDisabled = this.tagInput.disable;

        const shouldShow = isHidden && ((hasItems && hasMinimumText) || showDropdownIfEmpty || this.showDropdownAlways);
        const shouldHide = this.isVisible && !hasItems;

        if (this.flexibleMenuHeight) {
            const el: HTMLElement = this.dropdown.menu['element']['nativeElement']['children'][0];

            const totalHeight = items.length * this.dropdownMenuItemHeight;

            if (el.style.height) {
                el.style.cssText.replace(/(height\:)\s*[0-9]+(px|%)\s*(!important)?;?/i, '');
            }

            const newHeight = totalHeight < 400 ? (totalHeight + 10).toString() + 'px' : '100%';

            el.setAttribute('style', el.style.cssText + `height: ${newHeight} !important;`);
        }

        if (this.autocompleteObservable && hasMinimumText) {
            return this.getItemsFromObservable(value, this.autocompleteItems.length || 0, this.autocompleteObservableFetchLimit);
        }

        if ((!this.showDropdownIfEmpty && !value) || maxItemsReached || isDisabled) {
            return this.dropdown.hide();
        }

        this.setItems(items);

        if (shouldShow) {
            this.dropdown.show(position);
        } else if (shouldHide) {
            this.hide();
        }
    }

    /**
     * @name hide
     */
    public hide(): void {
        this.resetItems();
        this.dropdown.hide();
    }

    /**
     * @name scrollListener
     */
    @HostListener('window:scroll')
    public scrollListener(): void {
        if (!this.isVisible || !this.dynamicUpdate) {
            return;
        }

        this.updatePosition();
    }

    /**
     * @name onWindowBlur
     */
    @HostListener('window:blur')
    public onWindowBlur(): void {
        this.dropdown.hide();
    }

    /**
     * @name getFormValue
     */
    private getFormValue(): string {
        return this.tagInput.formValue.trim();
    }

    /**
     * @name calculatePosition
     */
    private calculatePosition(): ClientRect {
        return this.tagInput.inputForm.getElementPosition();
    }

    /**
     * @name requestAdding
     * @param item {Ng2MenuItem}
     */
    private requestAdding = async (item: Ng2MenuItem) => {
        const tag = this.createTagModel(item);
        await this.tagInput.onAddingRequested(true, tag).catch(() => {});
    }

    /**
     * @name createTagModel
     * @param item
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
     */
    private getMatchingItems(value: string): TagModel[] {
        if (!value && !this.showDropdownIfEmpty) {
            return [];
        }

        const dupesAllowed = this.tagInput.allowDupes;

        return this.autocompleteItems.filter((item: TagModel) => {
            const hasValue = dupesAllowed ? false : this.tagInput.tags.some(tag => {
                const identifyBy = this.tagInput.identifyBy;
                const model = typeof tag.model === 'string' ? tag.model : tag.model[identifyBy];

                return model === item[this.identifyBy];
            });

            return this.matchingFn(value, item) && (hasValue === false);
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
    private populateItems(data: any): this {
        const formattedItems = data.map(item => {
            return typeof item === 'string' ? {
                [this.displayBy]: item,
                [this.identifyBy]: item
            } : item;
        });

        this.autocompleteItems = this.autocompleteObservable
            ? [...this.autocompleteItems].concat(formattedItems)
            : formattedItems;

        return this;
    }

    /**
     * @name getItemsFromObservable
     * @param text
     */
    private getItemsFromObservable = (text: string, skip: number, limit: number): void => {
        this.setLoadingState(true);

        const subscribeFn = (data: any[]) => {
            // hide loading animation
            this.setLoadingState(false)
            // add items
                .populateItems(data);

            this.setItems(this.getMatchingItems(text));

            if (this.items.length) {
                this.dropdown.show(this.calculatePosition());
            } else if (!this.showDropdownIfEmpty && this.isVisible) {
                this.dropdown.hide();
            } else if (!this.showDropdownIfEmpty) {
                this.dropdown.hide();
            }
        };

        this.autocompleteObservable(text, skip, limit)
            .pipe(first())
            .subscribe(subscribeFn, () => this.setLoadingState(false));
    }

    /**
     * @name setLoadingState
     * @param state
     */
    private setLoadingState(state: boolean): this {
        this.tagInput.isLoading = state;

        return this;
    }
}
