import { Chord } from './chords';
import { MidiNote } from './midi';

class MidiTestCase {
    constructor(
        public inputValue: number,
        public preferSharp: boolean,
        public expectedString: string,
    ) { }
}

const midiTestCases: MidiTestCase[] = [
    new MidiTestCase(58, false, 'Bb3'),
    new MidiTestCase(58, true, 'A#3'),
    new MidiTestCase(60, true, 'C4'),
    new MidiTestCase(61, false, 'Db4'),
    new MidiTestCase(61, true, 'C#4'),
    new MidiTestCase(62, false, 'D4'),
    new MidiTestCase(62, true, 'D4'),
    new MidiTestCase(72, true, 'C5'),
];

describe('midi standard tests', () => {
    test.each(midiTestCases)('midi value $inputValue should create string $expectedString', ({ inputValue, preferSharp, expectedString }) => {
        expect(new MidiNote(inputValue).toString(preferSharp))
            .toStrictEqual(expectedString);
    });

    test('midi root only', () => {
        expect(new MidiNote(60).rootString(true)).toBe('C');
        expect(new MidiNote(65).rootString(true)).toBe('F');
    });

    test('with chord', () => {
        const note = new MidiNote(100);
        const testChord: Chord = {
            name: 'Test Chord',
            abbreviation: 'test',
            formula: [-1, 0, 9],
            intervals: [],
        };
        expect(note.withChord(testChord)).toEqual([99, 100, 109]);
    });
});