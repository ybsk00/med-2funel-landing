"use client";

import { useSoundEffect } from "./useSoundEffect";
import { haptic } from "@/lib/utils/haptics";
import { useCallback } from "react";

interface UseSensoryProps {
    soundUrl?: string;
    vibration?: 'light' | 'medium' | 'heavy' | 'none';
}

export function useSensoryInteraction({ soundUrl, vibration = 'light' }: UseSensoryProps) {
    const { playSound } = useSoundEffect();

    const handleHover = useCallback(() => {
        // Debounce logic could be added here if needed, 
        // but for lightweight interactions direct call is usually fine.
        haptic.light();
        if (soundUrl) {
            playSound(soundUrl, 0.2); // Low volume for hover
        }
    }, [playSound, soundUrl]);

    const handleClick = useCallback(() => {
        if (vibration === 'light') haptic.light();
        else if (vibration === 'medium') haptic.medium();
        else if (vibration === 'heavy') haptic.heavy();

        // Click sound could be different, but using same sound louder for now
        // or we could add a specific clickSoundUrl prop later.
        if (soundUrl) {
            playSound(soundUrl, 0.5);
        }
    }, [vibration, playSound, soundUrl]);

    return { handleHover, handleClick };
}
