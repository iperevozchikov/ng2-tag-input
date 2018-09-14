import { ControlValueAccessor } from '@angular/forms';
import { TagInputDropdown } from '../components/dropdown/tag-input-dropdown.component';
import { TagInputVirtualizedDropdown } from '../components/virtualized-dropdown/tag-input-virtualized-dropdown.component';
export declare class TagModelClass {
    [key: string]: any;
}
export declare type TagModel = string | TagModelClass;
export declare function isObject(obj: any): boolean;
export declare class TagInputAccessor implements ControlValueAccessor {
    private _items;
    private _onTouchedCallback;
    private _onChangeCallback;
    dropdown: TagInputDropdown | TagInputVirtualizedDropdown | undefined;
    displayBy: string;
    identifyBy: string;
    items: TagModel[];
    onTouched(): void;
    writeValue(items: any[]): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    getItemValue(item: TagModel, fromDropdown?: boolean): string;
    getItemDisplay(item: TagModel, fromDropdown?: boolean): string;
    protected getItemsWithout(index: number): TagModel[];
}
