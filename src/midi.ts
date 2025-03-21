import { Chord } from './chords';
import _ from 'lodash';

// There are two midi standards. This file uses the standard where C4 is middle C (instead of C3).
export const A0_midi = 21;
export const C3_midi = 48;
export const C5_midi = 72;
export const C8_midi = 108;

export class MidiNote {
    constructor(public midiValue: number) { }

    toString(preferSharp: boolean, stylized: boolean = false): string {
        const octave = Math.floor(this.midiValue / 12) - 1;
        const combined = `${this.rootString(preferSharp)}${octave}`;
        if (stylized) {
            return combined;
        } else {
            return combined
                .replaceAll('♯', '#')
                .replaceAll('♭', 'b');
        }
    }

    rootString(preferSharp: boolean): string {
        const rootValue = this.midiValue % 12;
        return rootValueToString(rootValue, preferSharp);
    }

    withChord(chord: Chord): number[] {
        return _.map(chord.formula, (value) => {
            return value + this.midiValue;
        });
    }
}

export function midiToString(value: number, preferSharp: boolean, stylized: boolean = false): string {
    return new MidiNote(value).toString(preferSharp, stylized);
}

function rootValueToString(value: number, preferSharp: boolean): string {
    switch(value) {
        case 0: return 'C';
        case 1: return preferSharp ? 'C♯' : 'D♭';
        case 2: return 'D';
        case 3: return preferSharp ? 'D♯' : 'E♭';
        case 4: return 'E';
        case 5: return 'F';
        case 6: return preferSharp ? 'F♯' : 'G♭';
        case 7: return 'G';
        case 8: return preferSharp ? 'G♯' : 'A♭';
        case 9: return 'A';
        case 10: return preferSharp ? 'A♯' : 'B♭';
        case 11: return 'B';
        default:
            throw new RangeError(`Input value (${value}) must be between 0 and 11 inclusive.`);
    }
}