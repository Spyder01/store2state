# ⚡ store2state

**store2state** is a robust and flexible state management library for JavaScript and TypeScript, designed with a focus on **React integration** and easy extensibility to other frameworks.  
It provides a powerful `Store` class, `AsyncAction` utility for async flows, and custom React hooks for reactive state access.

---

## 🎃 Hacktoberfest 2025

🎉 **store2state is participating in [Hacktoberfest 2025](https://hacktoberfest.com)!**  
Whether you’re new to open source or an experienced TypeScript dev — we’d love your contributions!

We’ve labeled issues with:

- `good first issue` → beginner-friendly
- `help wanted` → community support needed
- `hacktoberfest` → counts toward Hacktoberfest contributions

> 💡 All merged, approved, or `hacktoberfest-accepted` pull requests will count for Hacktoberfest 2025!

---

### 🧩 How to Contribute

1. **Star this repo** 🌟
2. **Fork** and clone it locally
3. Pick an issue labeled `good first issue` or `help wanted`
4. Create a feature branch
5. **Make your change** (bug fix, doc update, new feature)
6. Open a **Pull Request** with a clear description

You can also propose new ideas or file improvement issues!

---

### 🪄 Great Starter Ideas

Here are a few easy and impactful ways to contribute:

- 🧠 **Docs:** Improve README examples or add JSDoc comments
- 🧩 **React Hooks:** Add a hook for derived/computed state
- 🧪 **Testing:** Add unit tests for the `Store` or `AsyncAction` classes
- 🧰 **TypeScript:** Improve generic types for better inference
- ⚙️ **New Feature:** Add `createVueStore` or `createSvelteStore` wrappers
- 🪶 **Performance:** Optimize shallow comparison logic

---

## 🚀 Features

- De-centralized state management with subscriptions
- Efficient state updates with shallow comparison
- React hooks for easy integration (`useStore`, `useStoreSelector`)
- Asynchronous action handling with status tracking and cancellation
- TypeScript support for type-safe state management

---

## 📦 Installation

```bash
npm install store2state
```

---

## 🧭 Usage

### Creating a Store

```typescript
import { createStore } from "store2state";

const initialState = { count: 0 };
const store = createStore(initialState);
```

### Using the Store in React

```typescript
import { useStore } from "store2state";

function Counter() {
  const { get, set } = useStore(store);

  return (
    <div>
      <p>Count: {get().count}</p>
      <button onClick={() => set((state) => ({ count: state.count + 1 }))}>
        Increment
      </button>
    </div>
  );
}
```

### Using Selectors

```typescript
import { useStoreSelector } from "store2state";

function CountDisplay() {
  const count = useStoreSelector(store, (state) => state.count);
  return <p>Count: {count}</p>;
}
```

### Async Actions

```typescript
import { createAsyncAction, Status } from "store2state";

const fetchUserAction = createAsyncAction(
  store,
  async (store, setStatus, userId) => {
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
  }
);
```

### Management of form state

```typescript
import { createStore, useStore } from "store2state";

const formStore = createStore({ name: "", email: "" });

export function ContactForm() {
  const { get, set } = useStore(formStore);

  const handleChange = (e) => {
    const { name, value } = e.target;
    set((state) => ({ ...state, [name]: value }));
  };
  return (
    <form>
      <input
        name="name"
        value={get().name}
        onChange={handleChange}
        placeholder="Your name"
      />
      <input
        name="email"
        value={get().email}
        onChange={handleChange}
        placeholder="Your email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Syncing with local storage

```typescript
import { createStore, useStore } from "store2state";

const settingsStore = createStore({
  theme: localStorage.getItem("theme") || "light",
});

settingsStore.subscribe((state) => {
  localStorage.setItem("theme", state.theme);
});

export function ThemeSwitcher() {
  const { get, set } = useStore(settingsStore);
  return (
    <button
      onClick={() => set({ theme: get().theme === "light" ? "dark" : "light" })}
    >
      Toggle Theme (Current: {get().theme})
    </button>
  );
}
```

### Fetching API Data with Async Actions

```typescript
import { createStore, createAsyncAction, useStore } from "store2state";

const userStore = createStore({ user: null, loading: false });

const fetchUser = createAsyncAction(userStore, async (store, setStatus, id) => {
  setStatus("loading");
  const res = await fetch(`/api/users/${id}`);
  const data = await res.json();
  store.set({ user: data });
  setStatus("success");
});

export function UserProfile({ userId }) {
  const { get } = useStore(userStore);

  React.useEffect(() => {
    fetchUser(userId);
  }, [userId]);
  if (get().loading) return <p>Loading...</p>;
  if (!get().user) return <p>No user found.</p>;
  return <p>Welcome, {get().user.name}!</p>;
}
```

---

## 📘 API Reference

_(unchanged — your original section here)_

---

## 🧩 Roadmap

- [ ] Decouple React integration into `@store2state/react`
- [ ] Add framework-agnostic hooks (Vue, Svelte, Solid)
- [ ] Add unit tests and benchmarks
- [ ] Add middleware support (e.g., for logging or persistence)

---

## 🤝 Contributing

Pull requests are welcome!
Before submitting:

- Ensure your code is formatted with `prettier`
- Include tests for new features
- Update or improve documentation if applicable

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).

---
