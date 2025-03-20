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
            exclusive
            onChange={(_event, newValue: boolean) => {
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