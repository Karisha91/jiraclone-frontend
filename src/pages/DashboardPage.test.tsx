import { render, screen, within} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DashboardPage from './DashboardPage'

describe('DashboardPage', () => {
    beforeEach(() => {
    const fakePayload = btoa(JSON.stringify({ sub: 'TestUser' }))
    localStorage.setItem('token', `header.${fakePayload}.signature`)
})
    test('should render dashboard form', () => {
        render(<MemoryRouter><DashboardPage/></MemoryRouter>)
        expect(screen.getByRole('heading', {name: /dashboard/i})).toBeInTheDocument()
    }),
    test('messagge should greet user', () => {
    render(<MemoryRouter><DashboardPage/></MemoryRouter>)
    expect(screen.getByText('Welcome back, TestUser!')).toBeInTheDocument()

    }),
    test('total projects', async () => {
        render(<MemoryRouter><DashboardPage/></MemoryRouter>)
        const projectsCard = screen.getByText('Total Projects').closest('.stat-card') as HTMLElement
        expect(await within(projectsCard!).findByText('2')).toBeInTheDocument()
    }),
    test('total issues', async () => {
        render(<MemoryRouter><DashboardPage/></MemoryRouter>)
        const issuesCard = screen.getByText('Total Issues').closest('.stat-card') as HTMLElement
        expect(await within(issuesCard!).findByText('4')).toBeInTheDocument()
    }),
    test('TODO issues', async () => {
        render(<MemoryRouter><DashboardPage/></MemoryRouter>)
        const todoCard = document.querySelector('.stat-card.todo') as HTMLElement
        expect(await within(todoCard!).findByText('1')).toBeInTheDocument()
    }),
    test('In progress issues', async () => {
        render(<MemoryRouter><DashboardPage/></MemoryRouter>)
        const inProgressCard = document.querySelector('.stat-card.inprogress') as HTMLElement
        expect(await within(inProgressCard!).findByText('1')).toBeInTheDocument()
    }),
    test('In review issues', async () => {
        render(<MemoryRouter><DashboardPage/></MemoryRouter>)
        const inReviewCard = document.querySelector('.stat-card.inreview') as HTMLElement
        expect(await within(inReviewCard!).findByText('1')).toBeInTheDocument()
    }),
    test('Done issues', async () => {
        render(<MemoryRouter><DashboardPage/></MemoryRouter>)
        const doneCard = document.querySelector('.stat-card.done') as HTMLElement
        expect(await within(doneCard!).findByText('1')).toBeInTheDocument()
    })
    
    
})