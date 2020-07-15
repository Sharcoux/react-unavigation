# React Universal Navigation

This package provide a component managing the navigation within your components. It is compatible with both `react-native` and `react-native-web`, making it a good tool for universal apps.

## Why?

The usual approach about navigation for React Native is to copy the hystory system form browsers. The issue is that React concept is not really compatible with the concept of retrieving data from the url. React components should depend only on the props they receive.

I created this component to provide a way of navigating between your screens on mobile and browser, in a way more compatible with React way of things.

## Install

Just run : `npm i react-unavigation`

The lib expects you to have the following peer dependencies in your project:

```
    "react-native": "^0.61.5",
    "react": "^16.13.1",
```

## Usage

This is how you can use the navigation component:

```javascript
import Navigation from 'react-unavigation'

const App = () => {
  const [active, setActive] = useState('home')
  const toHome = () => setActive('home')
  const toPage1 = () => setActive('page1')

  return (<Navigation active={active}>
    <View name='home'>
      <Text>This is the Home page</Text>
      <Button title='first page' onPress={toPage1}>
    </View>
    <View name='page1'>
      <Text>This is the first page</Text>
      <Button title='first page' onPress={toHome}>
    </View>
    <AnotherComponent name='page2' toHome={toHome} />
  </Navigation>)
}
```

The steps are simple:

1. Import the Navigation component: `import Navigation from 'react-unavigation'`
2. Create a state to define which screeen is actually active: `const [active, setActive] = useState('home')`
3. Provide the Navigation component with the name of the active screen and the list of the children `<Navigation active={active}>...(children)...</Navigation>`
4. Don't forget to give a name to each child component: `<Child name='pageName' />`

## Options

### __Animation duration__

You can provide an optional `duration` property in *ms* to the `Navigation` component. This will change the duration of the transition between the screens.

## Typescript

To use this lib with typescript, you need the children to accept the name prop. If your component doesn't, `react-unavigation` provides 2 solutions:

### Slide component

You can import the `Slide` component which is actually a Wrapper that accepts `name` as prop:

```javascript
import Navigation, { Slide } from 'react-unavigation'

const App = () => {
  const [active, setActive] = useState('home')
  const toHome = () => setActive('home')
  const toPage1 = () => setActive('page1')

  return (<Navigation active={active}>
    <Slide name='home' Component={View}>
      <Text>This is the Home page</Text>
      <Button title='first page' onPress={toPage1}>
    </View>
    <Slide name='page1' Component={View}>
      <Text>This is the first page</Text>
      <Button title='first page' onPress={toHome}>
    </View>
  </Navigation>)
}
```

The Slide component expects a name, and a Component to be displayed. It will transfer all of its other props to the Component provided.

### asSlide High Order Component

For usage with more generic components, you can use the `asSlide` HOC.

```javascript
import Navigation, { asSlide } from 'react-unavigation'

const Home = asSlide(View, 'home')
const Page1 = asSlide(View, 'page1')

const App = () => {

  const [active, setActive] = useState('home')
  const toHome = () => setActive('home')
  const toPage1 = () => setActive('page1')

  return (<Navigation active={active}>
    <Home>
      <Text>This is the Home page</Text>
      <Button title='first page' onPress={toPage1}>
    </Home>
    <Page1>
      <Text>This is the first page</Text>
      <Button title='first page' onPress={toHome}>
    </Page1>
  </Navigation>)
}
`̀``


## Miscellaneous

### __Forwarding actions to children__

I encourage users to never transfer setActive to the children of Navigation but prefer using functions like `toHome` or `toXXXScreen`. This way, if you decide to change a component's name, you won't have to change the string everywhere in your application.

### __Component not found and errors__

Of course, if you forget to add a name to your component or if you call `setActive` with a string that doesn't refer to an existing component, you will get a warning.

### __Nested Navigations__

You can use nested Navigation components to match the logic of your application. By the way, Navigation component can be used to navigate within a portion of a view. You don't need to use it only to control the whole application screen. Look at this:

```javascript
  <Navbar>
    <Button onPress={() => setActive("tab1")} title={"To tab 1"}>
    <Button onPress={() => setActive("tab2")} title={"To tab 2"}>
    <Button onPress={() => setActive("tab3")} title={"To tab 3"}>
  </Navbar>
  <Navigation active={active}>
    <Tab1 name={"tab1"} />
    <Tab2 name={"tab2"} />
    <Tab3 name={"tab3"} />
  </Navigation>
```
