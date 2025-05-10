"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchMenuItemDto = void 0;
const class_validator_1 = require("class-validator");
const create_menu_item_dto_1 = require("./create-menu-item.dto");
class SearchMenuItemDto {
    name;
    category;
    department;
    searchTerm;
}
exports.SearchMenuItemDto = SearchMenuItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchMenuItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchMenuItemDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(create_menu_item_dto_1.Department),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchMenuItemDto.prototype, "department", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchMenuItemDto.prototype, "searchTerm", void 0);
//# sourceMappingURL=search-menu-item.dto.js.map