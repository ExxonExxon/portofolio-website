import '../styles/contact.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { initMobileMenu } from './nav.js'

AOS.init({ duration: 800, once: true, disable: 'mobile' })
initMobileMenu()
