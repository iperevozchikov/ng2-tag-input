import { EventEmitter, Renderer2, OnInit, TemplateRef, QueryList, AfterViewInit } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { TagInputAccessor, TagModel } from '../../core';
import { TagInputForm, TagInputDropdown, TagInputVirtualizedDropdown, TagComponent } from '../../components';
export declare class TagInputComponent extends TagInputAccessor implements OnInit, AfterViewInit {
    private renderer;
    applyFocusOnClick: boolean;
    applyFocusOnAdd: boolean;
    applyFocusOnRemove: boolean;
    applyFocusOnLast: boolean;
    separatorKeys: string[];
    separatorKeyCodes: number[];
    placeholder: string;
    secondaryPlaceholder: string;
    maxItems: number;
    transform: (item: string) => string;
    validators: ValidatorFn[];
    asyncValidators: AsyncValidatorFn[];
    onlyFromAutocomplete: boolean;
    errorMessages: {
        [key: string]: string;
    };
    theme: string;
    onTextChangeDebounce: number;
    inputId: string;
    inputClass: string;
    clearOnBlur: string;
    hideForm: string;
    addOnBlur: boolean;
    addOnPaste: boolean;
    pasteSplitPattern: string;
    blinkIfDupe: boolean;
    removable: boolean;
    editable: boolean;
    allowDupes: boolean;
    modelAsStrings: boolean;
    trimTags: boolean;
    inputText: string;
    ripple: boolean;
    tabindex: string;
    disabled: any;
    dragZone: string;
    onRemoving: (tag: TagModel) => Observable<TagModel>;
    onAdding: (tag: TagModel) => Observable<TagModel>;
    onAdd: EventEmitter<TagModel>;
    onRemove: EventEmitter<TagModel>;
    onSelect: EventEmitter<TagModel>;
    onFocus: EventEmitter<string>;
    onBlur: EventEmitter<string>;
    onTextChange: EventEmitter<TagModel>;
    onPaste: EventEmitter<string>;
    onValidationError: EventEmitter<TagModel>;
    onTagEdited: EventEmitter<TagModel>;
    private _dropdown;
    private _virtualizedDropdown;
    templates: QueryList<TemplateRef<any>>;
    inputForm: TagInputForm;
    selectedTag: TagModel;
    isLoading: boolean;
    isDropping: boolean;
    isDragging: boolean;
    tags: QueryList<TagComponent>;
    private listeners;
    inputTextChange: EventEmitter<string>;
    inputTextValue: string;
    readonly tabindexAttr: string;
    readonly dropdown: TagInputDropdown | TagInputVirtualizedDropdown | undefined;
    constructor(renderer: Renderer2);
    onRemoveRequested(tag: TagModel, index: number): void;
    onAddingRequested(isFromAutocomplete: boolean, tag: TagModel, index?: any): void;
    isTagValid(tag: TagModel, fromAutocomplete?: boolean): boolean;
    appendTag: (tag: TagModel, index?: number) => void;
    createTag(model: TagModel): TagModel;
    selectItem(item: TagModel, emit?: boolean): void;
    fireEvents(eventName: string, $event?: any): void;
    handleKeydown(data: any): void;
    setInputValue(value: string): string;
    private getControl();
    focus(applyFocus?: boolean, displayAutocomplete?: boolean): void;
    blur(): void;
    hasErrors(): boolean;
    isInputFocused(): boolean;
    hasCustomTemplate(): boolean;
    switchNext(item: TagModel): void;
    switchPrev(item: TagModel): void;
    readonly maxItemsReached: boolean;
    readonly formValue: string;
    ngOnInit(): void;
    onDragStarted(event: DragEvent, index: number): void;
    onDragOver(event: DragEvent): void;
    onDragEnd(): void;
    onTagDropped(event: DragEvent, index: number): void;
    ngAfterViewInit(): void;
    onTagBlurred(changedElement: TagModel, index: number): void;
    trackBy(item: TagModel): string;
    private removeItem(tag, index);
    private addItem(fromAutocomplete?, item?, index?);
    private setupSeparatorKeysListener();
    private setUpKeypressListeners();
    private setUpInputKeydownListeners();
    private setUpOnPasteListener();
    private setUpTextChangeSubscriber();
    private setUpOnBlurSubscriber();
    private findDupe(tag, isFromAutocomplete);
    private onPasteCallback(data);
}
