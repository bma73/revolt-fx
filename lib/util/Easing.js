"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Easing = (function () {
    function Easing() {
    }
    Easing.linear = function (t, b, c, d) {
        return c * t / d + b;
    };
    Easing.easeInQuad = function (t, b, c, d) {
        return c * (t /= d) * t + b;
    };
    Easing.easeOutQuad = function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    };
    Easing.easeInOutQuad = function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        else {
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    };
    Easing.easeInCubic = function (t, b, c, d) {
        return c * (t /= d) * t * t + b;
    };
    Easing.easeOutCubic = function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    };
    Easing.easeInOutCubic = function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        }
        else {
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    };
    Easing.easeInQuart = function (t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    };
    Easing.easeOutQuart = function (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    };
    Easing.easeInOutQuart = function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        else {
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
    };
    Easing.easeInQuint = function (t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    };
    Easing.easeOutQuint = function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    };
    Easing.easeInOutQuint = function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        else {
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        }
    };
    Easing.easeInSine = function (t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    };
    Easing.easeOutSine = function (t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    };
    Easing.easeInOutSine = function (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };
    Easing.easeInExpo = function (t, b, c, d) {
        if (t === 0) {
            return b;
        }
        else {
            return c * Math.pow(2, 10 * (t / d - 1)) + b;
        }
    };
    Easing.easeOutExpo = function (t, b, c, d) {
        if (t === d) {
            return b + c;
        }
        else {
            return c * (-Math.pow(2, -10 * t / d) + 1) + b;
        }
    };
    Easing.easeInOutExpo = function (t, b, c, d) {
        if (t === 0) {
            b;
        }
        if (t === d) {
            b + c;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        else {
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    };
    Easing.easeInCirc = function (t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    };
    Easing.easeOutCirc = function (t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    };
    Easing.easeInOutCirc = function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        else {
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    };
    Easing.easeInElastic = function (t, b, c, d) {
        var a, p, s;
        s = 1.70158;
        p = 0;
        a = c;
        if (t === 0) {
            b;
        }
        else if ((t /= d) === 1) {
            b + c;
        }
        if (!p) {
            p = d * .3;
        }
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    };
    Easing.easeOutElastic = function (t, b, c, d) {
        var a, p, s;
        s = 1.70158;
        p = 0;
        a = c;
        if (t === 0) {
            b;
        }
        else if ((t /= d) === 1) {
            b + c;
        }
        if (!p) {
            p = d * .3;
        }
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    };
    Easing.easeInOutElastic = function (t, b, c, d) {
        var a, p, s;
        s = 1.70158;
        p = 0;
        a = c;
        if (t === 0) {
            b;
        }
        else if ((t /= d / 2) === 2) {
            b + c;
        }
        if (!p) {
            p = d * (.3 * 1.5);
        }
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        else {
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        }
    };
    Easing.easeInBack = function (t, b, c, d, s) {
        if (s === void 0) {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    };
    Easing.easeOutBack = function (t, b, c, d, s) {
        if (s === void 0) {
            s = 1.70158;
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    };
    Easing.easeInOutBack = function (t, b, c, d, s) {
        if (s === void 0) {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        else {
            return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
        }
    };
    Easing.easeInBounce = function (t, b, c, d) {
        var v;
        v = Easing.easeOutBounce(d - t, 0, c, d);
        return c - v + b;
    };
    Easing.easeOutBounce = function (t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        }
        else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
        }
        else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
        }
        else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
        }
    };
    Easing.easeInOutBounce = function (t, b, c, d) {
        var v;
        if (t < d / 2) {
            v = Easing.easeInBounce(t * 2, 0, c, d);
            return v * .5 + b;
        }
        else {
            v = Easing.easeOutBounce(t * 2 - d, 0, c, d);
            return v * .5 + c * .5 + b;
        }
    };
    return Easing;
}());
exports.Easing = Easing;
//# sourceMappingURL=Easing.js.map