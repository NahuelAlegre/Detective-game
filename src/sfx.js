let audioCtx = null;

function getContext() {
    if (typeof window === "undefined") return null;
    if (audioCtx) return audioCtx;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    audioCtx = new AudioContext();
    return audioCtx;
}

function playTone({ frequency = 440, duration = 0.12, type = "sine", volume = 0.15 }) {
    const ctx = getContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
        ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = volume;

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const end = ctx.currentTime + duration;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    oscillator.start();
    oscillator.stop(end);
}

function createNoiseBuffer(ctx) {
    const bufferSize = ctx.sampleRate * 2; // 2 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    return buffer;
}

let ambientSource = null;
let ambientGain = null;

export function playAmbientNoise(type = 'hum') {
    const ctx = getContext();
    if (!ctx) return;

    if (ambientSource) {
        ambientSource.stop();
        ambientSource = null;
    }

    const buffer = createNoiseBuffer(ctx);
    ambientSource = ctx.createBufferSource();
    ambientSource.buffer = buffer;
    ambientSource.loop = true;

    ambientGain = ctx.createGain();
    // Low pass filter to make it sound like hum or rain
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = type === 'rain' ? 800 : 150;

    ambientSource.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);
    
    ambientGain.gain.value = 0.02; // Very subtle
    ambientSource.start();
}

export function stopAmbientNoise() {
    if (ambientSource) {
        ambientSource.stop();
        ambientSource = null;
    }
}

function playSequence(tones = [], gapMs = 40) {
    tones.forEach((tone, index) => {
        setTimeout(() => playTone(tone), index * gapMs);
    });
}

export function playChoiceClick() {
    playTone({ frequency: 340, duration: 0.05, type: "triangle", volume: 0.16 });
}

export function playModalOpen() {
    playTone({ frequency: 240, duration: 0.08, type: "sine", volume: 0.12 });
}

export function playCombineSuccess() {
    playSequence([
        { frequency: 520, duration: 0.06, type: "square", volume: 0.14 },
        { frequency: 740, duration: 0.08, type: "triangle", volume: 0.12 },
    ]);
}

export function playCombineFail() {
    playTone({ frequency: 170, duration: 0.18, type: "sawtooth", volume: 0.16 });
}

export function playInspectSuccess() {
    playSequence([
        { frequency: 880, duration: 0.05, type: "sine", volume: 0.1 },
        { frequency: 1100, duration: 0.1, type: "sine", volume: 0.08 },
    ], 60);
}

export function playInspectFail() {
    playTone({ frequency: 150, duration: 0.1, type: "sawtooth", volume: 0.1 });
}

export function playEvidenceFound() {
    playSequence([
        { frequency: 440, duration: 0.1, type: "square", volume: 0.1 },
        { frequency: 554, duration: 0.1, type: "square", volume: 0.1 },
        { frequency: 659, duration: 0.2, type: "square", volume: 0.1 },
    ], 80);
}
