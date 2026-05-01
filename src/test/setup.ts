import '@testing-library/jest-dom'
import { server } from './server'

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers()
    localStorage.clear()
})
afterAll(() => server.close())