import { countBy, replace, zip } from 'lodash';
import { Chord, chords } from './chords';

const intervalToFormula: Record<string, number> = {
    1: 0,
    2: 2,
    3: 4,
    4: 5,
    5: 7,
    6: 9,
    7: 11,
    8: 12,
    9: 14,
    10: 16,
    11: 17,
    12: 19,
    13: 21,
    14: 23,
};

function convertIntervalToOrdinal(interval: string): number {
    const charCounts = countBy(interval);
    const flats = charCounts['b'] ?? 0;
    const sharps = charCounts['#'] ?? 0;
    
    const justNumberString = replace(interval, /[#b]/g, '');
    const formulaValue: number = intervalToFormula[justNumberString];

    return formulaValue - flats + sharps;
}

describe('chords', () => {
    test.each(chords)('formula matches intervals', (chord: Chord) => {
        expect(chord.intervals.length).toEqual(chord.formula.length);
        zip(chord.intervals, chord.formula).forEach(([interval, ordinal]) => {
            if (interval === undefined) {
                fail(`interval was undefined (ordinal=${ordinal})`);
            } else if (ordinal === undefined) {
                fail(`ordinal was undefined (interval=${ordinal})`);
            } else {
                expect(convertIntervalToOrdinal(interval)).toEqual(ordinal);
            }
        });
    });
});