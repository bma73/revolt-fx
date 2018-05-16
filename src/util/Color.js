export class Color {
    constructor() {
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    setRgb(startRgb, targetRgb) {
        this.startRgb = this.rgb = startRgb;
        this.r = this.sR = (startRgb >> 16) & 0xff;
        this.g = this.sG = (startRgb >> 8) & 0xff;
        this.b = this.sB = startRgb & 0xff;
        this.targetRgb = targetRgb;
        this.dR = ((targetRgb >> 16) & 0xff) - this.r;
        this.dG = ((targetRgb >> 8) & 0xff) - this.g;
        this.dB = (targetRgb & 0xff) - this.b;
    }
    tween(ease, time, duration) {
        if (ease) {
            this.r = ease(time, this.sR, this.dR, duration);
            this.g = ease(time, this.sG, this.dG, duration);
            this.b = ease(time, this.sB, this.dB, duration);
        }
        else {
            time /= duration;
            this.r = this.dR * time + this.sR;
            this.g = this.dG * time + this.sG;
            this.b = this.dB * time + this.sB;
        }
        this.rgb = (this.r << 16) | (this.g << 8) | this.b;
        return this.rgb;
    }
}