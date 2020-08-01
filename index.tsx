import * as React from 'react'
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
  const childrenArray = children && Array.isArray(children) ? children : []

  // We keep only the children of type ReactElement as other children will not be accessible anyway
  const childrenElementsArray = flat(childrenArray as React.ReactNodeArray).filter(child => child && (child as React.ReactElement).props) as Array<React.ReactElement>

  // activeIndex is the slide which is expected to be displayed
  const activeChildIndex = childrenElementsArray.findIndex(child => child.props.name === active) || 0

  // The animated value and it's interpolated equivalence.
  const offset = React.useRef(new RN.Animated.Value(0))

  // activeIndex is the current slide being displayed
  const [activeIndex, setActiveIndex] = React.useState(activeChildIndex)
  // target is the slide to which any current animation is moving to
  const [target, setTarget] = React.useState(activeChildIndex)
  // newTarget holds the slide to which the user lastely asked to be sent to
  const newTarget = React.useRef(activeChildIndex)

  if (childrenElementsArray.find(child => !child.props.name)) console.error('All children must have a name within the Navigation component')

  if (!childrenElementsArray.find(child => child.props.name === active)) console.error(`The Navigation component could not match any child with the name ${active}`)

  // Run the transition each time the active child changes in the props
  React.useEffect(() => {
    newTarget.current = activeChildIndex// We record the new target being requested
    /** Show a transition from the activeIndex to the active child. **/
    function animateTo (index: number) {
      if (activeIndex !== target) return // If an animation is already in progress, we wait until it is over
      if (activeIndex === index) return // If the target is the current slide, we do nothing
      setTarget(index) // Register the target
      // Starts the animation
      RN.Animated.timing(offset.current, { toValue: 100, duration, useNativeDriver: true }).start(() => {
        offset.current.setValue(0) // Reset the offset
        setActiveIndex(index) // Once the animation is over, we mark the new active child
        // If another animation occured since the last call we execute the animation to the next child
        if (newTarget.current !== index) animateTo(newTarget.current)
      })
    }

    animateTo(activeChildIndex)
  }, [activeChildIndex])
  React.useEffect(() => () => offset.current.stopAnimation(), [offset])// Clean up

  // We display only the current active slide and eventually the target of the current animation.
  const childrenToDisplay = childrenElementsArray
    .filter((_child, i) => activeIndex === i || target === i)
    .map((child, i) => (<RN.View style={{ flex: 1, flexBasis: 0 }} key={i}>{child}</RN.View>))

  const sliderStyle: RN.ViewStyle = {
    flex: 1,
    alignSelf: 'stretch',
    overflow: target === activeIndex ? undefined : 'hidden',
    position: 'relative',
    flexDirection: 'row'
  }

  const slideStyle: RN.ViewStyle = {
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: `${childrenToDisplay.length * 100}%`,
    left: offset.current.interpolate({
      inputRange: [0, 100],
      outputRange: (target >= activeIndex) ? ['0%', '-100%'] : ['-100%', '0%']
    }) as unknown as string
  }

  if (!children) return null
  if (!Array.isArray(children)) return children as React.ReactElement
  return (
    <RN.View style={sliderStyle} ref={ref}>
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const asSlide = <T, >(Component: React.ComponentType<T>, defaultName: string) => ({ name = defaultName, ...props }: T & {name: string; children?: React.ReactNode }) => (<Component name={name} {...props}/>)
