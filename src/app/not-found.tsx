import Link from 'next/link'
import { Ico } from '@/components/ui/Icons'

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', width: '100%', background: 'var(--surface)', textAlign: 'center', padding: 20 }}>
      <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '4px solid #fff', background: '#fff', marginBottom: 24, animation: 'kapri-breathe 3.5s ease-in-out infinite' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/kapri-avatar.png" alt="Kapri Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.6)', transformOrigin: 'center 20%' }} />
      </div>
      <h1 className="sinhala-text" style={{ fontSize: 32, fontWeight: 800, color: 'var(--purple-700)', margin: '0 0 12px' }}>
        Oops! Page not found.
      </h1>
      <p className="sinhala-text" style={{ fontSize: 15, color: 'var(--muted)', maxWidth: 360, margin: '0 0 32px', lineHeight: 1.5 }}>
        Looks like you wandered off the map! Let's get you back to the shop so we can find the perfect gift.
      </p>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--purple-700)', color: '#fff', padding: '12px 24px', borderRadius: 999, textDecoration: 'none', fontWeight: 600, fontSize: 15, boxShadow: 'var(--shadow-md)', transition: 'transform 0.2s' }}>
        <Ico name="bag" size={18} color="var(--yellow-400)" />
        Back to Kapri
      </Link>
    </div>
  )
}
