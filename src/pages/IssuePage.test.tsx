import { render, screen, within} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import IssuePage from './IssuePage'

import userEvent from '@testing-library/user-event'

describe('IssuePage', () => {
    test('should render issue page', () => {
        render(
            <MemoryRouter initialEntries={['/issues/5']}>
                <Routes>
                    <Route path= "/issues/:id" element= {<IssuePage />}></Route>
                </Routes>
            </MemoryRouter>
        )
        expect(screen.getByRole('heading', {name: /Issue Page/i})).toBeInTheDocument()
    }),
    test('should display issue details', async () => {
        render(
            <MemoryRouter initialEntries={['/issues/5']}>
                <Routes>
                    <Route path= "/issues/:id" element= {<IssuePage />}></Route>
                </Routes>
            </MemoryRouter>
        )
        expect(await screen.findByText('TestDescription')).toBeInTheDocument();
    }),
    test('should display comments',async  () => {
        render(
            <MemoryRouter initialEntries={['/issues/5']}>
                <Routes>
                    <Route path= "/issues/:id" element= {<IssuePage />}></Route>
                </Routes>
            </MemoryRouter>
        )
        expect(await screen.findByText('Ivan')).toBeInTheDocument()
        expect(await screen.findByText('Marko')).toBeInTheDocument()
    }),
    test('should add comment', async () => {
        render(
            <MemoryRouter initialEntries={['/issues/5']}>
                <Routes>
                    <Route path= "/issues/:id" element= {<IssuePage />}></Route>
                </Routes>
            </MemoryRouter>
        )
        const user = userEvent.setup()
        await user.type(screen.getByPlaceholderText(/Add comment/i), 'Test comment')
        await user.click(screen.getByRole('button', {name: /Add comment/i}))
        expect(screen.getByText('Test comment')).toBeInTheDocument()
    }),
    test('should delete comment', async () => {
        render(
            <MemoryRouter initialEntries={['/issues/5']}>
                <Routes>
                    <Route path= "/issues/:id" element= {<IssuePage />}></Route>
                </Routes>
            </MemoryRouter>
        )
        const user = userEvent.setup()
        await screen.findByText('Introduced testing for issue page')
        await user.click(screen.getAllByRole('button', {name: /delete/i})[0])
        expect(screen.queryByText('Introduced testing for issue page')).not.toBeInTheDocument()
    }),
    test('should edit form appear', async () => {
        render(
            <MemoryRouter initialEntries={['/issues/5']}>
                <Routes>
                    <Route path= "/issues/:id" element= {<IssuePage />}></Route>
                </Routes>
            </MemoryRouter>
        )
        expect(await screen.findByText('TestDescription')).toBeInTheDocument();
        const user = userEvent.setup()
        await user.click(screen.getByRole('button', {name: /Edit issue/i}))
        expect(await screen.findByRole('button', {name: /Save Changes/i})).toBeInTheDocument();

    })
    ,
    test('should update issue', async () => {
        render(
            <MemoryRouter initialEntries={['/issues/5']}>
                <Routes>
                    <Route path= "/issues/:id" element= {<IssuePage />}></Route>
                </Routes>
            </MemoryRouter>
        )
         expect(await screen.findByText('TestIssue'))
        const user = userEvent.setup()
        await user.click(screen.getByRole('button', {name: /Edit issue/i}))
        await user.clear(screen.getAllByRole('textbox')[0])
        await user.type(screen.getAllByRole('textbox')[0], 'UpdatedTitle')
        await user.clear(screen.getAllByRole('textbox')[1])
        await user.type(screen.getAllByRole('textbox')[1], 'UpdatedDescription')
        await user.selectOptions(screen.getAllByRole('combobox')[0], 'DONE')
        await user.selectOptions(screen.getAllByRole('combobox')[1], 'MEDIUM')
        await user.click(screen.getByRole('button', {name: /Save Changes/i}))
        expect(screen.getByText('Update successful')).toBeInTheDocument()
    })
})