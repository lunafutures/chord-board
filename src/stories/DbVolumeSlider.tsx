import './db-volume-slider.css';
import { Stack, Slider } from "@mui/material";
import React, { JSX } from "react";

import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';

export interface DbVolumeSliderProps {
    min?: number;
    max?: number;
    initial?: number;
    onVolumeChanged: (newVolume: number) => void;
}

export const DB_DEFAULT_MIN_VOLUME = -40;
export const DB_DEFAULT_MAX_VOLUME = 20;
export const DB_DEFAULT_VOLUME = -6;

export function DbVolumeSlider({
    min = DB_DEFAULT_MIN_VOLUME,
    max = DB_DEFAULT_MAX_VOLUME,
    initial = DB_DEFAULT_VOLUME,
    onVolumeChanged,
}: DbVolumeSliderProps): JSX.Element {
    const [value, setValue] = React.useState(initial);
    return (
        <Stack
            className={'db-volume-slider-container'}
            spacing={2}
            direction="row"
            sx={{ alignItems: 'center', mb: 1 }}
            >
            <VolumeDown />
            <Slider
                min={min}
                max={max}
                valueLabelDisplay={'auto'}
                valueLabelFormat={(value: number) => `${value} dB`}
                value={value}
                onChange={(event, newValue) => {
                    if (typeof newValue !== 'number') return;

                    setValue(newValue);
                    onVolumeChanged(newValue);
                }}
                color={'secondary'}
                aria-label="Volume"
                />
            <VolumeUp />
        </Stack>
    );
}