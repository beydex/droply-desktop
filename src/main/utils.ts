import gsap from "gsap";

export function classes(...classes: string[]) {
  return classes
    .filter(name => {
      return typeof name === "string"
    })
    .join(" ")
}

export function animate(target: gsap.TweenTarget, delay: number, vars: gsap.TweenVars) {
  setTimeout(gsap.to, delay, target, vars)
}
