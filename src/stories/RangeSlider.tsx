import React, { JSX } from 'react';

import './range-slider.css';
import { Button, Slider, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { A0_midi, C8_midi, midiToString } from '../midi';

export interface MusicalRangeSliderProps {
    midiMin: number,
    midiMax: number,
    /** Midi values of the initial note values.*/
    initialValues: [number, number],
    /** Shows notes as ♯ instead of ♭.*/
    preferSharp: boolean,
    /** Shows a # as a ♯, and b as a ♭.*/
    stylized: boolean,
    valueLabelDisplay: 'on' | 'auto' | 'off',
    color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
    ariaLabel: string,
    onValuesChanged: (event: Event, value: number | number[], activeThumb: number) => void,
}

export const MusicalRangeMidiMinDefault = A0_midi;
export const MusicalRangeMidiMaxDefault = C8_midi;

enum ThumbsToMove {
    One = "one",
    Both = "both",
}

const ThumbsToMoveDefault = ThumbsToMove.Both;

function coerce(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
}

/** A slider that selects two musical notes. */
export function MusicalRangeSlider({
    midiMin = MusicalRangeMidiMinDefault,
    midiMax = MusicalRangeMidiMaxDefault,
    initialValues,
    preferSharp,
    stylized = true,
    valueLabelDisplay,
    color,
    onValuesChanged,
    ariaLabel = "Musical Range Slider",
}: MusicalRangeSliderProps): JSX.Element {
    const [values, setValues] = React.useState(initialValues);
    const [thumbsToMove, setThumbsToMove] = React.useState(ThumbsToMoveDefault);
    return (
        <div className="range-slider-container">
            <Slider
                min={midiMin}
                max={midiMax}
                getAriaLabel={() => ariaLabel}
                value={values}
                valueLabelFormat={(value: number) => {
                    return `${midiToString(value, preferSharp, stylized)} (${value})`;
                }}
                onChange={function (event: Event, value: number | number[], activeThumb: number) {
                    if (value instanceof Array && value.length == 2) {
                        const [first, second] = value;
                        if (thumbsToMove == ThumbsToMove.Both) {
                            setValues(old => {
                                const [oldFirst, oldSecond] = old;
                                const delta = (activeThumb == 0)
                                    ? first - oldFirst
                                    : second - oldSecond;

                                const deltaUpperLimit = midiMax - Math.max(oldFirst, oldSecond);
                                const deltaLowerLimit = midiMin - Math.min(oldFirst, oldSecond);
                                const coercedDelta = coerce(delta, deltaLowerLimit, deltaUpperLimit);
                                return [oldFirst + coercedDelta, oldSecond + coercedDelta];
                            });
                        } else {
                            setValues([first, second]);
                        }
                        onValuesChanged(event, value, activeThumb);
                    }
                }}
                valueLabelDisplay={valueLabelDisplay}
                color={color}
            />

            <div className='range-slider-auxiliary-settings'>
                <ToggleButtonGroup
                    color={color}
                    value={thumbsToMove}
                    exclusive
                    onChange={(_event, newValue: ThumbsToMove) => {
                        setThumbsToMove(newValue);
                    }}
                    aria-label="Platform"
                >
                    <ToggleButton value={ThumbsToMove.One}>Move One</ToggleButton>
                    <ToggleButton value={ThumbsToMove.Both}>Move Both</ToggleButton>
                </ToggleButtonGroup>

                <Button variant="outlined" onClick={() => {
                    setThumbsToMove(ThumbsToMoveDefault);
                    setValues(initialValues);
                }}> Reset </Button>
            </div>
        </div>
    );
};
