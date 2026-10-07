import Header from './components/Header'
import Hero from './components/Hero'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className='flex flex-col gap-10 px-6 py-3 '>
      <Header />
      <Hero />
      <Footer />
    </div>
  )
}

export default App

