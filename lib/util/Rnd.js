export class Rnd {
    static float(min, max) {
        return Math.random() * (max - min) + min;
    }
    static bool(chance = 0.5) {
        return Math.random() < chance;
    }
    static sign(chance = 0.5) {
        return Math.random() < chance ? 1 : -1;
    }
    static bit(chance = 0.5) {
        return Math.random() < chance ? 1 : 0;
    }
    static integer(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}
//# sourceMappingURL=Rnd.js.map