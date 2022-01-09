export default function classes(...classes: string[]) {
  return classes
    .filter(name => {
      return !!name
    })
    .join(" ")
}
