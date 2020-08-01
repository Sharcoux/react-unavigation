import React, { useState } from 'react'
import { Text, View, AppRegistry, Button } from 'react-native'
import Navigation, { Slide, asSlide } from '.'

const Page2 = asSlide(View, '2')

const App = () => {
  const [active, setActive] = useState(0)
  return (<View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      {(new Array(3)).fill('').map((_, i) => <Button key={i} onPress={() => setActive(i)} title={'Navigate to ' + i} />)}
    </View>
    <View>
      <Navigation active={active + ''} duration={1000}>
        {/* The View below doesn't respect the type and will be ignored. In future version of typescript, it should raise an error. */}
        <View />
        <Slide name='0' style={{ backgroundColor: 'red' }} Component={View}><Text>test qsdj qsd lqjsdmlkfqj msldkfj qlskd fmqlkdjf mqkd smlqj sdlfjq sdlkjfhq lkdjsh ksdj qlksdj flqksdjh qlkjsd hflqkjdhs flqlksdjh lqkjds lfqkjdsh lfqkjds lfqkjds hlqkjdsh flqkjdshf lqsdjh qlkdshjf lkqsdjh flqkjdsh lkqf</Text></Slide>
        <Slide name='1' style={{ backgroundColor: 'blue' }} Component={View}><Text>test qsdj qsd lqjsdmlkfqj msldkfj qlskd fmqlkdjf mqkd smlqj sdlfjq sdlkjfhq lkdjsh ksdj qlksdj flqksdjh qlkjsd hflqkjdhs flqlksdjh lqkjds lfqkjdsh lfqkjds lfqkjds hlqkjdsh flqkjdshf lqsdjh qlkdshjf lkqsdjh flqkjdsh lkqf</Text></Slide>
        <Page2 name='2' style={{ backgroundColor: 'green' }}><Text>test qsdj qsd lqjsdmlkfqj msldkfj qlskd fmqlkdjf mqkd smlqj sdlfjq sdlkjfhq lkdjsh ksdj qlksdj flqksdjh qlkjsd hflqkjdhs flqlksdjh lqkjds lfqkjdsh lfqkjds lfqkjds hlqkjdsh flqkjdshf lqsdjh qlkdshjf lkqsdjh flqkjdsh lkqf</Text></Page2>
      </Navigation>
    </View>
  </View>)
}

AppRegistry.registerComponent('test', () => App)

AppRegistry.runApplication('test', {
  rootTag: document.getElementsByTagName('body')[0]
})
