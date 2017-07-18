"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
exports.animations = [
    core_1.trigger('flyInOut', [
        core_1.state('in', core_1.style({ transform: 'translateX(0)' })),
        core_1.transition(':enter', [
            core_1.animate(250, core_1.keyframes([
                core_1.style({ opacity: 0, offset: 0, transform: 'translate(0px, 20px)' }),
                core_1.style({ opacity: 0.3, offset: 0.3, transform: 'translate(0px, -10px)' }),
                core_1.style({ opacity: 0.5, offset: 0.5, transform: 'translate(0px, 0px)' }),
                core_1.style({ opacity: 0.75, offset: 0.75, transform: 'translate(0px, 5px)' }),
                core_1.style({ opacity: 1, offset: 1, transform: 'translate(0px, 0px)' })
            ]))
        ]),
        core_1.transition(':leave', [
            core_1.animate(150, core_1.keyframes([
                core_1.style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
                core_1.style({ opacity: 1, transform: 'translateX(-15px)', offset: 0.7 }),
                core_1.style({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 })
            ]))
        ])
    ])
];
//# sourceMappingURL=animations.js.map