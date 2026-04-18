export const useParallax = () => {
  const { y } = useWindowScroll()

  const styleFor = (speed = 0.06, offset = 0, scale = 1.08) => {
    return {
      transform: `translate3d(0, ${Math.round(y.value * speed + offset)}px, 0) scale(${scale})`,
      willChange: 'transform'
    }
  }

  return {
    styleFor
  }
}
