import { http, HttpResponse } from 'msw'
import { Status } from '../services/IssueService'
import { Priority } from '../services/IssueService'


const fakeProjects = [
    {id: 1, projectName: "FakeProject1", description: "FakeDesc" },
    {id: 2, projectName: "FakeProject2", description: "FakeDesc2" }   
]
const fakeIssues = [
    {id: 1,title:"FakeTitle", description: "fakeDesc", status: "IN_REVIEW", priority: "LOW"},
    {id: 2,title:"FakeTitle2", description: "fakeDesc2", status: "TO_DO", priority: "HIGH"},
    {id: 3,title:"FakeTitle3", description: "fakeDesc3", status: "DONE", priority: "MEDIUM"},
    {id: 4,title:"FakeTitle4", description: "fakeDesc4", status: "IN_PROGRESS", priority: "CRITICAL"}
]

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
    }),

    http.get(`*/api/projects`, () => {
        return HttpResponse.json(fakeProjects)
    }),
    http.get(`*/api/issues`, () => {
        return HttpResponse.json(fakeIssues)
    }),
    http.delete(`*/api/projects/:id`, ({ params }) => {
        const { id } = params
        return HttpResponse.json(
            {message: `Project ${id} deleted`},
            {status: 200}
            ) 
        
    }),
    http.post(`*/api/projects`, async ({ request }) => {
        const body = await request.json() as {name: string, description: string}
        return HttpResponse.json({ id: 3, projectName: body.name, description: body.description })
    }),
    http.get(`*/api/issues/:id`, ({ params }) => {
        const { id } = params
        return HttpResponse.json({id: 5, 
            title:"TestIssue", 
            description: "TestDescription",
             status: "IN_REVIEW", priority: "LOW", 
             projectName: "TestProject", 
             reporterUsername: "Ivan", 
             assigneeUsername: "Marko", 
             projectId: 1})

    }),
    http.get(`*/api/comments/:id`, ({ params }) => {
        const { id } = params
        return HttpResponse.json([{id:1 , content: "Introduced testing for issue page", createdAt: "2026-05-03T10:00:00" , author: "Ivan"},
                                    {id:2 , content: "fixed testing for issue page", createdAt: "2026-05-03T10:00:00" , author: "Marko"}
        ])

    }),
    http.post(`*/api/comments`, async ({request}) => {
        const body = await request.json() as {content: String}
        return HttpResponse.json({id: 1, content:body.content, createdAt:"2026-05-03T10:00:00", author: "Ivan" })

    }),
    http.delete(`*/api/comments/:id`, ({ params }) => {
            const { id } = params
            return HttpResponse.json(
                {message: `Comment ${id} deleted`},
                {status: 200}
                ) 
    }),
    http.put(`*/api/issues/:id`, async  ({ params, request }) => {
         const { id } = params
         const body = await request.json() as {title: String, description: String, status: Status, priority: Priority}
         return HttpResponse.json({id: 5, title: body.title, description: body.description, status: body.status, priority: body.priority})
    }),
    http.get(`*/api/issues/project/:id`, ({ params }) => {
        const { id } = params
        return HttpResponse.json(fakeIssues)

    }),
    http.post('*/api/issues', async ({ request }) => {
    const body = await request.json() as { title: string, description: string, status: Status, priority: Priority }
    return HttpResponse.json({ id: 5, title: body.title, description: body.description, status: body.status, priority: body.priority, projectId: 1 })
}),
http.delete('*/api/issues/:id', ({ params }) => {
    const { id } = params
    return HttpResponse.json(
        { message: `Issue ${id} deleted` },
        { status: 200 }
    )
})
]