import { Meta, StoryObj } from '@storybook/react';
import { PreferSharpPicker } from './PreferSharpPicker';

const meta = {
    title: 'Prefer Sharp Picker',
    component: PreferSharpPicker,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],

} satisfies Meta<typeof PreferSharpPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultPicker: Story = {
    args: {
        onPreferSharpChanged: () => {},
    },
};

export const SharpPicker: Story = {
    args: {
        initial: true,
        onPreferSharpChanged: () => {},
    },
};