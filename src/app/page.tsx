import dynamic from 'next/dynamic'

const App = dynamic(() => import('@/components/App'), {
  ssr: false,
  loading: () => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
      height:'100dvh', background:'#fff' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/kapruka-logo.jpg" alt="Kapruka" style={{ height:40, width:'auto', borderRadius:8,
          animation:'pulse 1.5s ease-in-out infinite' }} />
        <span style={{ fontSize:13, color:'#999', fontWeight:500 }}>Loading Kapri…</span>
      </div>
    </div>
  ),
})

export default function Home() {
  return <App />
}
