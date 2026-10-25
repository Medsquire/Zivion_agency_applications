import React, { useState, useEffect, useRef } from 'react';
import './AudioVoicePlayer.css';
import {
  SlimPlay,
  SlimPause,
  SlimHeadphones,
  SlimVolume2,
  SlimMic,
} from './SlimIcons';

// Web Audio sound synthesizer for realistic audio playback without external assets
class SyntheticAudioPlayer {
  constructor() {
    this.ctx = null;
    this.osc = null;
    this.gain = null;
    this.filter = null;
    this.intervalId = null;
  }

  start(sampleType = 'voice', onTick, onComplete) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.gain = this.ctx.createGain();
      this.gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'bandpass';
      this.filter.frequency.setValueAtTime(650, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

      this.osc = this.ctx.createOscillator();
      this.osc.type = sampleType === 'sparking-noise' ? 'sawtooth' : 'triangle';
      this.osc.frequency.setValueAtTime(280, this.ctx.currentTime);

      // Modulate frequency slightly to mimic speech cadence
      let step = 0;
      this.intervalId = setInterval(() => {
        if (!this.osc || !this.ctx) return;
        step += 1;
        const freqs = [280, 340, 260, 420, 310, 380, 240, 300];
        const nextFreq = freqs[step % freqs.length];
        try {
          this.osc.frequency.setTargetAtTime(nextFreq, this.ctx.currentTime, 0.08);
        } catch (e) {
          // ignore
        }
      }, 180);

      this.osc.connect(this.filter);
      this.filter.connect(this.gain);
      this.gain.connect(this.ctx.destination);
      this.osc.start();
    } catch (err) {
      console.warn('AudioContext not permitted or supported:', err);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.gain && this.ctx) {
      try {
        this.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.04);
      } catch (e) {}
    }
    setTimeout(() => {
      if (this.osc) {
        try {
          this.osc.stop();
          this.osc.disconnect();
        } catch (e) {}
        this.osc = null;
      }
      if (this.ctx && this.ctx.state !== 'closed') {
        try {
          this.ctx.close();
        } catch (e) {}
      }
      this.ctx = null;
    }, 60);
  }
}

