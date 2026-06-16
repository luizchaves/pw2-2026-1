import {
  isSupabaseConfigured,
  requireSupabaseConfig,
  supabase,
} from '../services/supabase/client.js'
import {
  getInvestments,
  getInvestmentTypes,
  removeInvestment,
  upsertInvestment,
} from '../services/supabase/investments.js'
import { getStorage, setStorage } from './storage.js'

const VISIBILITY_KEY = 'invest-app:show-values'

let listeners = []
let authSubscription = null
let state = {
  user: null,
  isAuthLoading: true,
  investments: [],
  investmentTypes: [],
  isInvestmentsLoading: false,
  error: null,
  showValues: getStorage(VISIBILITY_KEY) ?? true,
}

const notify = () => {
  setStorage(VISIBILITY_KEY, state.showValues)
  listeners.forEach((listener) => {
    listener(getState())
  })
}

const setState = (partial) => {
  state = {
    ...state,
    ...partial,
  }
  notify()
}

export const subscribe = (listener) => {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter((item) => item !== listener)
  }
}

export const getState = () => ({ ...state })

export const hydrateAuth = async () => {
  setState({ isAuthLoading: true, error: null })

  if (!isSupabaseConfigured) {
    setState({
      user: null,
      investments: [],
      investmentTypes: [],
      isAuthLoading: false,
      error: 'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para usar o Supabase.',
    })
    return
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    setState({ user: null, isAuthLoading: false, error: error.message })
    return
  }

  setState({ user: session?.user ?? null, isAuthLoading: false })

  if (!authSubscription) {
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setState({ user: nextSession?.user ?? null })
      if (nextSession?.user) {
        loadInvestments()
      } else {
        setState({ investments: [], investmentTypes: [] })
      }
    })
    authSubscription = data.subscription
  }

  if (session?.user) await loadInvestments()
}

export const registerUser = async ({ name, email, password }) => {
  requireSupabaseConfig()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) throw error

  if (data.session?.user) {
    setState({ user: data.session.user })
    await loadInvestments()
  }

  return { signedIn: Boolean(data.session) }
}

export const loginUser = async ({ email, password }) => {
  requireSupabaseConfig()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) throw error

  setState({ user: data.user })
  await loadInvestments()
}

export const logoutUser = async () => {
  requireSupabaseConfig()

  const { error } = await supabase.auth.signOut()

  if (error) throw error

  setState({ user: null, investments: [], investmentTypes: [] })
}

export const toggleValues = () => {
  setState({ showValues: !state.showValues })
}

export const loadInvestments = async () => {
  if (!state.user) return

  setState({ isInvestmentsLoading: true, error: null })

  try {
    const [investmentTypes, investments] = await Promise.all([
      getInvestmentTypes(),
      getInvestments(state.user.id),
    ])
    setState({ investmentTypes, investments, isInvestmentsLoading: false })
  } catch (error) {
    setState({
      isInvestmentsLoading: false,
      error: error instanceof Error ? error.message : 'Não foi possível carregar os investimentos.',
    })
  }
}

export const saveInvestment = async (investment) => {
  if (!state.user) throw new Error('Faça login para salvar investimentos.')

  const savedInvestment = await upsertInvestment(investment, state.user.id)
  setState({
    investments: [
      savedInvestment,
      ...state.investments.filter((item) => item.id !== savedInvestment.id),
    ].sort((a, b) => a.name.localeCompare(b.name)),
  })
}

export const deleteInvestment = async (investmentId) => {
  if (!state.user) throw new Error('Faça login para remover investimentos.')

  await removeInvestment(investmentId, state.user.id)
  setState({
    investments: state.investments.filter((investment) => investment.id !== investmentId),
  })
}
