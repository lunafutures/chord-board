import { getContext, start } from "tone";

export async function resumeAudioContext(): Promise<void> {
    if (!getContext()) return;

    console.log(`Current audio context state: ${getContext().state}`);

    if (getContext().state !== 'running') {
        try {
            await start();
            if (getContext().state !== 'running') {
                await getContext().resume();
            }
            console.log(`Audio context resumed. New state: ${getContext().state}`);
        } catch (e) {
            console.error("Failed to resume audio context:", e);
        }
    }
}