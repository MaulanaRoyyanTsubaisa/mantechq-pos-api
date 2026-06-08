import React, { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { Sidebar } from '../features/navigation/Sidebar.jsx'
import { Topbar } from '../features/navigation/Topbar.jsx'
import { TrialBar } from '../features/navigation/TrialBar.jsx'
import { MenuFavoritePage, SalesDashboard, TopModulePage } from '../features/dashboard/SalesDashboard.jsx'
import { ModulePage } from '../features/modules/ModulePage.jsx'
import { SetupFlow } from '../features/setup-flow/SetupFlow.jsx'
import { AuthPage, DataErrorPage, LoadingApp, NoMembershipPage } from '../features/auth/AuthPage.jsx'
import { useApiSession } from '../features/auth/useApiSession.js'
import { usePostgresPosData } from '../features/pos-data/usePostgresPosData.js'
import { defaultOutlets } from '../features/modules/moduleBlueprints.js'
import { shortId } from '../shared/lib/formatters.js'

function App() {
  const { session, loading: sessionLoading, setSession, signOut } = useApiSession()
  const [activeTab, setActiveTab] = useState('Penjualan')
  const [activePage, setActivePage] = useState('Dashboard')
  const [openGroup, setOpenGroup] = useState('Dashboard')
  const [isOpen, setIsOpen] = useState(false)
  const [activeFlow, setActiveFlow] = useState(null)
  const [outlets, setOutlets] = useState(defaultOutlets)
  const [activeOutlet, setActiveOutlet] = useState(defaultOutlets[0])
  const posData = usePostgresPosData(session)
  const isFavorite = activePage === 'Menu Favorit'
  const isDashboard = activePage === 'Dashboard'
  const addOutlet = (name) => {
    const cleanName = String(name || '').trim()
    if (!cleanName) return
    setOutlets((current) => (current.includes(cleanName) ? current : [cleanName, ...current]))
    setActiveOutlet(cleanName)
  }

  useEffect(() => {
    if (!posData.memberships.length) return
    const nextOutlets = ['Semua Outlet', ...posData.memberships.map((item) => `Outlet ${shortId(item.outlet_id || item.org_id)}`)]
    setOutlets(nextOutlets)
    setActiveOutlet(nextOutlets[1] || nextOutlets[0])
  }, [posData.memberships])

  if (sessionLoading) return <LoadingApp />
  if (!session) return <AuthPage onAuthenticated={setSession} />
  if (posData.loading) return <LoadingApp />
  if (posData.error) return <DataErrorPage error={posData.error} onRetry={posData.refresh} onSignOut={signOut} />
  if (!posData.memberships.length) return <NoMembershipPage session={session} onSignOut={signOut} />

  if (activeFlow) {
    return (
      <>
        <SetupFlow type={activeFlow} outlets={outlets} onOutletCreated={addOutlet} onClose={() => setActiveFlow(null)} posData={posData} session={session} />
        <Toaster richColors position="top-right" />
      </>
    )
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        openGroup={openGroup}
        setOpenGroup={setOpenGroup}
        setActivePage={setActivePage}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        activeOutlet={activeOutlet}
      />
      <div className="main-shell">
        <Topbar activeTab={activeTab} setActiveTab={setActiveTab} setIsOpen={setIsOpen} onSignOut={signOut} />
        {activeTab !== 'Penjualan' ? (
          <TopModulePage activeTab={activeTab} onStartFlow={setActiveFlow} />
        ) : isFavorite ? (
          <MenuFavoritePage onStartFlow={setActiveFlow} posData={posData} />
        ) : isDashboard ? (
          <SalesDashboard activeTab={activeTab} onStartFlow={setActiveFlow} posData={posData} />
        ) : (
          <ModulePage activePage={activePage} onStartFlow={setActiveFlow} posData={posData} />
        )}
        <TrialBar />
      </div>
      <Toaster richColors position="top-right" />
    </div>
  )
}


export { App }
