import Index from './pages/Index'
import Epic from './pages/Epic'

export default [
  { path: '/', component: Index },
  { path: '/:lang/:word', component: Epic }
]
