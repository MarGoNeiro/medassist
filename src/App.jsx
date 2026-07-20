import { useState, useEffect, useRef, useCallback } from 'react'
import TabBar from './components/TabBar'
import Home from './pages/Home'
import Drugs from './pages/Drugs'
import Calculators from './pages/Calculators'
import ICD10 from './pages/ICD10'
import Favorites from './pages/Favorites'
import ClinRecs from './pages/ClinRecs'
import Onboarding from './pages/Onboarding'
import Subscription from './pages/Subscription'
import './pages/Drugs.css'
import './pages/Calculators.css'
import './pages/ICD10.css'

export default function App() {
  const [tab, setTab] = useState('home')
  const [specialty, setSpecialty] = useState(() => localStorage.getItem('specialty') || '')
  const [changingSpecialty, setChangingSpecialty] = useState(false)
  const [drugInitId, setDrugInitId] = useState(null)
  const [icdInitCode, setIcdInitCode] = useState(null)
  const [calcInitId, setCalcInitId] = useState(null)
  const [crInitId, setCrInitId] = useState(null)
  const backStackRef = useRef([])
  const [canGoBack, setCanGoBack] = useState(false)

  const pushBack = useCallback((fn) => {
    backStackRef.current.push(fn)
    setCanGoBack(true)
    window.history.pushState({ app: true }, '')
  }, [])

  const popBack = useCallback(() => {
    if (backStackRef.current.length > 0) {
      const fn = backStackRef.current.pop()
      fn()
      setCanGoBack(backStackRef.current.length > 0)
    }
  }, [])

  useEffect(() => {
    window.history.pushState({ app: true }, '')

    function handlePopState(e) {
      if (e.state?.app) {
        if (backStackRef.current.length > 0) {
          const fn = backStackRef.current.pop()
          fn()
          setCanGoBack(backStackRef.current.length > 0)
        }
      } else {
        window.history.pushState({ app: true }, '')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function handleOnboardingDone(spec) {
    localStorage.setItem('specialty', spec)
    setSpecialty(spec)
    setChangingSpecialty(false)
    backStackRef.current = []
    setCanGoBack(false)
  }

  function navigateTo(section, itemId) {
    const prevTab = tab
    backStackRef.current = []
    // Позволяем вернуться обратно в раздел, из которого открыли карточку
    backStackRef.current.push(() => {
      setTab(prevTab)
      setCanGoBack(false)
    })
    setCanGoBack(true)
    window.history.pushState({ app: true }, '')
    if (section === 'drugs') setDrugInitId(itemId || null)
    if (section === 'icd')   setIcdInitCode(itemId || null)
    if (section === 'calc')  setCalcInitId(itemId || null)
    if (section === 'cr')    setCrInitId(itemId || null)
    setTab(section)
  }

  if (!specialty || changingSpecialty) {
    return (
      <Onboarding
        onDone={handleOnboardingDone}
        canBack={!!specialty}
        onBack={() => window.history.back()}
      />
    )
  }

  return (
    <>
      {tab === 'subscription' && <Subscription onBack={() => popBack()} />}
      {tab === 'home'      && <Home onNavigate={navigateTo} specialty={specialty} onChangeSpecialty={() => { setChangingSpecialty(true); pushBack(() => setChangingSpecialty(false)) }} onOpenSubscription={() => { pushBack(() => setTab('home')); setTab('subscription') }} />}
      {tab === 'drugs'     && <Drugs key={drugInitId || 'list'} initialId={drugInitId} pushBack={pushBack} popBack={popBack} />}
      {tab === 'calc'      && <Calculators key={calcInitId || 'list'} initialId={calcInitId} pushBack={pushBack} popBack={popBack} />}
      {tab === 'icd'       && <ICD10 key={icdInitCode || 'list'} initialCode={icdInitCode} pushBack={pushBack} popBack={popBack} />}
      {tab === 'cr'        && <ClinRecs key={crInitId || 'list'} initialId={crInitId} />}
      {tab === 'favorites' && <Favorites onNavigate={navigateTo} />}

      {canGoBack && (
        <button className="app-back-btn" onClick={popBack} aria-label="Назад">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
      )}

      <TabBar active={tab} onChange={newTab => { pushBack(() => setTab(tab)); setTab(newTab) }} />
    </>
  )
}
