let context: AudioContext | null = null

/** A soft four-note music-box arpeggio, synthesised so no audio file is needed. */
export function playChime(): void {
  context ??= new AudioContext()
  const ctx = context
  if (ctx.state === 'suspended') void ctx.resume()

  const master = ctx.createGain()
  master.gain.value = 0.22
  master.connect(ctx.destination)

  const notes = [659.25, 783.99, 1046.5, 1318.51] // E5 G5 C6 E6
  notes.forEach((frequency, index) => {
    const startAt = ctx.currentTime + 0.05 + index * 0.17
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, startAt)
    gain.gain.linearRampToValueAtTime(1, startAt + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, startAt + 1.4)
    gain.connect(master)

    // A sine for the body plus a quiet octave above for a bell-like shimmer.
    for (const [multiple, level] of [
      [1, 1],
      [2, 0.18]
    ]) {
      const osc = ctx.createOscillator()
      const partial = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = frequency * multiple
      partial.gain.value = level
      osc.connect(partial).connect(gain)
      osc.start(startAt)
      osc.stop(startAt + 1.5)
    }
  })
}
