import '../styles/main.css'
import 'aos/dist/aos.css'
import '@fortawesome/fontawesome-free/css/all.css'
import AOS from 'aos'
import { initMobileMenu } from './nav.js'
import { initTypewriter } from './typewriter.js'
import { initPhotoModal } from './modal.js'

AOS.init({ once: true, offset: 50, duration: 800 })

initMobileMenu()
initTypewriter()
initPhotoModal()
