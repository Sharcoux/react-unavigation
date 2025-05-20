import React from 'react'
import { View, ViewStyle } from 'react-native'

export type Props = {
  active: string;
  children?: React.ReactNode;
  duration?: number;
};

function flat<T> (arr: T[]): T[] {
  return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flat(val) : val), [] as T[])
}

const Navigation = React.forwardRef<View, Props>(({ active, children, duration = 500 }: Props, ref) => {
  const [width, setWidth] = React.useState(1)
  const fallbackRef = React.useRef<View>(null)
  const sliderRef = (ref || fallbackRef) as React.RefObject<View>

  const childrenElementsArray = React.useMemo(() => {
    const childrenArray = children && Array.isArray(children) ? children : []
    return flat(childrenArray)
      .filter(child => child && (child as React.ReactElement).props) as Array<React.ReactElement<{ name: string}, React.ComponentType<{ name: string}>>>
  }, [children])

  // activeIndex is the slide which is expected to be displayed
  const activeChildIndex = React.useMemo(() => {
    const index = childrenElementsArray.findIndex(child => child.props.name === active)
    return index === -1 ? 0 : index
  }, [childrenElementsArray, active])

  const [updateNeeded, setUpdateNeeded] = React.useState(false)
  const revalidate = React.useCallback(() => setUpdateNeeded(true), [])

  React.useEffect(() => {
    if (updateNeeded) setUpdateNeeded(false)
  }, [updateNeeded])

  const activeIndex = React.useRef(activeChildIndex)
  const target = React.useRef(activeChildIndex)
  const newTarget = React.useRef(activeChildIndex)
  const animationRef = React.useRef<Animation | null>(null)

  if (childrenElementsArray.find(child => !child.props.name)) console.error('All children must have a name within the Navigation component')
  if (!childrenElementsArray.find(child => child.props.name === active)) console.error(`The Navigation component could not match any child with the name ${active}`)

  React.useLayoutEffect(() => {
    newTarget.current = activeChildIndex

    function animateTo (index: number) {
      if (activeIndex.current !== target.current) return
      if (activeIndex.current === index) return
      target.current = index
      revalidate()

      const slider = sliderRef.current as unknown as HTMLDivElement || null
      const slideElement = (slider?.firstElementChild as unknown as HTMLElement) || null
      if (slideElement) {
        const startX = target.current >= activeIndex.current ? 0 : -width
        const endX = target.current >= activeIndex.current ? -width : 0

        if (animationRef.current) animationRef.current.cancel()

        animationRef.current = slideElement.animate(
          [
            { transform: `translateX(${startX}px)` },
            { transform: `translateX(${endX}px)` }
          ],
          {
            duration,
            easing: 'ease-in-out',
            fill: 'forwards'
          }
        )

        animationRef.current.onfinish = () => {
          activeIndex.current = index
          revalidate()
          if (newTarget.current !== index) animateTo(newTarget.current)
        }
      }
    }

    animateTo(activeChildIndex)
  }, [activeChildIndex, duration, revalidate, width, sliderRef])

  const current = activeIndex.current
  const targetIndex = target.current
  const childrenToDisplay = React.useMemo(() => childrenElementsArray
    .filter((_child, i) => current === i || targetIndex === i)
    .map(child => (<View style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', position: 'relative', flex: 1, flexBasis: 0 }} key={child.props.name}>{child}</View>))
  , [childrenElementsArray, current, targetIndex])

  const sliderStyle: React.CSSProperties & ViewStyle = React.useMemo(() => ({
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 'auto',
    alignItems: 'stretch',
    overflow: targetIndex === current ? undefined : 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row'
  } as const), [current, targetIndex])

  const slideStyle: React.CSSProperties & ViewStyle = React.useMemo(() => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: `${childrenToDisplay.length * 100}%`,
    left: 0
  }), [childrenToDisplay.length])

  const onResize = React.useCallback(() => {
    const slider = sliderRef.current as unknown as HTMLDivElement || null
    const newWidth = slider?.offsetWidth || 0
    if (width !== newWidth) setWidth(newWidth)
  }, [sliderRef, width])

  React.useEffect(() => {
    const slider = sliderRef.current as unknown as HTMLDivElement || null
    if (slider) {
      slider.addEventListener('resize', onResize)
      onResize()
      return () => slider.removeEventListener('resize', onResize)
    }
  }, [onResize, sliderRef])

  React.useLayoutEffect(() => {
    // When dismounting the second slide, we need to reset the transformX to 0
    if (childrenToDisplay.length === 2) {
      return () => {
        animationRef.current?.cancel()
      }
    }
  }, [childrenToDisplay.length])

  if (!children) return null
  if (!Array.isArray(children)) return children as React.ReactElement

  return (
    <View ref={sliderRef} style={sliderStyle}>
      <View style={slideStyle}>
        {childrenToDisplay}
      </View>
    </View>
  )
})

Navigation.displayName = 'Navigation'

export default Navigation

type SlideProps<T> = T & {
  Component: React.ComponentType<T>;
  name: string;
  children?: React.ReactNode;
};

export const Slide = <T, >(props: SlideProps<T>) => {
  const { Component, ...rest } = props
  const Comp = Component as React.ComponentType<typeof rest>
  return <Comp {...rest} />
}

export const asSlide = <T, >(Component: React.ComponentType<T>, defaultName: string) => {
  const AsSlide = (props: T & { name: string; children?: React.ReactNode }) => <Component {...props} name={props.name || defaultName} />
  return AsSlide
}
