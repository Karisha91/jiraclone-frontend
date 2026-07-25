import { render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../test/server'
import App from '../App.jsx'
import RegisterPage from './RegisterPage.js'
import { MemoryRouter } from 'react-router-dom'
import toast from 'react-hot-toast'

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn()
  },
  Toaster: () => null
}))

describe('RegisterPage', () => {
    test('should render register page', () => {
        render(<MemoryRouter><RegisterPage /></MemoryRouter>)
        expect(screen.getByRole('button', {name: /register/i})).toBeInTheDocument()
    })
    test('should show error message', async () => {
        render(<MemoryRouter><RegisterPage /></MemoryRouter>)
        const user = userEvent.setup();
        await user.type(screen.getByPlaceholderText(/username/i), 'test123')
        await user.type(screen.getByPlaceholderText(/password/i), '123')
        await user.type(screen.getByPlaceholderText(/email/i), '123@gmail.com')
        await user.selectOptions(screen.getByRole('combobox'), 'USER')
        await user.click(screen.getByRole('button', {name: /register/i}))
        expect(toast.error).toHaveBeenCalledWith('Invalid registration data')

    })
    test('should redirect to Login on successful register', async () => {
        server.use (
            http.post('*/api/auth/register', () => {
                return HttpResponse.json(
                    {
                        status:200
                    }
                )
            })
            
        )
        render(<App />)
        const user = userEvent.setup()
        await user.click(await screen.findByRole('link', {name: /Don't have an account/i}))
        await user.type(screen.getByPlaceholderText(/username/i), 'test123')
        await user.type(screen.getByPlaceholderText(/password/i), '123')
        await user.type(screen.getByPlaceholderText(/email/i), '123@gmail.com')
        await user.selectOptions(screen.getByRole('combobox'), 'USER')
        await user.click(screen.getByRole('button', {name: /register/i}))
        expect(await screen.findByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
        //asd
    })
    
})