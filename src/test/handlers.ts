import { http, HttpResponse } from 'msw'


const fakeProjects = [
    {id: 1, name: "FakeProject1", description: "FakeDesc" },
    {id: 2, name: "FakeProject2", description: "FakeDesc2" }   
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
    })
]