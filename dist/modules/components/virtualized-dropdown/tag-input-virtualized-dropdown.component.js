"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ng2_material_dropdown_1 = require("ng2-material-dropdown");
var angular2_virtual_scroll_1 = require("angular2-virtual-scroll");
var components_1 = require("../../components");
require("rxjs/add/operator/map");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/mergeMap");
var TagInputVirtualizedDropdown = (function () {
    function TagInputVirtualizedDropdown(tagInput) {
        var _this = this;
        this.tagInput = tagInput;
        this.dropdownMenuItemHeight = 48;
        this.offset = '50 0';
        this.focusFirstElement = false;
        this.showDropdownIfEmpty = false;
        this.loadThresholdOfAutocompleteItems = 95;
        this.autocompleteObservableFetchLimit = 100;
        this.minimumTextLength = 1;
        this.displayBy = 'display';
        this.identifyBy = 'value';
        this.matchingFn = function (value, target) {
            var targetValue = target[_this.displayBy].toString();
            return targetValue && targetValue
                .toLowerCase()
                .indexOf(value.toLowerCase()) >= 0;
        };
        this.appendToBody = true;
        this.items = [];
        this._autocompleteItems = [];
        this.flexibleMenuHeight = false;
        this.show = function () {
            var value = _this.tagInput.inputForm.value.value.trim();
            var position = _this.tagInput.inputForm.getElementPosition();
            var items = _this.getMatchingItems(value);
            var hasItems = items.length > 0;
            var showDropdownIfEmpty = _this.showDropdownIfEmpty && hasItems && !value;
            var hasMinimumText = value.length >= _this.minimumTextLength;
            var assertions = [
                hasItems,
                _this.isVisible === false,
                hasMinimumText
            ];
            var showDropdown = (assertions.filter(function (item) { return item; }).length === assertions.length) ||
                showDropdownIfEmpty;
            var hideDropdown = _this.isVisible && (!hasItems || !hasMinimumText);
            _this.setItems(items);
            if (_this.flexibleMenuHeight) {
                var el = _this.dropdown.menu['element']['nativeElement']['children'][0];
                var totalHeight = items.length * _this.dropdownMenuItemHeight;
                if (el.style.height) {
                    el.style.cssText.replace(/(height\:)\s*[0-9]+(px|%)\s*(!important)?;?/i, '');
                }
                var newHeight = totalHeight < 400 ? (totalHeight + 10).toString() + 'px' : '100%';
                el.setAttribute('style', el.style.cssText + ("height: " + newHeight + " !important;"));
            }
            if (showDropdown && !_this.isVisible) {
                _this.dropdown.show(position);
            }
            else if (hideDropdown) {
                _this.dropdown.hide();
            }
        };
        this.requestAdding = function (item) {
            if (!item) {
                return;
            }
            var model = _this.createTagModel(item);
            _this.tagInput.onAddingRequested(true, model);
            _this.dropdown.hide();
        };
        this.resetItems = function () {
            _this.items = [];
            if (_this.autocompleteObservable) {
                _this.autocompleteItems = [];
            }
        };
        this.getItemsFromObservable = function (text, skip, limit) {
            _this.setLoadingState(true);
            _this.autocompleteObservable(text, skip, limit)
                .subscribe(function (data) {
                _this.setLoadingState(false)
                    .populateItems(data, skip > 0)
                    .show();
            }, function () { return _this.setLoadingState(false); });
        };
    }
    Object.defineProperty(TagInputVirtualizedDropdown.prototype, "autocompleteItems", {
        get: function () {
            var _this = this;
            var items = this._autocompleteItems;
            if (!items) {
                return [];
            }
            return items.map(function (item) {
                return typeof item === 'string' ? (_a = {},
                    _a[_this.displayBy] = item,
                    _a[_this.identifyBy] = item,
                    _a) : item;
                var _a;
            });
        },
        set: function (items) {
            this._autocompleteItems = items;
        },
        enumerable: true,
        configurable: true
    });
    TagInputVirtualizedDropdown.prototype.ngOnInit = function () {
        var _this = this;
        if (this.loadThresholdOfAutocompleteItems > 100 || this.loadThresholdOfAutocompleteItems < 0) {
            this.loadThresholdOfAutocompleteItems = 95;
        }
        this.onItemClicked()
            .subscribe(this.requestAdding);
        this.onHide()
            .subscribe(this.resetItems);
        this.tagInput.inputForm.onKeyup
            .subscribe(this.show);
        if (this.autocompleteObservable) {
            this.tagInput
                .onTextChange
                .filter(function (text) { return text.trim().length >= _this.minimumTextLength; })
                .subscribe(function (text) {
                return _this.getItemsFromObservable(text, 0, _this.autocompleteObservableFetchLimit);
            });
            if (this.totalOfItemsObservable) {
                this.vScroll
                    .end
                    .debounceTime(350)
                    .filter(function (e) {
                    var autocompleteItemsCount = _this.autocompleteItems.length - _this.tagInput.items.length;
                    var scrolled = Math.floor((e.end * 100) / autocompleteItemsCount);
                    return _this.autocompleteItems.length > 0
                        && scrolled >= _this.loadThresholdOfAutocompleteItems
                        && !_this.tagInput.isLoading;
                })
                    .flatMap(function (e) { return _this.totalOfItemsObservable(_this.tagInput.inputTextValue); })
                    .filter(function (total) { return _this.autocompleteItems.length < total; })
                    .subscribe(function () { return _this.getItemsFromObservable(_this.tagInput.inputTextValue, _this.autocompleteItems.length, _this.autocompleteObservableFetchLimit); });
            }
        }
        this.dropdown.onShow.subscribe(function () {
            setTimeout(function () { return _this.vScroll.refresh(); }, 150);
        });
    };
    TagInputVirtualizedDropdown.prototype.updatePosition = function () {
        var position = this.tagInput.inputForm.getElementPosition();
        this.dropdown.menu.updatePosition(position);
    };
    Object.defineProperty(TagInputVirtualizedDropdown.prototype, "isVisible", {
        get: function () {
            return this.dropdown.menu.state.menuState.isVisible;
        },
        enumerable: true,
        configurable: true
    });
    TagInputVirtualizedDropdown.prototype.onHide = function () {
        return this.dropdown.onHide;
    };
    TagInputVirtualizedDropdown.prototype.onItemClicked = function () {
        return this.dropdown.onItemClicked;
    };
    Object.defineProperty(TagInputVirtualizedDropdown.prototype, "selectedItem", {
        get: function () {
            return this.dropdown.menu.state.dropdownState.selectedItem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TagInputVirtualizedDropdown.prototype, "state", {
        get: function () {
            return this.dropdown.menu.state;
        },
        enumerable: true,
        configurable: true
    });
    TagInputVirtualizedDropdown.prototype.scrollListener = function () {
        if (!this.isVisible) {
            return;
        }
        this.updatePosition();
    };
    TagInputVirtualizedDropdown.prototype.createTagModel = function (item) {
        var display = typeof item.value === 'string' ? item.value : item.value[this.displayBy];
        var value = typeof item.value === 'string' ? item.value : item.value[this.identifyBy];
        return __assign({}, item.value, (_a = {}, _a[this.tagInput.displayBy] = display, _a[this.tagInput.identifyBy] = value, _a));
        var _a;
    };
    TagInputVirtualizedDropdown.prototype.getMatchingItems = function (value) {
        var _this = this;
        if (!value && !this.showDropdownIfEmpty) {
            return [];
        }
        return this.autocompleteItems.filter(function (item) {
            var hasValue = _this.tagInput.tags.some(function (tag) {
                var identifyBy = _this.tagInput.identifyBy;
                var model = typeof tag.model === 'string' ? tag.model : tag.model[identifyBy];
                return model === item[_this.identifyBy];
            });
            return _this.matchingFn(value, item) && hasValue === false;
        });
    };
    TagInputVirtualizedDropdown.prototype.setItems = function (items) {
        this.items = items;
    };
    TagInputVirtualizedDropdown.prototype.populateItems = function (data, concat) {
        var _this = this;
        var formattedItems = data.map(function (item) {
            return typeof item === 'string' ? (_a = {},
                _a[_this.displayBy] = item,
                _a[_this.identifyBy] = item,
                _a) : item;
            var _a;
        });
        this.autocompleteItems = concat ? this.autocompleteItems.slice().concat(formattedItems) : formattedItems;
        return this;
    };
    TagInputVirtualizedDropdown.prototype.setLoadingState = function (state) {
        this.tagInput.isLoading = state;
        return this;
    };
    return TagInputVirtualizedDropdown;
}());
__decorate([
    core_1.ViewChild(ng2_material_dropdown_1.Ng2Dropdown),
    __metadata("design:type", ng2_material_dropdown_1.Ng2Dropdown)
], TagInputVirtualizedDropdown.prototype, "dropdown", void 0);
__decorate([
    core_1.ViewChild(angular2_virtual_scroll_1.VirtualScrollComponent),
    __metadata("design:type", angular2_virtual_scroll_1.VirtualScrollComponent)
], TagInputVirtualizedDropdown.prototype, "vScroll", void 0);
__decorate([
    core_1.ContentChildren(core_1.TemplateRef),
    __metadata("design:type", core_1.QueryList)
], TagInputVirtualizedDropdown.prototype, "templates", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], TagInputVirtualizedDropdown.prototype, "dropdownMenuItemWidth", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TagInputVirtualizedDropdown.prototype, "dropdownMenuItemHeight", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], TagInputVirtualizedDropdown.prototype, "scrollbarWidth", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], TagInputVirtualizedDropdown.prototype, "scrollbarHeight", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TagInputVirtualizedDropdown.prototype, "offset", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TagInputVirtualizedDropdown.prototype, "focusFirstElement", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TagInputVirtualizedDropdown.prototype, "showDropdownIfEmpty", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Function)
], TagInputVirtualizedDropdown.prototype, "autocompleteObservable", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TagInputVirtualizedDropdown.prototype, "loadThresholdOfAutocompleteItems", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Function)
], TagInputVirtualizedDropdown.prototype, "totalOfItemsObservable", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TagInputVirtualizedDropdown.prototype, "autocompleteObservableFetchLimit", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TagInputVirtualizedDropdown.prototype, "minimumTextLength", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TagInputVirtualizedDropdown.prototype, "displayBy", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TagInputVirtualizedDropdown.prototype, "identifyBy", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Function)
], TagInputVirtualizedDropdown.prototype, "matchingFn", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TagInputVirtualizedDropdown.prototype, "appendToBody", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [Array])
], TagInputVirtualizedDropdown.prototype, "autocompleteItems", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], TagInputVirtualizedDropdown.prototype, "flexibleMenuHeight", void 0);
__decorate([
    core_1.HostListener('window:scroll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TagInputVirtualizedDropdown.prototype, "scrollListener", null);
TagInputVirtualizedDropdown = __decorate([
    core_1.Component({
        selector: 'tag-input-virtualized-dropdown',
        templateUrl: './tag-input-virtualized-dropdown.template.html',
        styles: ["\n        /deep/ ng2-dropdown-menu div.ng2-dropdown-menu {\n            overflow-y: hidden !important;\n            height: 100% !important;\n        }\n        \n        /deep/ ng2-dropdown-menu div.ng2-dropdown-menu__options-container {\n            height: inherit;\n        }\n    "]
    }),
    __param(0, core_1.Inject(core_1.forwardRef(function () { return components_1.TagInputComponent; }))),
    __metadata("design:paramtypes", [components_1.TagInputComponent])
], TagInputVirtualizedDropdown);
exports.TagInputVirtualizedDropdown = TagInputVirtualizedDropdown;
//# sourceMappingURL=tag-input-virtualized-dropdown.component.js.map