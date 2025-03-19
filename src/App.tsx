import React, { JSX } from 'react';
import './App.css';
import { C3_midi, C5_midi, MidiNote } from './midi';
import { Chord, chords } from './chords';
import _ from 'lodash';
import { PolySynth, now as toneNow } from 'tone';
import { MusicalRangeMidiMaxDefault, MusicalRangeMidiMinDefault, MusicalRangeSlider } from './stories/RangeSlider';
import { resumeAudioContext } from './toneManager';
import { createTheme, ThemeProvider } from '@mui/material';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App(): JSX.Element {
    const initialRange: [number, number] = [C3_midi, C5_midi];
    const [range, setRange] = React.useState(initialRange);
    return (
        <ThemeProvider theme={darkTheme}>
            <div className="App">
                <MusicalRangeSlider
                    midiMin={MusicalRangeMidiMinDefault}
                    midiMax={MusicalRangeMidiMaxDefault}
                    initialValues={initialRange}
                    preferSharp={false}
                    stylized={true}
                    valueLabelDisplay={'on'}
                    color={'primary'}
                    showMidiValues={true}
                    onValuesChanged={(rangeStart, rangeEnd) => {
                        setRange([rangeStart, rangeEnd]);
                    }}
                    ariaLabel='Note Range Picker'
                    />
                <Chords
                    sameRootRunsDown={true}
                    rangeLow={range[0]}
                    rangeHigh={range[1]}
                    />
            </div>
        </ThemeProvider>
    );
}

function Chords(props: {sameRootRunsDown: boolean, rangeLow: number, rangeHigh: number}): JSX.Element {
    const buttons: JSX.Element[] = [];
    _.range(0, 12).map((rootMidiValue, i) => {
        chords.map((chord, j) => {
            buttons.push(
                <ChordButton
                    key={1}
                    rootMidiValue={rootMidiValue}
                    chord={chord}
                    preferSharp={true}
                    column={props.sameRootRunsDown ? i + 1 : j + 1}
                    row={props.sameRootRunsDown ? j + 1 : i + 1}
                    rangeLow={props.rangeLow}
                    rangeHigh={props.rangeHigh}
                    />);
        });
    });
    
    return <div className="chord-grid" style={{display: "grid"}}>
        {buttons}
    </div>;
}

const allOctaveSet = _.range(12, MusicalRangeMidiMaxDefault, 12);
function ChordButton(props: {
    rootMidiValue: number,
    chord: Chord,
    preferSharp: boolean,
    column: number,
    row: number,
    rangeLow: number,
    rangeHigh: number
}): JSX.Element {
    const midiNote = new MidiNote(props.rootMidiValue);
    const rootString = midiNote.rootString(props.preferSharp);
    const abbrChordName = `${rootString}${'\u200B'}${props.chord.abbreviation}`;
    const synth = React.useMemo(() => new PolySynth({maxPolyphony: 12}).toDestination(), []);

    function noteStr(value: number): string {
        return new MidiNote(value).toString(props.preferSharp);
    }

    async function mouseDown(): Promise<void> {
        const notes = _
            .flatMap(midiNote.withChord(props.chord), (value: number) => {
                return allOctaveSet.map(o => value + o);
            })
            .sort()
            .filter((value) => props.rangeLow <= value && value < props.rangeHigh)
            .map(value => noteStr(value));

        await resumeAudioContext();
        console.log(`Limiting to notes between ${noteStr(props.rangeLow)} and ${noteStr(props.rangeHigh)}`);
        console.log(`Playing notes: ${notes}`);
        synth.volume.value = -6;
        synth.triggerAttackRelease(notes, "1n");
    }

    function mouseUp(): void {
    }

    return (
        <button
            key={abbrChordName}
            className="chord-button"
            onMouseDown={mouseDown}
            onMouseUp={mouseUp}
            style={{
                gridColumnStart: props.column,
                gridRowStart: props.row,
            }}>
            <span className='button-text'>
                {abbrChordName}
            </span>
        </button>
    );
}

export default App;
