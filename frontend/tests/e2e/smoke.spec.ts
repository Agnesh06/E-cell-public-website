import { expect, test } from '@playwright/test'

const routes = [
  { path: '/', heading: 'Ideas are just the beginning.' },
  { path: '/projects', heading: 'Projects' },
  { path: '/projects/placeholder-project', heading: 'Project Details' },
  { path: '/team', heading: 'Team' },
  { path: '/contact', heading: 'Contact' },
  { path: '/unknown-route', heading: 'Not Found' },
]

for (const route of routes) {
  test(`renders ${route.heading} at ${route.path}`, async ({ page }) => {
    await page.goto(route.path)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      route.heading,
    )
  })
}
