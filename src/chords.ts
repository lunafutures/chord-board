export interface Chord {
    name: string;
    abbreviation: string;
    formula: number[];
    intervals: string[];
}

export const chords: Chord[] = [
    // Essential Chords
    {
        name: "Major",
        abbreviation: "",
        formula: [0, 4, 7],
        intervals: ["1", "3", "5"]
    },
    {
        name: "Minor",
        abbreviation: "m",
        formula: [0, 3, 7],
        intervals: ["1", "b3", "5"]
    },
    {
        name: "Dominant 7",
        abbreviation: "7",
        formula: [0, 4, 7, 10],
        intervals: ["1", "3", "5", "b7"]
    },
    {
        name: "Major 7",
        abbreviation: "△7",
        formula: [0, 4, 7, 11],
        intervals: ["1", "3", "5", "7"]
    },
    {
        name: "Minor 7",
        abbreviation: "m7",
        formula: [0, 3, 7, 10],
        intervals: ["1", "b3", "5", "b7"]
    },

    // Highly Recommended Chords
    {
        name: "Diminished",
        abbreviation: "dim",
        formula: [0, 3, 6],
        intervals: ["1", "b3", "b5"]
    },
    {
        name: "Augmented",
        abbreviation: "+",
        formula: [0, 4, 8],
        intervals: ["1", "3", "#5"]
    },
    {
        name: "Sus2",
        abbreviation: "sus2",
        formula: [0, 2, 7],
        intervals: ["1", "2", "5"]
    },
    {
        name: "Sus4",
        abbreviation: "sus4",
        formula: [0, 5, 7],
        intervals: ["1", "4", "5"]
    },
    {
        name: "Minor 7♭5",
        abbreviation: "m7♭5",
        formula: [0, 3, 6, 10],
        intervals: ["1", "b3", "b5", "b7"]
    },
    {
        name: "Dominant 9",
        abbreviation: "9",
        formula: [0, 4, 7, 10, 14],
        intervals: ["1", "3", "5", "b7", "9"]
    },
    {
        name: "Minor 9",
        abbreviation: "m9",
        formula: [0, 3, 7, 10, 14],
        intervals: ["1", "b3", "5", "b7", "9"]
    },
    {
        name: "Major 9",
        abbreviation: "△9",
        formula: [0, 4, 7, 11, 14],
        intervals: ["1", "3", "5", "7", "9"]
    },
    {
        name: "Power",
        abbreviation: "5",
        formula: [0, 7],
        intervals: ["1", "5"]
    },

    // Advanced Chords
    {
        name: "Dominant 13",
        abbreviation: "13",
        formula: [0, 4, 7, 10, 14, 21],
        intervals: ["1", "3", "5", "b7", "9", "13"]
    },
    {
        name: "Minor 11",
        abbreviation: "m11",
        formula: [0, 3, 7, 10, 14, 17],
        intervals: ["1", "b3", "5", "b7", "9", "11"]
    },
    {
        name: "Major 11",
        abbreviation: "△11",
        formula: [0, 4, 7, 11, 14, 17],
        intervals: ["1", "3", "5", "7", "9", "11"]
    },
    {
        name: "7♯9",
        abbreviation: "7♯9",
        formula: [0, 4, 7, 10, 15],
        intervals: ["1", "3", "5", "b7", "#9"]
    },
    {
        name: "Diminished 7",
        abbreviation: "dim7",
        formula: [0, 3, 6, 9],
        intervals: ["1", "b3", "b5", "bb7"]
    },
    {
        name: "Add9",
        abbreviation: "add9",
        formula: [0, 4, 7, 14],
        intervals: ["1", "3", "5", "9"]
    },
    {
        name: "Sixth",
        abbreviation: "6",
        formula: [0, 4, 7, 9],
        intervals: ["1", "3", "5", "6"]
    },

    // Optional Chords
    {
        name: "7♭9",
        abbreviation: "7♭9",
        formula: [0, 4, 7, 10, 13],
        intervals: ["1", "3", "5", "b7", "b9"]
    },
    {
        name: "7♯5",
        abbreviation: "7♯5",
        formula: [0, 4, 8, 10],
        intervals: ["1", "3", "#5", "b7"]
    },
    {
        name: "Quartal",
        abbreviation: "quart",
        formula: [0, 5, 10],
        intervals: ["1", "4", "b7"]
    },
];