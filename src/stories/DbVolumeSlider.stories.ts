import { Meta, StoryObj } from '@storybook/react';
import { DB_DEFAULT_MIN_VOLUME, DbVolumeSlider } from './DbVolumeSlider';

const meta = {
    title: 'Db Volume Slider',
    component: DbVolumeSlider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],

} satisfies Meta<typeof DbVolumeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultSlider: Story = {
    args: {
        onVolumeChanged: () => {},
    },
};

export const PositiveNegativeSlider: Story = {
    args: {
        min: DB_DEFAULT_MIN_VOLUME,
        max: 40,
        initial: 0,
        onVolumeChanged: () => {},
    },
};