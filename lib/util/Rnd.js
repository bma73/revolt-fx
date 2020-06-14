"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rnd = void 0;
var Rnd = (function () {
    function Rnd() {
    }
    Rnd.float = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    Rnd.bool = function (chance) {
        if (chance === void 0) { chance = 0.5; }
        return Math.random() < chance;
    };
    Rnd.sign = function (chance) {
        if (chance === void 0) { chance = 0.5; }
        return Math.random() < chance ? 1 : -1;
    };
    Rnd.bit = function (chance) {
        if (chance === void 0) { chance = 0.5; }
        return Math.random() < chance ? 1 : 0;
    };
    Rnd.integer = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };
    return Rnd;
}());
exports.Rnd = Rnd;
//# sourceMappingURL=Rnd.js.map