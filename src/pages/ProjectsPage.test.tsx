import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProjectsPage from './ProjectsPage'
import { server } from '../test/server'
import { http, HttpResponse } from 'msw'
import userEvent from '@testing-library/user-event'

const renderWithRoute = () => {
    render(
        <MemoryRouter initialEntries={['/workspace/1/projects']}>
            <Routes>
                <Route path="/workspace/:workspaceId/projects" element={<ProjectsPage />} />
            </Routes>
        </MemoryRouter>
    )
}

describe('ProjectsPage', () => {
    test('should render projects page', () => {
        renderWithRoute()
        expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument()
    })

    test('should show loading state initially', async () => {
        renderWithRoute()
        expect(screen.getByText('Loading projects...')).toBeInTheDocument()
    })

    test('should display projects from API', async () => {
        renderWithRoute()
        expect(await screen.findByText('FakeProject1')).toBeInTheDocument()
    })

    test('should show empty state when no projects', async () => {
        server.use(
            http.get(`*/api/workspace/:workspaceId/projects`, () => {
                return HttpResponse.json([])
            })
        )
        renderWithRoute()
        expect(await screen.findByText('No projects found. Add one below.')).toBeInTheDocument()
    })

    test('should add new project', async () => {
        renderWithRoute()
        const user = userEvent.setup()
        await user.type(screen.getByPlaceholderText(/project name/i), 'test123')
        await user.type(screen.getByPlaceholderText(/description/i), 'test123')
        await user.click(screen.getByRole('button', { name: /Add project/i }))
        expect(await screen.findByText('test123')).toBeInTheDocument()
    })

    test('should delete project', async () => {
        renderWithRoute()
        const user = userEvent.setup()
        await screen.findByText('FakeProject1')
        await user.click(screen.getAllByRole('button', { name: /delete/i })[0])
        expect(screen.queryByText('FakeProject1')).not.toBeInTheDocument()
    })
})
