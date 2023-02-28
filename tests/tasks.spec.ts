import { test, expect } from '@playwright/test';
import { TaskModel } from './fixtures/task.model';
import { deleteTaskByHelper, crateTask } from './support/helpers';
import { TasksPage } from './support/pages/tasks';
import data from './fixtures/tasks.json'

let tasksPage: TasksPage

test.beforeEach(({ page }) => {
    // instancio o page objects em um before para todos os casos
    tasksPage = new TasksPage(page)
})

test.describe('cadastro', () => {
    test('deve cadastrar uma nova tarefa', async ({ request }) => {
        const task = data.success as TaskModel
        // const testes = await request.delete('http://localhost:3333/helper/tasks/ler um livro')
        // console.log(testes.status())
        // await request.delete('http://localhost:3333/helper/tasks/' + task.name)
        await deleteTaskByHelper(request, task.name)

        // instanciado no before
        // const tasksPage: TasksPage = new TasksPage(page)

        await tasksPage.go()
        await tasksPage.crate(task)
        await tasksPage.shouldHaveText(task.name)
    })

    test('não deve permitir tarefa duplicada', async ({ request }) => {
        const task = data.duplicate as TaskModel

        // await request.delete('http://localhost:3333/helper/tasks/' + task.name)
        await deleteTaskByHelper(request, task.name)

        // const newTask = await request.post('http://localhost:3333/tasks', { data: task })
        await crateTask(request, task)

        await tasksPage.go()
        await tasksPage.crate(task)
        await tasksPage.alertHaveText('Task already exists!')
    })

    test('campo obrigatorio', async ({ page }) => {
        const task = data.required as TaskModel

        await tasksPage.go()
        await tasksPage.crate(task)
        await tasksPage.validateMensageInpt('This is a required field')
    })
})
test.describe('atualização', () => {
    test('deve concluir uma tarefa', async ({ request }) => {
        const task = data.update as TaskModel

        await deleteTaskByHelper(request, task.name)
        await crateTask(request, task)

        await tasksPage.go()
        await tasksPage.toggle(task.name)
        await tasksPage.shouldBeDone(task.name)
    })
})

test.describe('exclusão', () => {
    test('deve excluir uma tarefa', async ({ request}) => {
        const task = data.update as TaskModel

        await deleteTaskByHelper(request, task.name)
        await crateTask(request, task)

        await tasksPage.go()
        await tasksPage.remove(task.name)
        await tasksPage.shouldNotExist(task.name)
    })
})