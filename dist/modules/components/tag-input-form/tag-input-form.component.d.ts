import { EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
export declare class TagInputForm implements OnInit, OnChanges {
    onSubmit: EventEmitter<any>;
    onBlur: EventEmitter<any>;
    onFocus: EventEmitter<any>;
    onKeyup: EventEmitter<any>;
    onKeydown: EventEmitter<any>;
    inputTextChange: EventEmitter<string>;
    placeholder: string;
    validators: ValidatorFn[];
    asyncValidators: AsyncValidatorFn[];
    inputId: string;
    inputClass: string;
    tabindex: string;
    disabled: boolean;
    input: any;
    form: FormGroup;
    inputText: string;
    private readonly item;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    readonly value: FormControl;
    isInputFocused(): boolean;
    getErrorMessages(messages: {
        [key: string]: string;
    }): string[];
    hasErrors(): boolean;
    focus(): void;
    blur(): void;
    getElementPosition(): ClientRect;
    destroy(): void;
    onKeyDown($event: any): void;
    onKeyUp($event: any): void;
    submit($event: any): void;
}
