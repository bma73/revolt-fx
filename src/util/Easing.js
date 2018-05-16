export class Easing {
    static linear(t, b, c, d) {
        return c * t / d + b;
    }
    static easeInQuad(t, b, c, d) {
        return c * (t /= d) * t + b;
    }
    static easeOutQuad(t, b, c, d) {
        console.log(arguments);
        return -c * (t /= d) * (t - 2) + b;
    }
    static easeInOutQuad(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        else {
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    }
    static easeInCubic(t, b, c, d) {
        return c * (t /= d) * t * t + b;
    }
    static easeOutCubic(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    }
    static easeInOutCubic(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        }
        else {
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    }
    static easeInQuart(t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    }
    static easeOutQuart(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    }
    static easeInOutQuart(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        else {
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
    }
    static easeInQuint(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    }
    static easeOutQuint(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    }
    static easeInOutQuint(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        else {
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        }
    }
    static easeInSine(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    }
    static easeOutSine(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    }
    static easeInOutSine(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }
    static easeInExpo(t, b, c, d) {
        if (t === 0) {
            return b;
        }
        else {
            return c * Math.pow(2, 10 * (t / d - 1)) + b;
        }
    }
    static easeOutExpo(t, b, c, d) {
        if (t === d) {
            return b + c;
        }
        else {
            return c * (-Math.pow(2, -10 * t / d) + 1) + b;
        }
    }
    static easeInOutExpo(t, b, c, d) {
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
    }
    static easeInCirc(t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    }
    static easeOutCirc(t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    }
    static easeInOutCirc(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        else {
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    }
    static easeInElastic(t, b, c, d) {
        let a, p, s;
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
    }
    static easeOutElastic(t, b, c, d) {
        let a, p, s;
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
    }
    static easeInOutElastic(t, b, c, d) {
        let a, p, s;
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
    }
    static easeInBack(t, b, c, d, s) {
        if (s === void 0) {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    }
    static easeOutBack(t, b, c, d, s) {
        if (s === void 0) {
            s = 1.70158;
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    }
    static easeInOutBack(t, b, c, d, s) {
        if (s === void 0) {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        else {
            return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
        }
    }
    static easeInBounce(t, b, c, d) {
        let v;
        v = Easing.easeOutBounce(d - t, 0, c, d);
        return c - v + b;
    }
    static easeOutBounce(t, b, c, d) {
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
    }
    static easeInOutBounce(t, b, c, d) {
        let v;
        if (t < d / 2) {
            v = Easing.easeInBounce(t * 2, 0, c, d);
            return v * .5 + b;
        }
        else {
            v = Easing.easeOutBounce(t * 2 - d, 0, c, d);
            return v * .5 + c * .5 + b;
        }
    }
}