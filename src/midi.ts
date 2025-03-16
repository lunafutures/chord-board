export class MidiNote {
    constructor(public midiValue: number) { }

    toString(preferSharp: boolean): string {
        const rootValue = this.midiValue % 12
        const rootString = rootValueToString(rootValue, preferSharp)
        const octave = Math.floor(this.midiValue / 12) - 1

        return `${rootString}${octave}`
    }
}

function rootValueToString(value: number, preferSharp: boolean): string {
    switch(value) {
        case 0: return "C";
        case 1: return preferSharp ? "C#" : "Db";
        case 2: return "D";
        case 3: return preferSharp ? "D#" : "Eb";
        case 4: return "E";
        case 5: return "F";
        case 6: return preferSharp ? "F#" : "Gb";
        case 7: return "G";
        case 8: return preferSharp ? "G#" : "Ab";
        case 9: return "A";
        case 10: return preferSharp ? "A#" : "Bb";
        case 11: return "B";
        default:
            throw new RangeError(`Input value (${value}) must be between 0 and 11 inclusive.`)
    }
}