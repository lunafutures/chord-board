import React, { JSX } from 'react';
import './App.css';
import { C3_midi, C5_midi, MidiNote } from './midi';
import { Chord, chords } from './chords';
import _ from 'lodash';
import { PolySynth, start, Synth, SynthOptions, now as toneNow } from 'tone';
import { MusicalRangeMidiMaxDefault, MusicalRangeMidiMinDefault, MusicalRangeSlider } from './stories/RangeSlider';
import { createTheme, ThemeProvider } from '@mui/material';
import { DB_DEFAULT_VOLUME, DbVolumeSlider } from './stories/DbVolumeSlider';
import { PreferSharpPicker } from './stories/PreferSharpPicker';

const INACTIVITY_THRESHOLD = 5 * 60 * 1000;
const INITIAL_VOLUME = DB_DEFAULT_VOLUME;

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

interface ChordSettings {
    synth: MySynth;
    rangeLow: number;
    rangeHigh: number;
    preferSharp: boolean;
}

const ChordSettingsContext = React.createContext<ChordSettings>(null as unknown as ChordSettings);

type MySynth = PolySynth<Synth<SynthOptions>>;
function App(): JSX.Element {
    const initialRange: [number, number] = [C3_midi, C5_midi];
    const [range, setRange] = React.useState(initialRange);
    const synth: MySynth = React.useMemo(() => new PolySynth({maxPolyphony: 100}).toDestination(), []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [preferSharp, setPreferSharp] = React.useState(false);
    const [volume, setVolume] = React.useState(INITIAL_VOLUME);

    React.useEffect(() => {
        console.log(`Setting volume to ${volume} dB.`);
        synth.volume.value = volume;
    }, [synth.volume, volume]);

    return (
        <ThemeProvider theme={darkTheme}>
            <InactivityChecker threshold={INACTIVITY_THRESHOLD} />
            <div className="App">
                <div className="title">
                    Chord Board
                </div>
                <div className="top-settings">
                    <span className="large-label volume-label">
                        Volume:
                    </span>
                    <div className="volume-bar">
                        <DbVolumeSlider initial={INITIAL_VOLUME} onVolumeChanged={(volume) => {
                            setVolume(volume);
                        }}/>
                    </div>
                    <div className="prefer-sharp-picker">
                        <PreferSharpPicker onPreferSharpChanged={setPreferSharp}/>
                    </div>
                </div>
                <div className="range-section">
                    <span className="large-label range-label">
                        Play chord notes between:
                    </span>
                    <div className="range-slider">
                        <MusicalRangeSlider
                            midiMin={MusicalRangeMidiMinDefault}
                            midiMax={MusicalRangeMidiMaxDefault}
                            initialValues={initialRange}
                            preferSharp={preferSharp}
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
                <ChordSettingsContext.Provider
                    value={{
                        synth,
                        rangeLow: range[0],
                        rangeHigh: range[1],
                        preferSharp: preferSharp,
                    }}>
                    <Chords sameRootRunsDown={true} />
                </ChordSettingsContext.Provider>
            </div>
        </ThemeProvider>
    );
}

function InactivityChecker(props: { threshold: number }): JSX.Element {
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

    return <></>;
}

function Chords(props: {sameRootRunsDown: boolean}): JSX.Element {
    const buttons: JSX.Element[] = [];
    _.range(0, 12).map((rootMidiValue, i) => {
        return chords.map((chord, j) => {
            return buttons.push(
                <ChordButton
                    key={`${rootMidiValue}-${chord.name}`}
                    rootMidiValue={rootMidiValue}
                    chord={chord}
                    column={props.sameRootRunsDown ? i + 1 : j + 1}
                    row={props.sameRootRunsDown ? j + 1 : i + 1}
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
    column: number,
    row: number,
}): JSX.Element {
    const midiNote = new MidiNote(props.rootMidiValue);
    const settings = React.useContext(ChordSettingsContext);
    const rootString = midiNote.rootString(settings.preferSharp);
    const abbrChordName = `${rootString}${'\u200B'}${props.chord.abbreviation}`;
    const releaseIsPending = React.useRef(false);

    if (settings == null) {
        return <></>;
    }

    function noteStr(value: number): string {
        return new MidiNote(value).toString(settings.preferSharp);
    }

    async function mouseDown(): Promise<void> {
        releaseIsPending.current = false;

        /* First check if we can actually play a sound or not.
         * For some reason, sometimes Tone.start() will actually NEVER resolve and
         * no sound can be played. In that case, refresh the page. */ 
        try {
            const timeoutPromise = new Promise((resolve, reject) =>
                setTimeout(() => reject(new Error('Audio startup timeout')), 500));

            await Promise.race([
                start(),
                timeoutPromise,
            ]);
        } catch (error) {
            console.error("Audio initialization failed:", error);
            console.log('Reloading page...');
            window.location.reload();
        }

        const notes = _
            .flatMap(midiNote.withChord(props.chord), (value: number) => {
                return allOctaveSet.map(o => value + o);
            })
            .sort()
            .filter((value) => settings.rangeLow <= value && value < settings.rangeHigh)
            .map(value => noteStr(value));

        console.log(`Limiting to notes between ${noteStr(settings.rangeLow)} and ${noteStr(settings.rangeHigh)}`);
        console.log(`Playing notes: ${notes}`);
        // TODO: Handle time differently if in mobile or desktop
        settings.synth.releaseAll();
        settings.synth.triggerAttack(notes);

        if (releaseIsPending.current) {
            releaseNotes();
            releaseIsPending.current = false;
            console.log("Release of notes was still pending.");
        }
    }

    function mouseUp(): void {
        releaseNotes();
        releaseIsPending.current = true;
    }

    function releaseNotes(): void {
        settings.synth.releaseAll(toneNow() + 0.3);
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
