import { expect, test, type Page } from '@playwright/test'

function watchCspViolations(page: Page) {
  const violations: string[] = []
  page.on('console', (message) => {
    const text = message.text()
    if (/content security policy|refused to (?:load|connect|execute|apply)/i.test(text)) violations.push(text)
  })
  return violations
}

test('serves home, client navigation and a real 404 without CSP violations', async ({ page }) => {
  const cspViolations = watchCspViolations(page)
  const home = await page.goto('/')
  expect(home?.status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  await page.getByText('Продукты', { exact: true }).first().click()
  await page.getByRole('navigation', { name: 'Основная навигация' }).getByRole('link', { name: 'Импульс', exact: true }).click()
  await expect(page).toHaveURL(/\/impuls\/$/)

  const missing = await page.goto('/route-that-does-not-exist/')
  expect(missing?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: 'Страница не найдена' })).toBeVisible()
  expect(cspViolations).toEqual([])
})

test('preserves query arguments in the canonical trailing-slash redirect', async ({ request }) => {
  const response = await request.get('/impuls?source=e2e', { maxRedirects: 0 })
  expect(response.status()).toBe(301)
  expect(new URL(response.headers().location).pathname).toBe('/impuls/')
  expect(new URL(response.headers().location).search).toBe('?source=e2e')
})

test('mobile menu opens, navigates and closes on Escape', async ({ page }) => {
  const cspViolations = watchCspViolations(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const menu = page.getByText('Меню', { exact: true })
  await menu.click()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('navigation', { name: 'Мобильная навигация' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
  await page.reload()
  await page.getByText('Меню', { exact: true }).click()
  await page.getByRole('navigation', { name: 'Мобильная навигация' }).getByRole('link', { name: 'Тарифы' }).click()
  await expect(page).toHaveURL(/\/tarify\/$/)
  expect(cspViolations).toEqual([])
})

test('disabled lead form has safe status relationships and cannot submit', async ({ page }) => {
  const cspViolations = watchCspViolations(page)
  const leadRequests: string[] = []
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/api/leads') leadRequests.push(request.url())
  })
  await page.goto('/kontakty/')

  const form = page.getByRole('form', { name: 'Форма расчёта' })
  const statusId = await form.getAttribute('aria-describedby')
  expect(statusId).toBeTruthy()
  const status = page.locator(`#${statusId}`)
  await expect(status).toHaveAttribute('role', 'status')
  await expect(status).toHaveAttribute('aria-live', 'polite')
  await expect(status).toContainText('Отправка отключена')

  await expect(form.getByRole('textbox', { name: 'Имя' })).toBeDisabled()
  await expect(form.getByRole('textbox', { name: 'Контакт' })).toBeDisabled()
  await expect(form.getByRole('textbox', { name: 'Какая задача сейчас важнее?' })).toBeDisabled()
  await expect(form.getByRole('button', { name: 'Получить расчёт' })).toBeDisabled()
  expect(leadRequests).toEqual([])
  expect(cspViolations).toEqual([])
})

test('error boundary exposes reset and recovers after a deterministic client error', async ({ page }) => {
  const cspViolations = watchCspViolations(page)
  await page.goto('/')
  await page.evaluate(() => window.dispatchEvent(new Event('ams24:error-boundary-probe')))
  await expect(page.getByRole('heading', { name: 'Не удалось открыть раздел' })).toBeVisible()

  await page.getByRole('button', { name: 'Повторить' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'Импульс', level: 1 })).toBeVisible()
  expect(cspViolations).toEqual([])
})
