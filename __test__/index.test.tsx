import { render, screen } from '@testing-library/react'
import Footer from '../components/layout/footer'

describe('Footer', () => {
  it('renders a heading', async () => {
    const { container } = render(<Footer />)

    const heading = await screen.findByText('conduit')

    expect(heading).toBeInTheDocument()

    expect(container).toMatchSnapshot()
  })
})