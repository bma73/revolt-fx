export declare enum EasingType {
    Linear = "linear",
    EaseInQuad = "easeInQuad",
    EaseOutQuad = "easeOutQuad",
    EaseInOutQuad = "easeInOutQuad",
    EaseInCubic = "easeInCubic",
    EaseOutCubic = "easeOutCubic",
    EaseInOutCubic = "easeInOutCubic",
    EaseInQuart = "easeInQuart",
    EaseOutQuart = "easeOutQuart",
    EaseInOutQuart = "easeInOutQuart",
    EaseInQuint = "easeInQuint",
    EaseOutQuint = "easeOutQuint",
    EaseInOutQuint = "easeInOutQuint",
    EaseInSine = "easeInSine",
    EaseOutSine = "easeOutSine",
    EaseInOutSine = "easeInOutSine",
    EaseInExpo = "easeInExpo",
    EaseOutExpo = "easeOutExpo",
    EaseInOutExpo = "easeInOutExpo",
    EaseInCirc = "easeInCirc",
    EaseOutCirc = "easeOutCirc",
    EaseInOutCirc = "easeInOutCirc",
    EaseInElastic = "easeInElastic",
    EaseOutElastic = "easeOutElastic",
    EaseInOutElastic = "easeInOutElastic",
    EaseInBack = "easeInBack",
    EaseOutBack = "easeOutBack",
    EaseInOutBack = "easeInOutBack",
    EaseInBounce = "easeInBounce",
    EaseOutBounce = "easeOutBounce",
    EaseInOutBounce = "easeInOutBounce"
}
export declare class Easing {
    static linear(t: number, b: number, c: number, d: number): number;
    static easeInQuad(t: number, b: number, c: number, d: number): number;
    static easeOutQuad(t: number, b: number, c: number, d: number): number;
    static easeInOutQuad(t: number, b: number, c: number, d: number): number;
    static easeInCubic(t: number, b: number, c: number, d: number): number;
    static easeOutCubic(t: number, b: number, c: number, d: number): number;
    static easeInOutCubic(t: number, b: number, c: number, d: number): number;
    static easeInQuart(t: number, b: number, c: number, d: number): number;
    static easeOutQuart(t: number, b: number, c: number, d: number): number;
    static easeInOutQuart(t: number, b: number, c: number, d: number): number;
    static easeInQuint(t: number, b: number, c: number, d: number): number;
    static easeOutQuint(t: number, b: number, c: number, d: number): number;
    static easeInOutQuint(t: number, b: number, c: number, d: number): number;
    static easeInSine(t: number, b: number, c: number, d: number): number;
    static easeOutSine(t: number, b: number, c: number, d: number): number;
    static easeInOutSine(t: number, b: number, c: number, d: number): number;
    static easeInExpo(t: number, b: number, c: number, d: number): number;
    static easeOutExpo(t: number, b: number, c: number, d: number): number;
    static easeInOutExpo(t: number, b: number, c: number, d: number): number;
    static easeInCirc(t: number, b: number, c: number, d: number): number;
    static easeOutCirc(t: number, b: number, c: number, d: number): number;
    static easeInOutCirc(t: number, b: number, c: number, d: number): number;
    static easeInElastic(t: number, b: number, c: number, d: number): number;
    static easeOutElastic(t: number, b: number, c: number, d: number): number;
    static easeInOutElastic(t: number, b: number, c: number, d: number): number;
    static easeInBack(t: number, b: number, c: number, d: number, s: number): number;
    static easeOutBack(t: number, b: number, c: number, d: number, s: number): number;
    static easeInOutBack(t: number, b: number, c: number, d: number, s: number): number;
    static easeInBounce(t: number, b: number, c: number, d: number): number;
    static easeOutBounce(t: number, b: number, c: number, d: number): number;
    static easeInOutBounce(t: number, b: number, c: number, d: number): number;
}
