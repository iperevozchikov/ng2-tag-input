"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function listen(listenerType, action, condition) {
    if (condition === void 0) { condition = true; }
    if (!this.listeners.hasOwnProperty(listenerType)) {
        throw new Error('The event entered may be wrong');
    }
    if (!condition) {
        return;
    }
    this.listeners[listenerType].push(action);
}
exports.listen = listen;
//# sourceMappingURL=listen.js.map