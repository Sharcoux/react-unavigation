import React from 'react'
import * as RN from 'react-native'

export type Props = {
  active: string;
  children?: React.ReactNode;
  duration?: number;
}

function flat<T, > (arr: T[]): T[] {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flat(val) : val), [])
}

const Navigation = React.forwardRef<RN.View, Props>(({ active, children, duration = 500 }: Props, ref) => {
  const [width, setWidth] = React.useState(1)

  // We keep only the children of type ReactElement as other children will not be accessible anyway
  const childrenElementsArray = React.useMemo(() => {
    const childrenArray = children && Array.isArray(children) ? children : []
    return flat(childrenArray as React.ReactNodeArray)
      .filter(child => child && (child as React.ReactElement).props) as Array<React.ReactElement>
  }, [children])

  // activeIndex is the slide which is expected to be displayed
  const activeChildIndex = childrenElementsArray.findIndex(child => child.props.name === active) || 0

  // The animated value and it's interpolated equivalence.
  const offset = React.useRef(new RN.Animated.Value(0))

  const [updateNeeded, setUpdateNeeded] = React.useState(false)

  // If no rerender is pending, we trigger one.
  const revalidate = React.useCallback(() => setUpdateNeeded(true), [])

  // We mark the view as valid
  React.useEffect(() => {
    if (updateNeeded) setUpdateNeeded(false)
  }, [updateNeeded])

  // activeIndex is the current slide being displayed
  const activeIndex = React.useRef(activeChildIndex)
  // target is the slide to which any current animation is moving to
  const target = React.useRef(activeChildIndex)
  // newTarget holds the slide to which the user lastely asked to be sent to
  const newTarget = React.useRef(activeChildIndex)

  if (childrenElementsArray.find(child => !child.props.name)) console.error('All children must have a name within the Navigation component')

  if (!childrenElementsArray.find(child => child.props.name === active)) console.error(`The Navigation component could not match any child with the name ${active}`)

  // Run the transition each time the active child changes in the props
  React.useEffect(() => {
    newTarget.current = activeChildIndex// We record the new target being requested
    /** Show a transition from the activeIndex to the active child. **/
    function animateTo (index: number) {
      if (activeIndex.current !== target.current) return // If an animation is already in progress, we wait until it is over
      if (activeIndex.current === index) return // If the target is the current slide, we do nothing
      target.current = index // Register the target
      revalidate()
      // Starts the animation
      RN.Animated.timing(offset.current, { toValue: 100, duration, useNativeDriver: true }).start(() => {
        offset.current.setValue(0) // Reset the offset
        activeIndex.current = index // Once the animation is over, we mark the new active child
        revalidate()
        // If another animation occured since the last call we execute the animation to the next child
        if (newTarget.current !== index) animateTo(newTarget.current)
      })
    }

    animateTo(activeChildIndex)
  }, [activeChildIndex, duration, revalidate])

  React.useEffect(() => () => offset.current.stopAnimation(), [])// Clean up

  // We display only the current active slide and eventually the target of the current animation.
  const childrenToDisplay = React.useMemo(() => childrenElementsArray
    .filter((_child, i) => activeIndex.current === i || target.current === i)
    .map(child => (<RN.View style={{ flex: 1, flexBasis: 0 }} key={child.props.name}>{child}</RN.View>))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [activeIndex.current, childrenElementsArray, target.current])

  const sliderStyle: RN.ViewStyle = React.useMemo(() => ({
    flex: 1,
    alignSelf: 'stretch',
    overflow: target.current === activeIndex.current ? undefined : (RN.Platform.OS === 'web' ? 'clip' : 'hidden') as 'hidden',
    position: 'relative',
    flexDirection: 'row'
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [target.current, activeIndex.current])

  const slideStyle: RN.ViewStyle = React.useMemo(() => ({
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: `${childrenToDisplay.length * 100}%`,
    left: 0,
    transform: [{
      translateX: offset.current.interpolate({
        inputRange: [0, 100],
        outputRange: (target.current >= activeIndex.current) ? [0, -width] : [-width, 0]
      }) as unknown as number
    }]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [width, target.current, activeIndex.current, childrenToDisplay.length])

  const unmounted = React.useRef(false)
  React.useEffect(() => () => { unmounted.current = true }, [])
  const onLayout = React.useCallback((event: RN.LayoutChangeEvent) => {
    const newWidth = event.nativeEvent.layout.width
    !unmounted.current && width !== newWidth && setWidth(newWidth)
  }, [width])

  if (!children) return null
  if (!Array.isArray(children)) return children as React.ReactElement
  return (
    <RN.View onLayout={onLayout} style={sliderStyle} ref={ref}>
      <RN.Animated.View style={slideStyle}>
        {childrenToDisplay}
      </RN.Animated.View>
    </RN.View>
  )
})

Navigation.displayName = 'Navigation'

export default Navigation

type SlideProps<T> = T & {
  Component: React.ComponentType<T>;
  name: string;
  children?: React.ReactNode;
}

export const Slide = <T, >(props: SlideProps<T>) => (<props.Component {...props} Component={undefined} />)

export const asSlide = <T, >(Component: React.ComponentType<T>, defaultName: string) => {
  const AsSlide = (props: T & { name: string; children?: React.ReactNode }) => (<Component {...props} name={props.name || defaultName} />)
  return AsSlide
}
