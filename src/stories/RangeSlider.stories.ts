import { Meta, StoryObj } from "@storybook/react";
import { MusicalRangeMidiMaxDefault, MusicalRangeMidiMinDefault, MusicalRangeSlider } from "./RangeSlider";
import { C3_midi, C5_midi } from "../midi";

const meta = {
    title: 'Example/Musical Range Slider',
    component: MusicalRangeSlider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],

} satisfies Meta<typeof MusicalRangeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Slider: Story = {
    args: {
        midiMin: MusicalRangeMidiMinDefault,
        midiMax: MusicalRangeMidiMaxDefault,
        ariaLabel: "Musical Slider",
        initialValues: [C3_midi, C5_midi],
        preferSharp: true,
        stylized: true,
        valueLabelDisplay: 'on',
        color: 'primary',
        showMidiValues: true,
        onValuesChanged: () => {},
    },
};