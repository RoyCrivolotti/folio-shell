import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { IconLink } from './IconLink'

const icon = <svg data-testid="icon" />

describe('IconLink', () => {
  it('renders an accessible link with its label and href', () => {
    render(<IconLink href="https://example.com" label="Example" icon={icon} />)

    const link = screen.getByRole('link', { name: 'Example' })
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('adds safe attributes for external links', () => {
    render(<IconLink href="https://example.com" label="External" icon={icon} external />)

    const link = screen.getByRole('link', { name: 'External' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does not set target for internal links', () => {
    render(<IconLink href="/admin" label="Internal" icon={icon} />)

    const link = screen.getByRole('link', { name: 'Internal' })
    expect(link).not.toHaveAttribute('target')
  })

  it('hides the decorative icon from assistive technology', () => {
    render(<IconLink href="/x" label="Hidden icon" icon={icon} />)

    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true')
  })
})
