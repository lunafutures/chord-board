import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { JSX } from "react";

export interface PreferSharpPickerProps {
    initial?: boolean;
    onPreferSharpChanged: (preferSharp: boolean) => void;
}

const PREFER_SHARP_DEFAULT = false;

export function PreferSharpPicker({
    initial = PREFER_SHARP_DEFAULT,
    onPreferSharpChanged,
}: PreferSharpPickerProps): JSX.Element {
    const [preferSharp, setPreferSharp] = React.useState(initial);
    return (
        <ToggleButtonGroup
            value={preferSharp}
            color={'primary'}
            exclusive
            onChange={(_event, newValue: boolean | null) => {
                // Don't allow no value.
                if (newValue === null) return;

                setPreferSharp(newValue);
                onPreferSharpChanged(newValue);
            }}
            aria-label="Platform"
        >
            <ToggleButton value={true}>♯</ToggleButton>
            <ToggleButton value={false}>♭</ToggleButton>
        </ToggleButtonGroup>
    );
}