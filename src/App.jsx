import { useState, useEffect } from 'react'
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

  useEffect(() => {
    // Push a state so pressing browser Back doesn't exit
    window.history.pushState({ app: true }, '')

    function handlePopState() {
      // Push again to stay in the app
      window.history.pushState({ app: true }, '')
      // Treat as in-app back
      if (changingSpecialty) {
        setChangingSpecialty(false)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [changingSpecialty])

  function handleOnboardingDone(spec) {
    localStorage.setItem('specialty', spec)
    setSpecialty(spec)
    setChangingSpecialty(false)
  }

  function navigateTo(section, itemId) {
    if (section === 'drugs') setDrugInitId(itemId || null)
    if (section === 'icd') setIcdInitCode(itemId || null)
    setTab(section)
  }

  if (!specialty || changingSpecialty) {
    return (
      <Onboarding
        onDone={handleOnboardingDone}
        canBack={!!specialty}
        onBack={() => setChangingSpecialty(false)}
      />
    )
  }

  return (
    <>
      {tab === 'home'      && <Home onNavigate={navigateTo} specialty={specialty} onChangeSpecialty={() => setChangingSpecialty(true)} />}
      {tab === 'drugs'     && <Drugs key={drugInitId || 'list'} initialId={drugInitId} />}
      {tab === 'calc'      && <Calculators />}
      {tab === 'icd'       && <ICD10 key={icdInitCode || 'list'} initialCode={icdInitCode} />}
      {tab === 'cr'        && <ClinRecs />}
      {tab === 'favorites' && <Favorites onNavigate={navigateTo} />}
      <TabBar active={tab} onChange={setTab} />
    </>
  )
}
