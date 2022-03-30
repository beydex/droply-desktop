export class FileWrap {
    private file: File;

    constructor(file: File) {
        this.file = file
    }

    public name(): string {
        return this.file.name
    }
}

export class FileRepository {
    public static Instance = new FileRepository()

    public getFiles(): Promise<FileWrap[]> {
        return new Promise<FileWrap[]>(resolve => {
            let element = document.createElement("input")
            element.type = "file"
            element.multiple = true

            element.onchange = (e: Event) => {
                let target = e.target as HTMLInputElement

                let files = [] as FileWrap[]
                for (let file of target.files) {
                    files.push(new FileWrap(file))
                }

                resolve(files)
            }

            element.click()
        })
    }
}
