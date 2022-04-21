export interface FileDescription {
    name: string
    size: number
}

export class FileRepository {
    public static Instance = new FileRepository()

    private files: File[] = null

    public getFiles() {
        return this.files
    }

    public dropFiles() {
        this.files = null
    }

    public async requestFiles() {
        return new Promise<void>(resolve => {
            let element = document.createElement("input")
            element.type = "file"
            element.multiple = true

            element.addEventListener("change", (e: Event) => {
                let target = e.target as HTMLInputElement

                let files = [] as File[]
                for (let file of target.files) {
                    files.push(file)
                }

                // Saving files
                this.files = files

                resolve()
            })

            element.click()
        })
    }
}
