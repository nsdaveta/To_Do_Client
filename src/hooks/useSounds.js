/**
 * Minimalist UI sound player for premium feel.
 * Uses synthesized beep tones to avoid external dependencies or large assets.
 */

const playTone = (frequency, duration, type = 'sine', volume = 0.1) => {
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
    // Upward chime
    playTone(523.25, 0.2); // C5
    setTimeout(() => playTone(659.25, 0.3), 100); // E5
};

export const playClickSound = () => {
    // Subtle tick
    playTone(800, 0.05, 'square', 0.05);
};

export const playDeleteSound = () => {
    // Downward zip
    playTone(400, 0.2, 'sine', 0.1);
    setTimeout(() => playTone(200, 0.3, 'sine', 0.05), 50);
};

export const playCompleteAllSound = () => {
    // Triad celebration
    playTone(523.25, 0.3); // C5
    setTimeout(() => playTone(659.25, 0.3), 100); // E5
    setTimeout(() => playTone(783.99, 0.5), 200); // G5
};
