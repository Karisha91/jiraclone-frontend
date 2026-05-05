import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import IssuesPage from './IssuesPage'
import { server } from '../test/server'
import { http, HttpResponse } from 'msw'

describe('IssuesPage', () => {
    test('should render issues page', () => {
        render(
            <MemoryRouter initialEntries={['/projects/1/issues']}>
                <Routes>
                    <Route path="/projects/:id/issues" element={<IssuesPage />} />
                </Routes>
            </MemoryRouter>
        )
        expect(screen.getByRole('heading', {name: /wrong text/i})).toBeInTheDocument()
    })

    test('should show loading state initially', async () => {
        render(
            <MemoryRouter initialEntries={['/projects/1/issues']}>
                <Routes>
                    <Route path="/projects/:id/issues" element={<IssuesPage />} />
                </Routes>
            </MemoryRouter>
        )
        expect(screen.getByText('Loading issues...')).toBeInTheDocument()
    })

    test('should display projects from API', async () => {
        render(
            <MemoryRouter initialEntries={['/projects/1/issues']}>
                <Routes>
                    <Route path="/projects/:id/issues" element={<IssuesPage />} />
                </Routes>
            </MemoryRouter>
        )
        expect(await screen.findByText('FakeTitle')).toBeInTheDocument()
    })

    test('should show empty state when no issues', async () => {
        server.use(
            http.get(`*/api/issues/project/:id`, () => {
                return HttpResponse.json([])
            })
        )
        render(
            <MemoryRouter initialEntries={['/projects/1/issues']}>
                <Routes>
                    <Route path="/projects/:id/issues" element={<IssuesPage />} />
                </Routes>
            </MemoryRouter>
        )
        expect(await screen.findByText('No issues found for this project. Please add a new issue.')).toBeInTheDocument()
    }),
    test('should filter issues by status',async () => {
        render(
            <MemoryRouter initialEntries={['/projects/1/issues']}>
                <Routes>
                    <Route path="/projects/:id/issues" element={<IssuesPage />} />
                </Routes>
            </MemoryRouter>
        )
        const user = userEvent.setup()
        await user.click(screen.getByRole('button', {name: /To do/i}))
        expect(await screen.findByText('FakeTitle2')).toBeInTheDocument()
        expect(screen.queryByText('FakeTitle')).not.toBeInTheDocument()
    }),
    test('should create a new issue',async () => {
        render(
            <MemoryRouter initialEntries={['/projects/1/issues']}>
                <Routes>
                    <Route path="/projects/:id/issues" element={<IssuesPage />} />
                </Routes>
            </MemoryRouter>
        )
        const user = userEvent.setup()
        await user.type(screen.getByPlaceholderText(/Issue title/i), 'testIssue')
        await user.type(screen.getByPlaceholderText(/Issue description/i), 'IssueDescriptionTest')
        await user.selectOptions(screen.getAllByRole('combobox')[0], 'DONE')
        await user.selectOptions(screen.getAllByRole('combobox')[1], 'MEDIUM')
        await user.click(screen.getByRole('button', {name: /Create Issue/i}))
        expect(screen.getByText('testIssue')).toBeInTheDocument()
    }),
    test('should delete issue',async () => {
        render(
            <MemoryRouter initialEntries={['/projects/1/issues']}>
                <Routes>
                    <Route path="/projects/:id/issues" element={<IssuesPage />} />
                </Routes>
            </MemoryRouter>
        )
        const user = userEvent.setup()
        await screen.findByText('FakeTitle')
        await user.click(screen.getAllByRole('button', {name: /delete/i})[0])

        expect(screen.queryByText('FakeTitle')).not.toBeInTheDocument()
    })
})