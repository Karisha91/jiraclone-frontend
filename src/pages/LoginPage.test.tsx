import { render, screen} from '@testing-library/react'
import LoginPage from "./LoginPage"
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../test/server'
import App from '../App.jsx'

describe('LoginPage', () => {
  test('should render login form', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })
  test('should show error message', async () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText(/username/i), 'wrong user')
    await user.type(screen.getByPlaceholderText(/password/i), 'wrong password')
    await user.click(screen.getByRole('button', {name: /login/i}))
    expect(screen.getByText('Invalid username or password')).toBeInTheDocument()
    
  })
  test('should redirect to dashboard on successful login', async () => {
    server.use(
  http.post('*/api/auth/login', () => {
    return HttpResponse.json(
      { token: 'fake-jwt-token' },
      { status: 200 }
    )
  })
)
render(<App />)
const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText(/username/i), 'user')
    await user.type(screen.getByPlaceholderText(/password/i), 'password')
    await user.click(screen.getByRole('button', {name: /login/i}))
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  })
  test('should redirect to Register page', async () => {
    render(<App />)
    const user = userEvent.setup()
    await user.click(await screen.findByRole('link', {name: /Dont have/i}))
    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument()
  })
})

