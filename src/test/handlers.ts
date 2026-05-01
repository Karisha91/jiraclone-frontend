import { http, HttpResponse } from 'msw'

export const handlers = [
    http.post('*/api/auth/login', () => {
        return HttpResponse.json(
            { message: 'Invalid credentials' },
           { status: 401}
        )
        }),

    http.post(`*/api/auth/register`,() => {
        return HttpResponse.json(
            { message: 'Registration failed. Please check your details and try again.' },
           { status: 400}
        )
    })
]