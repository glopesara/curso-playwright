import { Locator, Page, expect } from '@playwright/test';
import { TaskModel } from './../../../fixtures/task.model';

export class TasksPage {
    readonly page: Page
    readonly inputTaskName: Locator

    constructor(page: Page) {
        this.page = page
        this.inputTaskName = page.locator('input[class*=list]')
    }

    async go() {
        await this.page.goto('/')
    }

    async crate(task: TaskModel) {
        await this.inputTaskName.fill(task.name)
        await this.page.click('css=button >> text=Create')
    }

    async toggle(taskName: string) {
        const target = this.page.locator(`//p[text()='${taskName}']/..//button[contains(@class,"Toggle")]`)
        await target.click()
    }

    async remove(taskName: string){
        const target = this.page.locator(`//p[text()='${taskName}']/..//button[contains(@class,"Delete")]`)
        await target.click()
    }

    async shouldHaveText(taskName: string) {
        const target = this.page.locator(`css=.task-item p >> text=${taskName}`)
        await expect(target).toBeVisible()
    }

    async alertHaveText(textAlert: string) {
        const target = this.page.locator('.swal2-html-container')
        await expect(target).toHaveText(textAlert)
    }

    async shouldNotExist(taskName: string){
        const target = this.page.locator(`css=.task-item p >> text=${taskName}`)
        await expect(target).not.toBeVisible()
    }
    async validateMensageInpt(mensage: string) {
        // trasformo o campo em um inputdo html e caputuro a mensage
        const validationMessage = await this.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        expect(validationMessage).toEqual(mensage)
    }

    async shouldBeDone(taskName: string){
        const target = this.page.getByText(taskName)
        await expect(target).toHaveCSS('text-decoration-line', 'line-through')
    }
   
}