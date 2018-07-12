export default function wait(t = 100, val?: any) {
  return new Promise((resolve) => setTimeout(resolve, t, val))
}
