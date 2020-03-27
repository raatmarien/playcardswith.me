let uid = 0;

export function nextUID() : number {
    return uid++;
}

export function shuffle<T>(array: T[]) : T[] {
    // Fisher-Yates shuffle
    for (let i = 0; i < array.length - 1; i++) {
        let randomIndex: number
            = i + 1 + Math.floor(Math.random() * (array.length - i - 1));
        let temp = array[i];
        array[i] = array[randomIndex];
        array[randomIndex] = temp;
    }
    return array
}

export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
