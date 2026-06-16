'use client'
import React, { useState } from 'react'

export function OnboardingOverlay({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0)
  
  const STEPS = [
    {
      img: '/kapri-avatar.png',
      title: 'Meet Kapri',
      desc: 'Your AI personal shopper. Just tell Kapri who you are shopping for and what your budget is, in English, Sinhala, or Singlish!'
    },
    {
      img: '/compare_gifts.png',
      title: 'Find the Perfect Gift',
      desc: 'Kapri instantly searches Kapruka, compares products side-by-side, and negotiates budget-friendly alternatives.'
    },
    {
      img: '/fast_delivery.png',
      title: 'Instant Checkout',
      desc: 'Place your order and track delivery directly in the chat. No complicated forms or redirection needed!'
    }
  ]

  const nextStep = () => {
    if (step < STEPS.length - 1) setStep(step + 1)
    else onFinish()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(36,21,68,0.65)', backdropFilter: 'blur(8px)', animation: 'kapri-fade-in 0.4s var(--ease-out)'
    }}>
      <div className="kapri-modal" style={{
        width: '90%', maxWidth: 400, background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        boxShadow: 'var(--shadow-xl)', position: 'relative', overflow: 'hidden'
      }}>
        
        {/* Animated content container */}
        <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'kapri-up 0.4s var(--ease-out)' }}>
          <img 
            src={STEPS[step].img} 
            alt={STEPS[step].title} 
            style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: '50%', marginBottom: 16, border: '4px solid var(--purple-100)', boxShadow: 'var(--shadow-md)' }} 
          />
          <h2 style={{ margin: '0 0 12px 0', color: 'var(--purple-700)', fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>{STEPS[step].title}</h2>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 15, lineHeight: 1.5 }}>{STEPS[step].desc}</p>
        </div>

        {/* Dots indicator */}
        <div style={{ display: 'flex', gap: 6, marginTop: 32, marginBottom: 24 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 6, height: 6, borderRadius: 3,
              background: i === step ? 'var(--purple-500)' : 'var(--line)',
              transition: 'all 0.3s var(--ease-out)'
            }} />
          ))}
        </div>

        <button onClick={nextStep} style={{
          width: '100%', padding: '14px 0', borderRadius: 'var(--radius-lg)', border: 'none',
          background: 'var(--purple-700)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
          transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(68,42,115,.25)'
        }}>
          {step === STEPS.length - 1 ? "Let's Shop! 🛍️" : "Next"}
        </button>
        
        {step < STEPS.length - 1 && (
          <button onClick={onFinish} style={{
            marginTop: 12, background: 'none', border: 'none', color: 'var(--muted)',
            fontSize: 14, cursor: 'pointer', fontWeight: 600
          }}>
            Skip Intro
          </button>
        )}
      </div>
    </div>
  )
}
