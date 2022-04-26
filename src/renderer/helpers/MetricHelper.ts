export class MetricHelper {
    public static formatTime(time: number): string {
        let result = "";

        let hours = Math.floor(time / 3600)
        if (hours > 24) {
            return "inf"
        }

        if (hours >= 1) {
            result += `${hours}h `
        }

        let minutes = Math.floor((time - hours * 3600) / 60)
        if (minutes >= 1) {
            result += `${minutes}m `
        }

        let seconds = Math.floor(time - hours * 3600 - minutes * 60)
        result += `${seconds}s`

        return result
    }

    public static formatSize(bytes: number): string {
        let gigabytes = bytes / 1024 / 1024 / 1024
        if (gigabytes >= 1) {
            return `${gigabytes.toFixed(1)} Gb`
        }

        let megabytes = bytes / 1024 / 1024
        if (megabytes >= 1) {
            return `${megabytes.toFixed(1)} Mb`
        }

        let kilobytes = bytes / 1024
        if (kilobytes >= 1) {
            return `${kilobytes.toFixed(1)} Kb`
        }

        return `${bytes} bytes`
    }

    public static percent(val1: number, val2: number): string {
        return `${(val1 / val2 * 100).toFixed(0)} %`
    }
}