export default function AudioVoicePlayer({
  audio,
  compact = false,
  onRecordNew,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSec, setProgressSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef(null);
  const timerRef = useRef(null);

  const durationSec = (audio && audio.durationSeconds) || 42;
  const sampleType = (audio && audio.sampleType) || 'voice';

  // Toggle play/pause
  const togglePlay = (e) => {
    if (e) e.stopPropagation();

    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const startPlayback = () => {
    setIsPlaying(true);
    if (!playerRef.current) {
      playerRef.current = new SyntheticAudioPlayer();
    }
    if (!isMuted) {
      playerRef.current.start(sampleType);
    }

    timerRef.current = setInterval(() => {
      setProgressSec((prev) => {
        if (prev >= durationSec) {
          stopPlayback();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (playerRef.current) playerRef.current.stop();
    };
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!audio) {
    return (
      <div className="svc-audio-none-box">
        <SlimHeadphones size={15} style={{ color: '#94A3B8' }} />
        <span>No voice memo attached to this Work Order</span>
        {onRecordNew && (
          <button
            type="button"
            className="svc-audio-record-btn"
            onClick={onRecordNew}
          >
            <SlimMic size={13} />
            <span>+ Attach Voice Note</span>
          </button>
        )}
      </div>
    );
  }

  // Waveform heights
  const bars = [
    32, 54, 78, 45, 90, 65, 82, 100, 70, 48, 62, 85, 92, 58, 74, 40, 68, 88,
    55, 95, 76, 60, 84, 98, 52, 70, 86, 64, 42, 80, 94, 60, 72, 50, 66,
  ];

  // ── COMPACT INLINE PILL (Used in Table Rows and Kanban Cards) ──────
  if (compact) {
    return (
      <div
        className={`svc-audio-compact-pill ${isPlaying ? 'svc-audio-playing' : ''}`}
        onClick={togglePlay}
        title={`Listen to ${audio.title || 'voice complaint'} (${audio.duration || '0:42'})`}
        role="button"
        tabIndex={0}
      >
        <button
          type="button"
          className="svc-audio-compact-btn"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isPlaying ? <SlimPause size={10} /> : <SlimPlay size={10} />}
        </button>
        <SlimHeadphones size={12} className="svc-audio-headphone-icon" />
        <span className="svc-audio-compact-time">
          {isPlaying ? formatTime(progressSec) : audio.duration || '0:42'}
        </span>
        {isPlaying && (
          <span className="svc-audio-compact-pulse" aria-hidden="true">
            <span className="svc-mini-bar b1" />
            <span className="svc-mini-bar b2" />
            <span className="svc-mini-bar b3" />
          </span>
        )}
      </div>
    );
  }

  // ── FULL DOSSIER AUDIO PLAYER ──────────────────────────────────────
  const percent = Math.min(100, (progressSec / durationSec) * 100);

  return (
    <div className={`svc-audio-player-card ${isPlaying ? 'is-playing' : ''}`}>
      <div className="svc-audio-card-top">
        <div className="svc-audio-tag-badge">
          <SlimHeadphones size={13} />
          <span>RESIDENT VOICE COMPLAINT · AUDIO ATTACHMENT</span>
        </div>
        <div className="svc-audio-time-stamp">
          {audio.recordedAt || 'Recorded Today'}
        </div>
      </div>

      <div className="svc-audio-title-line">
        <h4 className="svc-audio-memo-title">
          {audio.title || 'Voice Note regarding Work Order Issue'}
        </h4>
        <span className="svc-audio-sender-tag">{audio.sender || 'Resident'}</span>
      </div>

      {/* Main Interactive Controls & Waveform */}
      <div className="svc-audio-waveform-row">
        <button
          type="button"
          className={`svc-audio-play-round ${isPlaying ? 'btn-pause' : 'btn-play'}`}
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause Audio Note' : 'Play Audio Note'}
        >
          {isPlaying ? <SlimPause size={16} /> : <SlimPlay size={16} />}
        </button>

        <div className="svc-audio-bars-container">
          <div className="svc-audio-bars-wrapper">
            {bars.map((h, idx) => {
              const barProgress = (idx / bars.length) * 100;
              const hasPlayed = barProgress <= percent;
              return (
                <div
                  key={idx}
                  className={`svc-audio-waveform-bar ${hasPlayed ? 'bar-played' : ''} ${
                    isPlaying && hasPlayed ? 'bar-animating' : ''
                  }`}
                  style={{
                    height: `${isPlaying ? Math.max(25, (h * (0.6 + Math.random() * 0.5))) : h}%`,
                  }}
                />
              );
            })}
          </div>

          <div
            className="svc-audio-progress-track"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newRatio = clickX / rect.width;
              setProgressSec(Math.floor(newRatio * durationSec));
            }}
          >
            <div
              className="svc-audio-progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="svc-audio-timer-display">
          <span className="svc-time-current">{formatTime(progressSec)}</span>
          <span className="svc-time-divider">/</span>
          <span className="svc-time-total">{audio.duration || formatTime(durationSec)}</span>
        </div>

        <button
          type="button"
          className={`svc-audio-vol-btn ${isMuted ? 'muted' : ''}`}
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          <SlimVolume2 size={15} />
        </button>
      </div>

      <div className="svc-audio-footer-bar">
        <span className="svc-audio-fmt-chip">AUDIO / WAV · 44.1 kHz · Resident Microphone</span>
        {onRecordNew && (
          <button
            type="button"
            className="svc-audio-add-reply-btn"
            onClick={onRecordNew}
          >
            <SlimMic size={12} />
            <span>Record Voice Directive for Techs</span>
          </button>
        )}
      </div>
    </div>
  );
}
