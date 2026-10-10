import {useRef} from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Catalogue from './components/Catalogue'
import Footer from './components/Footer'

import './App.css'

function App() {
  const targetRef = useRef(null)

  const scrollToCommunities = () => {
    targetRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
  return (
    <div className='flex flex-col gap-10 '>
      <Header  onExploreClick={scrollToCommunities}/>
      <Hero onExploreClick={scrollToCommunities} />
      <Catalogue refProp={targetRef}/>
      <Footer />
    </div>
  )
}

export default App

