export class Rnd {
    public static float(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public static bool(chance: number = 0.5): boolean {
        return Math.random() < chance;
    }

    public static sign(chance: number = 0.5): number {
        return Math.random() < chance ? 1 : -1;
    }

    public static bit(chance: number = 0.5): number {
        return Math.random() < chance ? 1 : 0;
    }

    public static integer(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    }
}