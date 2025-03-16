import { MidiNote } from './midi';

class MidiTestCase {
    constructor(
        public inputValue: number,
        public preferSharp: boolean,
        public expectedString: string,
    ) { }
}

const midiTestCases: MidiTestCase[] = [
    new MidiTestCase(58, false, "Bb3"),
    new MidiTestCase(58, true, "A#3"),
    new MidiTestCase(60, true, "C4"),
    new MidiTestCase(61, false, "Db4"),
    new MidiTestCase(61, true, "C#4"),
    new MidiTestCase(62, false, "D4"),
    new MidiTestCase(62, true, "D4"),
    new MidiTestCase(72, true, "C5"),
];

describe('midi standard tests', () => {
    test.each(midiTestCases)('midi value to string', ({ inputValue, preferSharp, expectedString }) => {
        expect(new MidiNote(inputValue).toString(preferSharp))
            .toStrictEqual(expectedString);
    });
});