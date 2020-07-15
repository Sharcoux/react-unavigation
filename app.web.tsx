import React, { useState, useEffect } from 'react'
import { Text, View, AppRegistry } from 'react-native'
import Navigation, { Slide, asSlide } from '.'

const Page2 = asSlide(View, '2')

const App = () => {
  const [active, setActive] = useState(0)
  useEffect(() => { setInterval(() => setActive(a => (a + 1) % 3), 5000) }, [])
  return (<Navigation active={active + ''} duration={1000}>
    {/* The View below doesn't respect the type and will be ignored. In future version of typescript, it should raise an error. */}
    <View />
    <Slide name='0' style={{ backgroundColor: 'red' }} Component={View}><Text>test qsdj qsd lqjsdmlkfqj msldkfj qlskd fmqlkdjf mqkd smlqj sdlfjq sdlkjfhq lkdjsh ksdj qlksdj flqksdjh qlkjsd hflqkjdhs flqlksdjh lqkjds lfqkjdsh lfqkjds lfqkjds hlqkjdsh flqkjdshf lqsdjh qlkdshjf lkqsdjh flqkjdsh lkqf</Text></Slide>
    <Slide name='1' style={{ backgroundColor: 'blue' }} Component={View}><Text>test qsdj qsd lqjsdmlkfqj msldkfj qlskd fmqlkdjf mqkd smlqj sdlfjq sdlkjfhq lkdjsh ksdj qlksdj flqksdjh qlkjsd hflqkjdhs flqlksdjh lqkjds lfqkjdsh lfqkjds lfqkjds hlqkjdsh flqkjdshf lqsdjh qlkdshjf lkqsdjh flqkjdsh lkqf</Text></Slide>
    <Page2 name='2' style={{ backgroundColor: 'green' }}><Text>test qsdj qsd lqjsdmlkfqj msldkfj qlskd fmqlkdjf mqkd smlqj sdlfjq sdlkjfhq lkdjsh ksdj qlksdj flqksdjh qlkjsd hflqkjdhs flqlksdjh lqkjds lfqkjdsh lfqkjds lfqkjds hlqkjdsh flqkjdshf lqsdjh qlkdshjf lkqsdjh flqkjdsh lkqf</Text></Page2>
  </Navigation>)
}

AppRegistry.registerComponent('test', () => App)

AppRegistry.runApplication('test', {
  rootTag: document.getElementsByTagName('body')[0]
})
