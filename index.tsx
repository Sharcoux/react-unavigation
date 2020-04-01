import * as React from 'react'
import * as RN from 'react-native'
import styled from 'styled-components/native'

import * as PropTypes from 'prop-types'

const Slider = styled.View`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  flex-direction: row;
`
type WrapProps = {
  active: boolean;
  activating: boolean;
  deactivating: boolean;
}

const Wrap = styled.View<WrapProps>`
  display: ${props => (props.active || props.activating) ? 'flex' : 'none'};
  width: 100%;
  color: red;
`

export type Props = {
  active: string;
  children: React.ReactElement[];
  duration?: number;
}

const Navigation = React.forwardRef<RN.View, Props>(({ active, children, duration = 500 }: Props, ref = { current: null }) => {
  if (!children) return children
  if (!Array.isArray(children)) return children
  // We keep only the children of type ReactElement as other children will not be accessible anyway
  const childrenArray = (children as React.ReactNodeArray).filter(child => child && (child as React.ReactElement).props) as Array<React.ReactElement>

  const activeChildIndex = childrenArray.findIndex(child => child.props.name === active) || 0

  const [activeIndex, setActive] = React.useState(activeChildIndex)
  const [progress, setProgress] = React.useState(0)
  const [offset] = React.useState(new RN.Animated.Value(0))

  const target = React.useRef(activeChildIndex)

  if (childrenArray.find(child => !child.props.name)) console.error('All children must have a name within the Navigation component')

  if (!childrenArray.find(child => child.props.name === active)) console.error(`The Navigation component could not match any child with the name ${active}`)

  /** Show a transition from the activeIndex to the active child. **/
  function animateTo (index: number) {
    if (progress || index === target.current) return // If an animation is already in progress, we wait until it is over
    target.current = index // Register the target
    // Decide to which direction interpolate to
    setProgress(offset.interpolate({
      inputRange: [0, 100],
      outputRange: (target.current > activeIndex) ? ['0%', '-100%'] : ['-100%', '0%']
    }) as unknown as number)
    // Starts the animation
    RN.Animated.timing(offset, { toValue: 100, duration, useNativeDriver: true }).start(() => {
      setProgress(0)
      setActive(index) // Once the animation is over, we mark the new active child
      offset.setValue(0) // Reset the offset
      // If another animation occured since the last call we execute the animation to the next child
      if (activeChildIndex !== index) animateTo(activeChildIndex)
    })
  }

  // Run the transition each time the active child changes
  React.useEffect(() => animateTo(activeChildIndex), [active])
  React.useEffect(() => () => offset.stopAnimation(), [])// Clean up

  return (
    <Slider ref={ref}>
      <RN.Animated.View style={{
        position: 'relative',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        width: '100%',
        left: progress
      }}>
        {childrenArray.map((child, i) => (
          <Wrap
            key={i}
            active={activeIndex === i}
            activating={target.current === i}
            deactivating={activeIndex !== target.current}
          >
            {child}
          </Wrap>
        ))}
      </RN.Animated.View>
    </Slider>
  )
})

Navigation.propTypes = {
  active: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.element.isRequired).isRequired,
  duration: PropTypes.number
}

Navigation.displayName = 'Navigation'

export default Navigation
