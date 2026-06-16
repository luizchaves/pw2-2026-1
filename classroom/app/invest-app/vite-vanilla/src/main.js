import '../global.css'
import { renderNavbar } from './components/navbar.js'
import { errorBanner, loadingSession } from './components/ui.js'
import { bindGlobalEvents } from './events.js'
import { html, mount } from './lib/dom.js'
import { getState, hydrateAuth, subscribe } from './lib/store.js'
import { renderLogin, renderRegister } from './pages/auth.js'
import { renderDashboard } from './pages/dashboard.js'
import { renderInvestments } from './pages/investments.js'
import { renderLanding } from './pages/landing.js'

const app = document.getElementById('app')
const modalRoot = document.getElementById('modal-root')

const routes = ['/', '/login', '/register', '/dashboard', '/investments']
const protectedRoutes = ['/dashboard', '/investments']

const pages = {
  '/': renderLanding,
  '/login': renderLogin,
  '/register': renderRegister,
  '/dashboard': renderDashboard,
  '/investments': renderInvestments,
}

const currentPath = () => {
  const path = window.location.pathname
  return routes.includes(path) ? path : '/'
}

const goTo = (path) => {
  history.pushState({}, '', path)
  render()
}

const render = () => {
  const state = getState()
  const path = currentPath()
  const navbar = renderNavbar(state, path)

  if (state.isAuthLoading) {
    mount(app, loadingSession(navbar))
    return
  }

  if (!state.user && protectedRoutes.includes(path)) {
    history.replaceState({}, '', '/login')
    render()
    return
  }

  mount(app, html`${navbar}${errorBanner(state.error)}<main>${pages[path](state)}</main>`)

  if (path === '/investments' && new URLSearchParams(window.location.search).has('new')) {
    history.replaceState({}, '', '/investments')
    document.querySelector('[data-action="new-investment"]')?.click()
  }
}

bindGlobalEvents({ goTo, modalRoot })
subscribe(render)
window.addEventListener('popstate', render)
render()
hydrateAuth()
