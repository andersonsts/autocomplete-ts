# ❓ QUESTIONS

**1. What is the difference between Component and PureComponent? give an
example where it might break my app.**

*A pure component is a component follow rules like:* <br/>
*- given the same input props it should render the same JSX* <br/>
*- these components must not have side effects.* <br/>
*- these components should not be regard anything that existed before render*<br/>
  
Ex1: 
```jsx
  function Button({ label }) {
    return <button>{label}</buttton>
  };

  <Button label="Pietro" />
  <Button label="Bru" />
  <Button label="Pietro" />
```
*The button component always will return and button element with label into it, given the same label prop value. Therefore, the example above is a pure component.*

Ex2: 
```jsx
function ButtonImpure({ label }) {
  let currentDate = new Date()
  return <button>{label} + {currentDate}</buttton>
};

<Button label="Pietro" /> // <button>Pietro + Fri Oct 01 2022 11:34:47 GMT-0300</button>
<Button label="Bru" />
<Button label="Pietro" /> // <button>Pietro + Fri Oct 02 2022 11:34:59</button>
```
*As you can see we have a different behavior. We passed the same prop Pietro, but we had different JSX rendered. In that case the component is impure, because it break the rule of same input props same output JSX. This behavior can break your app cause you can expect always the same JSX, but it does not happens in impure components.*
<br />
<br />

**2. Context + ShouldComponentUpdate might be dangerous. Can think of why is that?**

*Sometimes we wish update a state in a context and unfortunately some of the components not update its state as we expected according the update made in context. This happens because PureComponent implements ShouldComponentUpdate to maintain performance and if this component does not receive new props, it will not update its state, even we wish that because we update some state in context* <br />

Ex1: 
```jsx
class ListNames extends React.PureComponent {
  render() {
    return (<ul>
      {this.props.names.map(name => (
        <li key={name}><Highlight>{name}</Highlight></li>
      )}
    </ul>)
  }
};

class App extends React.Component {
  constructor(p, c) {
    super(p, c)
    this.state = { color: "blue" } 
  }

  render() {
    return <HighlightProvider color={this.state.color}>
      <button onClick={this.changeColor.bind(this)}>
      	<Highlight>Change Color</Highlight>
      </button>
      <ListNames names={['Pedro', 'Sousa']} />
    </HighlightProvider>
  }
  
  changeColor() {
    this.setState({ color: "blue" })
  }
}

class HighlightProvider extends React.Component {
  getChildContext() {
    return {color: this.props.color}
  }

  render() {
    return <div>{this.props.children}</div>
  }
}

class Highlight extends React.Component {
  render() {
    return <div style={{color: this.context.color}}>
      {this.props.children}
    </div>
  }
}
```

*When we click in button to change color, our ListNames component will not change the color name of Highlight component inside ListNames component. That happens because ListNames does not received new props (new names), therefore it will not render as we expected.* 
<br />
<br />

**3. Describe 3 ways to pass information from a component to its PARENT.**

Ex1: We can pass a function as props in Child component and receive the result in the Parent component. in that case, we're sending 'information' value from Child component to Parent component.
```jsx
function Parent() {
  function handleClick(information) {
    // made something...
  }

  return (
    <Child onClick={handleClick} />
  )
};

function Child({ onClick }) {
  return <button onClick={() => onClick('information')}>Click</button>
};
```

Ex2: We can use context. We're gonna need enclose components with context provider and create the information state and function to update the state inside the ContextProvider created.
```jsx
const SomeCtx = createContext()

function Parent() {
  const ctx = useContext(SomeCtx)
  const { information } = ctx

  return (
    <Child />
  )
};

function Child() {
  const ctx = useContext(SomeCtx)

  function handleClick() {
    ctx.setInformation('some-information')
  }
  return <button onClick={handleClick}>Click</button>
};

function App() {
  const [information, setInformation] = useState('')
  return (
    <SomeCtx.Provider value={{ information, setInformation }}>
      <Parent />
      <Child />
    </SomeCtx.Provide>
  )
}
```

