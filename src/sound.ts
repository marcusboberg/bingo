let audioCtx: AudioContext | null = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (audioCtx) return audioCtx
  const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null
  audioCtx = new Ctx()
  return audioCtx
}

export async function playClickSound() {
  const ctx = getAudioContext()
  if (!ctx) return

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {
      return
    }
  }

  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.value = 520

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.15, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)

  osc.connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.2)
}
