# store2state

This library provides a robust and flexible state management solution for JavaScript and TypeScript applications, with a focus on React integration. It includes a powerful Store class, custom hooks for React, and an AsyncAction utility for handling asynchronous operations.

## Features

- De-centralized state management with subscriptions
- Efficient state updates with shallow comparison
- React hooks for easy integration (`useStore` and `useStoreSelector`)
- Asynchronous action handling with status tracking and cancelation
- TypeScript support for type-safe state management

## Installation

```bash
npm install store2state
```

## Usage

### Creating a Store

```typescript
import { createStore } from 'store2state';

const initialState = { count: 0 };
const store = createStore(initialState);
```

### Using the Store in React

```typescript
import { useStore } from 'storee2state';

function Counter() {
  const { get, set } = useStore(store);
  
  return (
    <div>
      <p>Count: {get().count}</p>
      <button onClick={() => set(state => ({ count: state.count + 1 }))}>
        Increment
      </button>
    </div>
  );
}
```

### Using Selectors

```typescript
import { useStoreSelector } from 'store2state';

function CountDisplay() {
  const count = useStoreSelector(store, state => state.count);
  
  return <p>Count: {count}</p>;
}
```

### Async Actions

```typescript
import { createAsyncAction, Status } from 'store2state';

const fetchUserAction = createAsyncAction(store, async (store, setStatus, userId) => {
  setStatus(Status.LOADING);
  try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    setStatus(Status.SUCCESS, user);
    return user;
  } catch (error) {
    setStatus(Status.ERROR, error);
    throw error;
  }
});

// Using the async action
fetchUserAction.call(123)
  .then(user => console.log(user))
  .catch(error => console.error(error));

// Checking the status
console.log(fetchUserAction.isLoading);
```

## API Reference

### `Store<State>`

The main class for state management.

- `get()`: Get the current state
- `set(newValue: SetterFunc<State>)`: Update the state
- `subscribe(eventName: string, subscriber: Subscriber<State>)`: Subscribe to state changes
- `unsubscribe(eventName: string, id: string)`: Unsubscribe from state changes
- `dispatch(eventName: string)`: Dispatch an event to subscribers

### React Hooks

- `useStore<State>(store: Store<State>)`: Hook for using the store in React components
- `useStoreSelector<State, Selected>(store: Store<State>, selector: (state: State) => Selected)`: Hook for selecting specific parts of the state

### AsyncAction

Utility for handling asynchronous operations with status tracking.

- `call(...args: Args)`: Execute the async action
- `cancel()`: Cancel the ongoing async action
- `onError(effect: AsyncActionEffect<State, ErrorPayload>)`: Add an error effect
- `onSuccess(effect: AsyncActionEffect<State, SuccessPayload>)`: Add a success effect
- `onLoading(effect: AsyncActionEffect<State, void>)`: Add a loading effect

## License

`store2state` is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Todo
- Completely decouple the library with react integration and use separate npm library to provide support to various different frameworks.    

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