Ex3: We can use Redux, Zustand or some other manage state library.
```jsx
function List() {
  const pokemons = useStore((state) => state.pokemons);

  return (
    <div>
      {pokemons.map(pokemon => (
        <li key={pokemon.id}>{pokemon.name}</li>
      ))}
    </div>
  )
};

function Child() {
  const addPokemon = useStore((state) => state.removePokemon);

  function handleClick() {
    addPokemon('Pikachu')
  }
  return <button onClick={handleClick}>Click</button>
};
```
<br/>
<br/>

**4. Give 2 ways to prevent components from re-rendering.** <br />

Ex1: We can use children prop.
```jsx
function Child() {
  // that component WILL NOT RERENDER when state in Parent component change
  return <h1>Something...</h1>
};

function Parent({ children }) {
  const [state, setState] = useState('')

  return <div>{children}</div>
};

function MyApp() {
  return (
    <Parent>
      <Child />
    </Parent>
  )
};
```

Ex2: We can pass a component like prop.
```jsx
function Child() {
  // that component WILL NOT RERENDER when state in Parent component change
  return <h1>Something...</h1>
};

function Parent({ child }) {
  const [state, setState] = useState('')

  return <div>{child}</div>
};

function MyApp() {
  return (
    <Parent child={Child} />
  )
};
```

Ex3: We can memoize the component.
```jsx
const HugeComponent = memo(() => {
  // that component WILL NOT RERENDER when state in MyApp component change
  return <h1>Something...</h1>
})

function Parent({ child }) {
  return <div>Parent</div>
};

function MyApp() {
  const [state, setState] = useState('')

  return (
    <>
      <Parent />
      <HugeComponent />
    </>
  )
};
```
<br />
<br />

**5. What is a fragment and why do we need it? Give an example where it might
break my app.** <br />

*Fragment is syntax responsible for wrap a lot of react elements without create a new element in DOM like a div or any other*

Ex1:
```jsx
function MyApp() {
  // It will return an error to us, because i cant return a lot of components in reactjs without wrapper them with an element. This element can be another component, an div or even better: A Fragment
  return (
    <Component />
    <Component />
  )
};

function MyApp() {
  // It works!
  return (
    <>
      <Component />
      <Component />
    </>
  )
};
```

Ex2: Wonder you wish make a layout which you put Logo component in the left and UserInfo and Config (together) component in the right side of Header component. You can think that we can wrap the UserInfo and Config in an fragment. It'll not work, because Fragment does not create a DOM Node to us.
```jsx
function Header() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Logo />

      <>
        <UserInfo />
        <Config />
      </>
    </div>
  )
};
```
<br />
<br />

**6. Give 3 examples of the HOC pattern.**
Ex1:
```jsx
export function withIdentifierAge(Component) {
  return (hocProps) => {
    const isOld = getCurrentAge(hocProps.userId) > 60

    return (
      <Component
        {...hocProps}
        isOld={isOld}
      />
    )
  }
};

function Person({ isOld }) {
  return isOld ? 'Old' : 'Not old'
}

const PersonHOC = withIdentifierAge(Person)
```

Ex2:
```jsx
export function c(Component) {
  return (hocProps) => {
    const isAdmin = getRole(hocProps.userId) === 'ADMIN'

    return (
      <Component
        {...hocProps}
        isAdmin={isAdmin}
      />
    )
  }
};

function Person({ isAdmin }) {
  return isAdmin ? <AdminDash /> : <CustomerDash />
}

const PersonHOC = validateRole(Person)
```

Ex3:
```jsx
import { ComponentType, useCallback, useState } from "react";

export function withTimer(Component) {
  return (hocProps) => {
    const [count, setCount] = useState(0);
    const [timer, setTimer] = useState(-1);

    const startTimer = useCallback(() => {
      const timer = setInterval(
        () =>
          setCount((previous) => {
            return previous + 1;
          }),
        1000
      );
      setTimer(timer);
    }, []);

    const endTimer = useCallback(() => {
      clearInterval(timer);
      setCount(0);
    }, [timer]);

    return (
      <Component
        {...hocProps}
        startTimer={startTimer}
        endTimer={endTimer}
        count={count}
      />
    );
  };
}

const Component = ({ count, startTimer, endTimer }) => {
  useEffect(() => {
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    if (count === 10) {
      endTimer();
    }
  }, [count, endTimer]);

  return <p>{count}</p>;
}

const ComponentWithTimer = withTimer(Component)
```
<br />
<br />

