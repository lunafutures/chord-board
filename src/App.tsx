import React, { JSX } from 'react';
import './App.css';
import { MidiNote } from './midi';
import { Chord, chords } from './chords';
import _ from 'lodash';
import { PolySynth, start, Synth, SynthOptions, now as toneNow } from 'tone';
import { MusicalRangeDefault, MusicalRangeMidiMaxDefault, MusicalRangeMidiMinDefault, MusicalRangeSlider, ThumbsToMoveDefault } from './stories/RangeSlider';
import { createTheme, ThemeProvider } from '@mui/material';
import { DB_DEFAULT_VOLUME, DbVolumeSlider } from './stories/DbVolumeSlider';
import { PreferSharpPicker } from './stories/PreferSharpPicker';
import { InactivityChecker } from './InactivityChecker';
import MobileDetect from 'mobile-detect';
import { useLocalStorage } from 'usehooks-ts';

const INACTIVITY_THRESHOLD = 5 * 60 * 1000;
const INITIAL_VOLUME = DB_DEFAULT_VOLUME;

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

interface ChordSettings {
    synth: ChordSynth;
    rangeLow: number;
    rangeHigh: number;
    preferSharp: boolean;
    rainbowMode: boolean;
    notDesktop: string | null;
    updateCurrent: (chord: string, hue: number) => void;
}

const ChordSettingsContext = React.createContext<ChordSettings>(null as unknown as ChordSettings);

type ChordSynth = PolySynth<Synth<SynthOptions>>;
function App(): JSX.Element {
    const [range, setRange] = useLocalStorage('range', MusicalRangeDefault);
    const [thumbsToMove, setThumbsToMove] = useLocalStorage('thumbs', ThumbsToMoveDefault);
    const [preferSharp, setPreferSharp] = useLocalStorage('prefer-sharp', false);
    const [volume, setVolume] = useLocalStorage('volume', INITIAL_VOLUME);
    const [rainbowMode, updateRainbowMode] = useLocalStorage<boolean>('rainbow-mode', false);

    const synth: ChordSynth = React.useMemo(() => new PolySynth({maxPolyphony: 100}).toDestination(), []);
    const mobileDetect = React.useMemo(() => new MobileDetect(window.navigator.userAgent), []);

    const [currentChord, updateCurrentChord] = React.useState<string | null>(null);
    const [currentHue, updateCurrentHue] = React.useState<number>(0);

    React.useEffect(() => {
        console.log(`Setting volume to ${volume} dB.`);
        synth.volume.value = volume;
    }, [synth.volume, volume]);

    return (
        <ThemeProvider theme={darkTheme}>
            <InactivityChecker thresholdMillis={INACTIVITY_THRESHOLD} />
            <div className="App">
                <div className="title-bar">
                    <div className="title">
                        Chord Board
                    </div>
                    <button
                        className={'rainbow-button ' + (rainbowMode ? 'rainbow-mode-on' : '')}
                        onClick={() => updateRainbowMode(prev => !prev)}
                        >
                        <div>Rainbow</div>
                        <div>Mode</div>
                    </button>
                </div>
                <div className="top-settings">
                    <span className="large-label volume-label">
                        Volume:
                    </span>
                    <div className="volume-bar">
                        <DbVolumeSlider
                            initial={volume}
                            onVolumeChanged={React.useCallback(setVolume, [setVolume])}
                            />
                    </div>
                    <div className="prefer-sharp-picker">
                        <PreferSharpPicker
                            initial={preferSharp}
                            onPreferSharpChanged={React.useCallback(setPreferSharp, [setPreferSharp])}
                            />
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
                            initialValues={range as [number, number]}
                            initialThumbsToMove={thumbsToMove}
                            preferSharp={preferSharp}
                            stylized={true}
                            valueLabelDisplay={'on'}
                            color={'primary'}
                            showMidiValues={true}
                            onThumbsChanged={React.useCallback(setThumbsToMove, [setThumbsToMove])}
                            onValuesChanged={React.useCallback((rangeStart, rangeEnd) => setRange([rangeStart, rangeEnd]), [setRange])}
                            ariaLabel='Note Range Picker'
                        />
                    </div>
                </div>
                <div>
                    <span
                        className={
                            'chord-name '
                            + ((currentChord === null) ? 'nothing-playing' :
                                (rainbowMode ? 'chord-name-colorful' : ''))}
                        style={{ '--current-chord-hue': currentHue } as React.CSSProperties}
                    >
                        {(currentChord === null) ? 'Nothing played yet.' : currentChord}
                    </span>
                </div>
                <ChordSettingsContext.Provider
                    value={{
                        synth,
                        rangeLow: range[0],
                        rangeHigh: range[1],
                        preferSharp,
                        rainbowMode,
                        notDesktop: mobileDetect.mobile() || mobileDetect.tablet(),
                        updateCurrent: (chord: string, hue: number) => {
                            updateCurrentChord(chord);
                            updateCurrentHue(hue);
                        },
                    }}>
                        <Chords sameRootRunsDown={true} />
                </ChordSettingsContext.Provider>
            </div>
        </ThemeProvider>
    );
}

