import { useEffect } from 'react'
import Header from './components/Header'
import SignUp from './composition/SignUp'
import Footer from './components/Footer'
import './App.css'

function App() {
  useEffect(() => {
    const body = document.body

    // Remove preload class after the page loads
    const timer = setTimeout(() => {
      body.classList.remove('is-preload')
    }, 100)

    const images = [
      ['images/bg01.jpg', 'center'],
      ['images/bg02.jpg', 'center'],
      ['images/bg03.jpg', 'center'],
    ]

    const wrapper = document.createElement('div')
    wrapper.id = 'bg'

    images.forEach(([image, position]) => {
      const background = document.createElement('div')

      background.style.backgroundImage = `url("${image}")`
      background.style.backgroundPosition = position

      wrapper.appendChild(background)
    })

    body.appendChild(wrapper)

    const backgrounds = wrapper.children

    if (backgrounds.length > 0) {
      backgrounds[0].classList.add('visible')
      backgrounds[0].classList.add('top')
    }

    let position = 0

    const interval = setInterval(() => {
      const lastPosition = position

      position = (position + 1) % backgrounds.length

      backgrounds[lastPosition].classList.remove('top')
      backgrounds[position].classList.add('visible')
      backgrounds[position].classList.add('top')

      setTimeout(() => {
        backgrounds[lastPosition].classList.remove('visible')
      }, 3000)
    }, 6000)

    // Cleanup when App unmounts
    return () => {
      clearTimeout(timer)
      clearInterval(interval)
      wrapper.remove()
    }
  }, [])

  return (
    <div>
      <Header />
      <SignUp />
      <Footer />
    </div>
  )
}

export default App

