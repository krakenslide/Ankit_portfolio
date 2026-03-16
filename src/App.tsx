import { useReveal } from './hooks/useReveal'
import { useCursor } from './hooks/useCursor'
import Nav from './components/ui/Nav'
import Hero from './components/sections/Hero'
import Ticker from './components/ui/Ticker'
import About from './components/sections/About'
import Experience from './components/sections/Experience'
import Skills from './components/sections/Skills'
import Impact from './components/sections/Impact'
import Education from './components/sections/Education'
import Contact from './components/sections/Contact'
import Footer from './components/ui/Footer'

export default function App() {
  useCursor()
  useReveal()

  return (
    <>
      <Nav />
      <Hero />
      <Ticker />
      <hr className="border-none border-t border-white/[0.07] relative z-10" />
      <About />
      <hr className="border-none border-t border-white/[0.07] relative z-10" />
      <Experience />
      <hr className="border-none border-t border-white/[0.07] relative z-10" />
      <Skills />
      <hr className="border-none border-t border-white/[0.07] relative z-10" />
      <Impact />
      <hr className="border-none border-t border-white/[0.07] relative z-10" />
      <Education />
      <Contact />
      <Footer />
    </>
  )
}
