import { useState, useEffect, useRef, useCallback } from 'react'
import TabBar from './components/TabBar'
import Home from './pages/Home'
import Drugs from './pages/Drugs'
import Calculators from './pages/Calculators'
import ICD10 from './pages/ICD10'
import Favorites from './pages/Favorites'
import ClinRecs from './pages/ClinRecs'
import Onboarding from './pages/Onboarding'
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

  const pushBack = useCallback((fn) => {
    backStackRef.current.push(fn)
    window.history.pushState({ app: true }, '')
  }, [])

  const popBack = useCallback(() => {
    if (backStackRef.current.length > 0) {
      const fn = backStackRef.current.pop()
      fn()
    }
  }, [])

  useEffect(() => {
    window.history.pushState({ app: true }, '')

    function handlePopState(e) {
      if (e.state?.app) {
        // Потребляем одну запись истории — вызываем обработчик из стека
        if (backStackRef.current.length > 0) {
          const fn = backStackRef.current.pop()
          fn()
        }
      } else {
        // Дошли до "дна" (запись без нашего state) — не выпускаем из приложения
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
  }

  function navigateTo(section, itemId) {
    backStackRef.current = []
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
      {tab === 'home'      && <Home onNavigate={navigateTo} specialty={specialty} onChangeSpecialty={() => { setChangingSpecialty(true); pushBack(() => setChangingSpecialty(false)) }} />}
      {tab === 'drugs'     && <Drugs key={drugInitId || 'list'} initialId={drugInitId} pushBack={pushBack} popBack={popBack} />}
      {tab === 'calc'      && <Calculators key={calcInitId || 'list'} initialId={calcInitId} pushBack={pushBack} popBack={popBack} />}
      {tab === 'icd'       && <ICD10 key={icdInitCode || 'list'} initialCode={icdInitCode} pushBack={pushBack} popBack={popBack} />}
      {tab === 'cr'        && <ClinRecs key={crInitId || 'list'} initialId={crInitId} />}
      {tab === 'favorites' && <Favorites onNavigate={navigateTo} />}
      <TabBar active={tab} onChange={newTab => { pushBack(() => setTab(tab)); setTab(newTab) }} />
    </>
  )
}