**7. what's the difference in handling exceptions in promises, callbacks and
async...await.**

Ex1: Promises
```js
  function call() {
    return new Promise((_, reject) => reject('error'))
  }

  function doCall() {
    call()
      .then(res => console.log('response', res))
      .catch(err => console.log('I"m handling the expection here': err))
  }
``` 

Ex2: Callback
```js
  function call(userId = '', callback) {
    setTimeout(() => {
      if (!userId) {
        callback(new Error("User id is required."));
        return;
      }
      const userData = getData(userId)
      callback(null, userData);
    }, 1000);
  }
  
  let callback = (error, userData) => {
    if (error !== null) {
      console.log("Handling error here: " + String(error));
      return;
    }
    console.log("User data", userData);
  };
``` 


Ex2: Async Await
```js
  function call() {
    return new Promise((_, reject) => reject('error'))
  }

  async function doCall() {
    try {
      const response = await call()
      console.log(response)
    } catch (err) {
      console.log("Handling error here: " + String(error));
    }
  }
``` 
<br/>
<br/>

**8. How many arguments does setState take and why is it async.**

*Set State take two arguments. The first one can be a object or a callback function and it used to update the state object. The second one is a function that always run after setState run. Set State is nature async because multiple calls of set state are batched before component rendered, thats the reason the set state take a time to update the current state.*
<br/>
<br/>

**9. List the steps needed to migrate a Class to Function Component.**

*- Identify the props, states and functions inside the component and replace class syntax for function syntax* <br />

Ex1:
```jsx
// class component
class App extends Component {
  state = {
    name: 'Ander',
    age: 12
  }

  componentDidMount() {
    this.setState({
      name: 'Pietro',
      age: 40,
    });
  }

  logInfo = () => {
    console.log(this.state.name);
    console.log(this.state.age);
  };

  handleUserNameInput = e => {
    this.setState({ name: e.target.value });
  };
  handleAgeInput = e => {
    this.setState({ age: e.target.value });
  };

  render() {
    return (
      <div>
        <input
          placeholder="Your Name"
          type="text"
          onChange={this.handleUserNameInput}
          value={this.state.name}
        />
        <input
          type="number"
          onChange={this.handleAgeInput}
          value={this.state.age}
          placeholder="Your Age"
        />
        <button onClick={this.logInfo}>
          Log User Information
        </button>
      </div>
    );
  }
}

// Equivalent functional component
function App() {
  const [name, setName] = useState('Ander');
  const [age, setAge] = useState(12);

  useEffect(() => {
    setName('Pietro');
    setAge(40);
  }, []);

  const logInfo = () => {
    console.log(name);
    console.log(age);
  };

  const handleUserNameInput = e => {
    this.setState({ name: e.target.value });
  };
  const handleAgeInput = e => {
    this.setState({ age: e.target.value });
  };

  return (
    <div>
      <input
        placeholder="Your Name"
        type="text"
        onChange={handleUserNameInput}
        value={name}
      />
      <input
        type="number"
        onChange={handleAgeInput}
        value={age}
        placeholder="Your Age"
      />
      <button onClick={logInfo}>
        Log User Information
      </button>
    </div>
  );
};
```
<br />
<br />

**9. List the steps needed to migrate a Class to Function Component.**

Ex1: Inline CSS
```jsx
  function Button() {
    return <button style={{ background: 'red' }}>CLICK</button>
  }
```
Ex2: Importing CSS files
```css
.btn {   /* index.css */
  color: red;
}
```

```jsx
import './styles.css'

function Button() {
  return <button className="btn">CLICK</button>
}
```
Ex2: Importing CSS files
```css
.btn {   /* styles.css */
  color: red;
}
```
Ex3: Styled components
```js
// styles.js
import styled from 'styled-components'
export const ContainerBtn = styled.button`
  color: red;
`
```
```jsx
import { ContainerBtn } from './index.js'

function Button() {
  return <ContainerBtn className="btn">CLICK</ContainerBtn>
}
```
<br />
<br />

**11. How to render an HTML string coming from the server.**
```jsx
function Component() {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: stringHtmlFromServer }}
    />
  )
}
```

