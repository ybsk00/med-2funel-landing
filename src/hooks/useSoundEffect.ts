"use client";

import { useCallback, useEffect, useRef } from "react";

// Cache for preloaded audio objects
const audioCache: Record<string, HTMLAudioElement> = {};

export function useSoundEffect() {
    const playSound = useCallback((src: string, volume: number = 0.5) => {
        if (!src) return;

        try {
            // Use cached audio or create new
            let audio = audioCache[src];

            if (!audio) {
                audio = new Audio(src);
                audioCache[src] = audio;
            }

            // Reset and play
            audio.currentTime = 0;
            audio.volume = volume;

            // Clone node for overlapping sounds if needed, but for UI sound usually single instance per type is okay
            // For now, let's use the cached instance but handle the promise
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    // Auto-play was prevented
                    console.warn("Sound playback prevented:", error);
                });
            }
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    }, []);

    const preloadSound = useCallback((src: string) => {
        if (!src || audioCache[src]) return;
        const audio = new Audio(src);
        audioCache[src] = audio;
    }, []);

    return { playSound, preloadSound };
}
