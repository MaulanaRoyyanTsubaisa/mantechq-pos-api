import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  Bell,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChartColumn,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Download,
  FileText,
  Gift,
  HeartHandshake,
  HelpCircle,
  Home,
  Info,
  ListFilter,
  LayoutDashboard,
  Menu,
  Megaphone,
  MoreVertical,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Percent,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Tags,
  Trash2,
  Truck,
  Upload,
  Users,
  X,
} from 'lucide-react'
import { Button } from '../../shared/ui/Button.jsx'
import { Brand } from '../../shared/ui/Brand.jsx'
import { cn } from '../../shared/lib/cn.js'
import { sidebarGroups, topTabs, moreMenu, itemLabel, itemChildren, flattenItems } from '../modules/moduleBlueprints.js'

function Sidebar({ activePage, openGroup, setOpenGroup, setActivePage, isOpen, setIsOpen, activeOutlet }) {
  const [openNested, setOpenNested] = useState('Laporan Penjualan')
  const choose = (group, child) => {
    const nextPage = child || group.label
    setActivePage(nextPage)
    setOpenGroup(group.children.length || group.label === 'Menu Favorit' ? group.label : '')
    if (window.innerWidth < 900) setIsOpen(false)
    toast.success(`${nextPage} dibuka`)
  }

  return (
    <>
      <div className={cn('mobile-scrim', isOpen && 'show')} onClick={() => setIsOpen(false)} />
      <aside className={cn('sidebar', isOpen && 'open')}>
        <div className="sidebar-head">
          <Brand />
          <Button variant="ghost" className="mobile-close" onClick={() => setIsOpen(false)} aria-label="Tutup menu">
            <X size={18} />
          </Button>
        </div>

        <div className="outlet-switch">
          <button type="button" className="outlet-btn" onClick={() => toast.info(`Outlet aktif: ${activeOutlet}`)}>
            <Store size={30} />
            <span>
              <small>Outlet</small>
              {activeOutlet}
            </span>
          </button>
          <button type="button" className="sidebar-collapse-btn" onClick={() => setIsOpen((v) => !v)} aria-label="Toggle menu">
            <PanelLeftClose size={18} />
          </button>
        </div>

        <nav className="side-nav" aria-label="Navigasi utama">
          {sidebarGroups.map((group) => {
            const Icon = group.icon
            const expanded = openGroup === group.label
            const flatChildren = flattenItems(group.children)
            const active = activePage === group.label || flatChildren.includes(activePage)
            const hasCaret = group.children.length || group.label === 'Menu Favorit'
            return (
              <section key={group.label}>
                <button
                  className={cn('side-item', active && 'active', expanded && 'expanded')}
                  onClick={() => {
                    if (group.children.length) {
                      setOpenGroup(expanded ? '' : group.label)
                      return
                    }
                    choose(group)
                  }}
                >
                  <Icon size={19} />
                  <span>{group.label}</span>
                  {hasCaret ? <ChevronDown className={cn('chevron', expanded && 'rotate')} size={17} /> : null}
                </button>
                {group.children.length && expanded ? (
                  <div className="submenu expanded">
                    {group.children.map((child) => {
                      const label = itemLabel(child)
                      const nested = itemChildren(child)
                      const nestedActive = nested.includes(activePage)
                      const nestedOpen = openNested === label || nestedActive
                      if (!nested.length) {
                        return (
                          <button key={label} className={cn(activePage === label && 'selected')} onClick={() => choose(group, label)}>
                            {label}
                          </button>
                        )
                      }
                      return (
                        <div key={label} className="submenu-group">
                          <button
                            className={cn((activePage === label || nestedActive) && 'selected')}
                            onClick={() => setOpenNested(nestedOpen ? '' : label)}
                          >
                            <span>{label}</span>
                            <ChevronDown className={cn('chevron', nestedOpen && 'rotate')} size={14} />
                          </button>
                          {nestedOpen ? (
                            <div className="nested-submenu">
                              {nested.map((grandchild) => (
                                <button
                                  key={grandchild}
                                  className={cn(activePage === grandchild && 'selected')}
                                  onClick={() => choose(group, grandchild)}
                                >
                                  {grandchild}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                ) : null}
              </section>
            )
          })}
        </nav>

        <button className="care-card" onClick={() => toast.info('TripleSys Care siap membantu 24 jam')}>
          <span className="care-logo">
            <HelpCircle size={19} /> Care
          </span>
          <strong>Chat 24 Jam</strong>
        </button>
      </aside>
    </>
  )
}

function Topbar({ activeTab, setActiveTab, setIsOpen, onSignOut }) {
  const [showMore, setShowMore] = useState(false)
  return (
    <header className="topbar">
      <Button variant="ghost" className="hamburger" onClick={() => setIsOpen(true)} aria-label="Buka menu">
        <Menu size={21} />
      </Button>
      <div className="top-tabs" role="tablist" aria-label="Modul">
        {topTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.label}
              className={cn(activeTab === tab.label && 'active')}
              role="tab"
              aria-selected={activeTab === tab.label}
              onClick={() => setActiveTab(tab.label)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <div className="more-wrap">
        <Button variant="ghost" className="capital-pill" onClick={() => setShowMore((value) => !value)} aria-expanded={showMore}>
          <span>Lainnya |</span>
          <CircleDollarSign size={20} />
          <strong>Dana Siap Pakai</strong>
          <ChevronDown size={15} />
        </Button>
        {showMore ? (
          <div className="dropdown">
            {moreMenu.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setShowMore(false)
                  toast.info(`${item} dipilih`)
                }}
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="top-actions">
        <Button variant="ghost" aria-label="Cari">
          <Search size={19} />
        </Button>
        <Button variant="ghost" className="notif" aria-label="Notifikasi" onClick={() => toast('Tidak ada notifikasi baru')}>
          <Bell size={19} />
        </Button>
        <button className="account" onClick={() => toast.info('Software House - royyan')}>
          <span>SH</span>
          <strong>Software House</strong>
          <small>royyan</small>
        </button>
        <Button variant="ghost" aria-label="Keluar akun" onClick={onSignOut}>
          <MoreVertical size={19} />
        </Button>
      </div>
    </header>
  )
}


export { Sidebar, Topbar }
