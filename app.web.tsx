import React, { useState, useEffect } from 'react'
import { Text, View, AppRegistry } from 'react-native'
import Navigation, { Slide } from '.'

const App = () => {
  const [active, setActive] = useState(0)
  useEffect(() => { setInterval(() => setActive(a => (a + 1) % 3), 5000) }, [])
  return (<Navigation active={active + ''} duration={1000}>
    <View />
    <Slide name='0' style={{ backgroundColor: 'red' }}><Text>test qsdj qsd lqjsdmlkfqj msldkfj qlskd fmqlkdjf mqkd smlqj sdlfjq sdlkjfhq lkdjsh ksdj qlksdj flqksdjh qlkjsd hflqkjdhs flqlksdjh lqkjds lfqkjdsh lfqkjds lfqkjds hlqkjdsh flqkjdshf lqsdjh qlkdshjf lkqsdjh flqkjdsh lkqf</Text></Slide>
    <Slide name='1' style={{ backgroundColor: 'blue' }}><Text>test qsdj qsd lqjsdmlkfqj msldkfj qlskd fmqlkdjf mqkd smlqj sdlfjq sdlkjfhq lkdjsh ksdj qlksdj flqksdjh qlkjsd hflqkjdhs flqlksdjh lqkjds lfqkjdsh lfqkjds lfqkjds hlqkjdsh flqkjdshf lqsdjh qlkdshjf lkqsdjh flqkjdsh lkqf</Text></Slide>
    <Slide name='2'><Text>test qsdj qsd lqjsdmlkfqj msldkfj qlskd fmqlkdjf mqkd smlqj sdlfjq sdlkjfhq lkdjsh ksdj qlksdj flqksdjh qlkjsd hflqkjdhs flqlksdjh lqkjds lfqkjdsh lfqkjds lfqkjds hlqkjdsh flqkjdshf lqsdjh qlkdshjf lkqsdjh flqkjdsh lkqf</Text></Slide>
  </Navigation>)
}

AppRegistry.registerComponent('test', () => App)

AppRegistry.runApplication('test', {
  rootTag: document.getElementsByTagName('body')[0]
})
