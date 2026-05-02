import { render, screen, within} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProjectsPage from './ProjectsPage'
import { server } from '../test/server'
import { http, HttpResponse } from 'msw'
import userEvent from '@testing-library/user-event'




describe('ProjectsPage', () => {
test('should render projects page',() => {
    render(<MemoryRouter><ProjectsPage/></MemoryRouter>)
    expect(screen.getByRole('heading', {name: /projects/i})).toBeInTheDocument()
}),
test('should show loading state initially',async  () => {
render(<MemoryRouter><ProjectsPage /></MemoryRouter>)
expect(screen.getByText('Loading projects...')).toBeInTheDocument()
}),
test('should display projects from API',async  () => {
    render(<MemoryRouter><ProjectsPage /></MemoryRouter>)
    expect(await screen.findByText('FakeProject1')).toBeInTheDocument()
}),
test('should show empty state when no projects',async () => {
    server.use(
        http.get(`*/api/projects`, () => {
                return HttpResponse.json([])
            })
    )
    render(<MemoryRouter><ProjectsPage/></MemoryRouter>)
    expect(await screen.findByText('No projects found. Please add a new project.')).toBeInTheDocument()
}),

test('should add new project', async () => {
render(<MemoryRouter><ProjectsPage /></MemoryRouter>)
const user = userEvent.setup()
await user.type(screen.getByPlaceholderText(/Project Name/i), 'test123')
await user.type(screen.getByPlaceholderText(/Description/i), 'test123')
await user.click(screen.getByRole('button', {name: /Add project/i}))
expect(await screen.findByText('test123')).toBeInTheDocument()
}),

test('should delete project',async () => {
    render(<MemoryRouter><ProjectsPage /></MemoryRouter>)
        const user = userEvent.setup()
        await screen.findByText('FakeProject1')
        await user.click(screen.getAllByRole('button', {name: /delete/i})[0])
        expect(screen.queryByText('FakeProject1')).not.toBeInTheDocument()
    })
})