import { render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../test/server'
import App from '../App.jsx'
import RegisterPage from './RegisterPage.js'
import { MemoryRouter } from 'react-router-dom'

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
        expect(screen.getByText('Registration failed. Please check your details and try again.')).toBeInTheDocument()

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
        await user.click(await screen.findByRole('link', {name: /Dont have/i}))
        await user.type(screen.getByPlaceholderText(/username/i), 'test123')
        await user.type(screen.getByPlaceholderText(/password/i), '123')
        await user.type(screen.getByPlaceholderText(/email/i), '123@gmail.com')
        await user.selectOptions(screen.getByRole('combobox'), 'USER')
        await user.click(screen.getByRole('button', {name: /register/i}))
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
    })
    
})