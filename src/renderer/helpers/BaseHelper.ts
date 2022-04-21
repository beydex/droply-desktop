export type SwitchFunction<T> = {
    addVariant: (value, callback: () => T) => SwitchFunction<T>,
    result: () => T
}

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

    public static switch<T>(initialValue): SwitchFunction<T> {
        let obj;
        let result;

        return obj = {
            addVariant(value, callback) {
                if (value == initialValue) {
                    result = callback()
                }

                return obj
            },

            result() {
                return result;
            }
        }
    }
}
