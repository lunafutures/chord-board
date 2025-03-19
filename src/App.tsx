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
    const range = React.useRef([NaN, NaN]);
    return (
        <ThemeProvider theme={darkTheme}>
            <div className="App">
                <MusicalRangeSlider
                    midiMin={MusicalRangeMidiMinDefault}
                    midiMax={MusicalRangeMidiMaxDefault}
                    initialValues={[C3_midi, C5_midi]}
                    preferSharp={false}
                    stylized={true}
                    valueLabelDisplay={'on'}
                    color={'primary'}
                    showMidiValues={true}
                    onValuesChanged={(rangeStart, rangeEnd) => {
                        range.current = [rangeStart, rangeEnd];
                    }}
                    ariaLabel='Note Range Picker'
                />
                <Chords sameRootRunsDown={true} />
            </div>
        </ThemeProvider>
    );
}

function Chords(props: {sameRootRunsDown: boolean}): JSX.Element {
    const buttons: JSX.Element[] = [];
    _.range(60, 72).map((rootMidiValue, i) => {
        chords.map((chord, j) => {
            buttons.push(
                <ChordButton
                    key={1}
                    rootMidiValue={rootMidiValue}
                    chord={chord}
                    preferSharp={true}
                    column={props.sameRootRunsDown ? i + 1 : j + 1}
                    row={props.sameRootRunsDown ? j + 1 : i + 1}
                    />);
        });
    });
    
    return <div className="chord-grid" style={{display: "grid"}}>
        {buttons}
    </div>;
}

function ChordButton(props: {
    rootMidiValue: number,
    chord: Chord,
    preferSharp: boolean,
    column: number,
    row: number,
}): JSX.Element {
    const midiNote = new MidiNote(props.rootMidiValue);
    const rootString = midiNote.rootString(props.preferSharp);
    const abbrChordName = `${rootString}${'\u200B'}${props.chord.abbreviation}`;
    const synth = React.useMemo(() => new PolySynth({maxPolyphony: 12}).toDestination(), []);

    async function mouseDown(): Promise<void> {
        console.log(`Down: ${rootString} ${props.chord.name}`);
        const notes = _.flatMap(midiNote.withChord(props.chord), (value: number) => {
            return [
                new MidiNote(value).toString(props.preferSharp),
            ];
        });
        await resumeAudioContext();
        console.log(`Should play notes: ${notes}`);
        synth.volume.value = -6;
        synth.triggerAttackRelease(notes, "4n", toneNow());
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