function Chords(props: {sameRootRunsDown: boolean}): JSX.Element {
    const buttons: JSX.Element[] = [];
    _.range(0, 12).map((rootMidiValue, i) => {
        const hue = i * 30;
        return chords.map((chord, j) => {
            return buttons.push(
                <ChordButton
                    key={`${rootMidiValue}-${chord.name}`}
                    rootMidiValue={rootMidiValue}
                    chord={chord}
                    column={props.sameRootRunsDown ? i + 1 : j + 1}
                    row={props.sameRootRunsDown ? j + 1 : i + 1}
                    hue={hue}
                    />
            );
        });
    });
    
    return <div className="chord-grid" style={{display: 'grid'}}>
        {buttons}
    </div>;
}

const allOctaveSet = _.range(12, MusicalRangeMidiMaxDefault, 12);
function ChordButton(props: {
    rootMidiValue: number,
    chord: Chord,
    column: number,
    row: number,
    hue: number,
}): JSX.Element {
    const midiNote = new MidiNote(props.rootMidiValue);
    const settings = React.useContext(ChordSettingsContext);
    const rootString = midiNote.rootString(settings.preferSharp);
    const abbrChordName = `${rootString}${'\u200B'}${props.chord.abbreviation}`;
    const releaseIsPending = React.useRef(false);

    if (settings === null) {
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
            console.error('Audio initialization failed:', error);
            console.log('Reloading page...');
            window.location.reload();
        }

        settings.updateCurrent(`${rootString} ${props.chord.name}`, props.hue);
        const notes = _
            .flatMap(midiNote.withChord(props.chord), (value: number) => {
                return allOctaveSet.map(o => value + o);
            })
            .sort()
            .filter((value) => settings.rangeLow <= value && value < settings.rangeHigh)
            .map(value => noteStr(value));

        console.log(`Limiting to notes between ${noteStr(settings.rangeLow)} and ${noteStr(settings.rangeHigh)}`);
        console.log(`Playing notes: ${notes}`);
        settings.synth.releaseAll();

        if (settings.notDesktop) {
            // On mobile, we don't expect the user to hold the note.
            settings.synth.triggerAttackRelease(notes, '2n');
        } else {
            settings.synth.triggerAttack(notes);
        }

        if (releaseIsPending.current) {
            releaseNotes();
            releaseIsPending.current = false;
            console.log('Release of notes was still pending.');
        }
    }

    function mouseUp(): void {
        if (settings.notDesktop) return;

        releaseNotes();
        releaseIsPending.current = true;
    }

    function releaseNotes(): void {
        settings.synth.releaseAll(toneNow() + 0.3);
    }

    return (
        <button
            key={abbrChordName}
            className={'chord-button ' + (settings.rainbowMode ? 'chord-button-colorful' : '')}
            onMouseDown={mouseDown}
            onMouseUp={mouseUp}
            style={{
                gridColumnStart: props.column,
                gridRowStart: props.row,
                '--button-hue': props.hue,
            } as React.CSSProperties}>
            <span className='button-text'>
                {abbrChordName}
            </span>
        </button>
    );
}

export default App;
