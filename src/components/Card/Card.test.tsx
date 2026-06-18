import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card } from './Card'

describe('Card', () => {
  it('renders title, description and href as a single link', () => {
    render(<Card href="/page.html" title="Example" description="A short summary" />)

    const link = screen.getByRole('link', { name: /Example/ })
    expect(link).toHaveAttribute('href', '/page.html')
    expect(screen.getByText('A short summary')).toBeInTheDocument()
  })

  it('adds safe attributes for external resources', () => {
    render(<Card href="https://x.test" title="Legacy" description="Old site" external />)

    const link = screen.getByRole('link', { name: /Legacy/ })
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveAttribute('target', '_blank')
  })
})
