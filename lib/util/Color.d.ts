export declare class Color {
    r: number;
    g: number;
    b: number;
    sR: number;
    sG: number;
    sB: number;
    dR: number;
    dG: number;
    dB: number;
    rgb: number;
    startRgb: number;
    targetRgb: number;
    constructor();
    setRgb(startRgb: number, targetRgb: number): void;
    tween(ease: Function, time: number, duration: number): number;
}
