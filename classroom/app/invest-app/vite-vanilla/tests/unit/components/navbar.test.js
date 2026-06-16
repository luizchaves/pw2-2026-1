import { getByLabelText, getByRole } from '@testing-library/dom'
import { describe, expect, it } from 'vitest'
import { renderNavbar } from '../../../src/components/navbar.js'

describe('renderNavbar', () => {
  it('renders public auth links', () => {
    document.body.innerHTML = renderNavbar({ user: null, showValues: true }, '/')

    expect(getByRole(document.body, 'link', { name: 'Entrar' })).toHaveAttribute('href', '/login')
    expect(getByRole(document.body, 'link', { name: 'Cadastrar' })).toHaveAttribute(
      'href',
      '/register',
    )
  })

  it('renders authenticated navigation and visibility toggle', () => {
    document.body.innerHTML = renderNavbar(
      {
        user: { email: 'ana@example.com', user_metadata: { name: 'Ana' } },
        showValues: true,
      },
      '/dashboard',
    )

    expect(getByRole(document.body, 'link', { name: 'Dashboard' })).toHaveAttribute(
      'href',
      '/dashboard',
    )
    expect(getByLabelText(document.body, 'Ocultar valores')).toBeInTheDocument()
    expect(getByRole(document.body, 'button', { name: /Ana/i })).toBeInTheDocument()
  })
})
