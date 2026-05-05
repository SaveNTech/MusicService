import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { PlayerBar } from './PlayerBar'

export function Layout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg-base relative">
      {/* Aurora background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] animate-float-orb"
          style={{
            background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
            top: '-200px',
            left: '-100px',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06] animate-float-orb-slow"
          style={{
            background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
            top: '200px',
            right: '-150px',
            filter: 'blur(90px)',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05] animate-float-orb"
          style={{
            background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
            bottom: '100px',
            left: '40%',
            filter: 'blur(100px)',
            animationDelay: '-6s',
          }}
        />
      </div>

      {/* Main layout */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

      <div className="relative z-10">
        <PlayerBar />
      </div>
    </div>
  )
}
