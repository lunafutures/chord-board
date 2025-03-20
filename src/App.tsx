import React, { JSX } from 'react';
import './App.css';
import { C3_midi, C5_midi, MidiNote } from './midi';
import { Chord, chords } from './chords';
import _ from 'lodash';
import { PolySynth, Synth, SynthOptions, now as toneNow } from 'tone';
import { MusicalRangeMidiMaxDefault, MusicalRangeMidiMinDefault, MusicalRangeSlider } from './stories/RangeSlider';
import { resumeAudioContext } from './toneManager';
import { createTheme, ThemeProvider } from '@mui/material';

const INACTIVITY_THRESHOLD = 5 * 60 * 1000;

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

type MySynth = PolySynth<Synth<SynthOptions>>;
function App(): JSX.Element {
    const initialRange: [number, number] = [C3_midi, C5_midi];
    const [range, setRange] = React.useState(initialRange);
    const synth: MySynth = React.useMemo(() => new PolySynth({maxPolyphony: 100}).toDestination(), []);

    return (
        <ThemeProvider theme={darkTheme}>
            <InactivityChecker threshold={INACTIVITY_THRESHOLD}>
                <div className="App">
                    <div className="range-section">
                        <span className="large-label" style={{gridRowStart: 1, textAlign: 'left'}}>
                            Play chord notes between:
                        </span>
                        <div style={{gridRowStart: 2}}>
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
                        </div>
                    </div>
                    <Chords
                        sameRootRunsDown={true}
                        rangeLow={range[0]}
                        rangeHigh={range[1]}
                        synth={synth}
                    />
                </div>
            </InactivityChecker>
        </ThemeProvider>
    );
}

function InactivityChecker(props: { threshold: number, children: JSX.Element | JSX.Element[] }): JSX.Element {
    const visibilityChangeTimeRef = React.useRef<number | null>(null);

    React.useEffect(() => {
        function handleVisibilityChange(): void {
            if (document.hidden) {
                console.log(`Document is hidden at ${new Date(Date.now())}`);
                visibilityChangeTimeRef.current = Date.now();
            } else {
                console.log(`Document is visible at ${new Date(Date.now())}`);
                if (visibilityChangeTimeRef.current !== null) {
                    const inactivityDuration = Date.now() - visibilityChangeTimeRef.current;
                    console.log(`Document was hidden for ${inactivityDuration} ms.`);
                    if (inactivityDuration > props.threshold) {
                        console.log('Reloading page...');
                        window.location.reload();
                    }
                }
            }
        }
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return (): void => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    });

    return <>{props.children}</>;
}

function Chords(props: {sameRootRunsDown: boolean, rangeLow: number, rangeHigh: number, synth: MySynth}): JSX.Element {
    const buttons: JSX.Element[] = [];
    _.range(0, 12).map((rootMidiValue, i) => {
        chords.map((chord, j) => {
            buttons.push(
                <ChordButton
                    key={`${rootMidiValue}-${chord.name}`}
                    rootMidiValue={rootMidiValue}
                    chord={chord}
                    preferSharp={true}
                    column={props.sameRootRunsDown ? i + 1 : j + 1}
                    row={props.sameRootRunsDown ? j + 1 : i + 1}
                    rangeLow={props.rangeLow}
                    rangeHigh={props.rangeHigh}
                    synth={props.synth}
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
    rangeHigh: number,
    synth: MySynth,
}): JSX.Element {
    const midiNote = new MidiNote(props.rootMidiValue);
    const rootString = midiNote.rootString(props.preferSharp);
    const abbrChordName = `${rootString}${'\u200B'}${props.chord.abbreviation}`;

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
        // TODO: Handle time differently if in mobile or desktop
        props.synth.volume.value = -6;
        props.synth.releaseAll();
        props.synth.triggerAttack(notes);
    }

    function mouseUp(): void {
        props.synth.releaseAll(toneNow() + 0.3);
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
