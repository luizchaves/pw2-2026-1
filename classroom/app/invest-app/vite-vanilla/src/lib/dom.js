export const html = (strings, ...values) =>
  strings.reduce((result, string, index) => `${result}${string}${values[index] ?? ''}`, '')

export const mount = (element, markup) => {
  element.innerHTML = markup
}

export const formValues = (form) => Object.fromEntries(new FormData(form).entries())

export const setFieldError = (form, field, message) => {
  const error = form.querySelector(`[data-error-for="${field}"]`)
  const input = form.elements[field]

  if (error) error.textContent = message ?? ''
  if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false')
}

export const clearFieldErrors = (form) => {
  form.querySelectorAll('[data-error-for]').forEach((error) => {
    error.textContent = ''
  })
  form.querySelectorAll('[aria-invalid]').forEach((input) => {
    input.setAttribute('aria-invalid', 'false')
  })
}

export const uid = () => {
  if (crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
