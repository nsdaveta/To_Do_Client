/**
 * Minimalist UI sound player for premium feel.
 * Uses synthesized beep tones to avoid external dependencies.
 */
export const playTone = (frequency, duration, type = 'sine', volume = 0.1) => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.warn('Audio feedback blocked by browser:', e);
    }
};

export const playSuccessSound = () => {
    // Upward chime for build success
    playTone(523.25, 0.2); // C5
    setTimeout(() => playTone(659.25, 0.4), 100); // E5
};

export const playErrorSound = () => {
    // Low double-beep for build failure
    playTone(150, 0.3, 'square', 0.1);
    setTimeout(() => playTone(120, 0.4, 'square', 0.1), 150);
};

export const playStartSound = () => {
    // Subtle start tone
    playTone(440, 0.1);
};
