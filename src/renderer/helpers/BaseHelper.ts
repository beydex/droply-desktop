export default class BaseHelper {
    public static async timeout(milliseconds: number): Promise<void> {
        return new Promise<void>(resolve => {
            setTimeout(resolve, milliseconds);
        })
    }

    public static classes(...classes: string[]): string {
        return classes
            .filter(name => {
                return typeof name === "string"
            })
            .join(" ")
    }
}
