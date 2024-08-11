import { createStore, type Store } from './store';
import { SET_STATE } from './types';

describe('Store', () => {
    let store: Store<{ count: number }>;
    let mockSubscriber: jest.Mock;

    beforeEach(() => {
        store = createStore({ count: 0 });
        mockSubscriber = jest.fn();
    });

    test('should initialize with the given state', () => {
        expect(store.get()).toEqual({ count: 0 });
    });

    test('should subscribe and dispatch events correctly', () => {
        store.subscribe('testEvent', mockSubscriber);
        store.dispatch('testEvent');

        expect(mockSubscriber).toHaveBeenCalledWith({ count: 0 });
    });

    test('should unsubscribe and not call subscriber', () => {
        const id = store.subscribe('testEvent', mockSubscriber).getLastSubscriberId();
        store.unsubscribe('testEvent', id);
        store.dispatch('testEvent');

        expect(mockSubscriber).not.toHaveBeenCalled();
    });

    test('should update state and notify subscribers', () => {
        store.onSetState(mockSubscriber);
        store.set({ count: 1 });

        expect(store.get()).toEqual({ count: 1 });
        expect(mockSubscriber).toHaveBeenCalledWith({ count: 1 });
    });

    test('should handle state updates with setter function', () => {
        store.set(state => ({ count: state.count + 1 }));
        expect(store.get()).toEqual({ count: 1 });
    });

    test('should not notify subscribers if state is shallowly equal', () => {
        store.onSetState(mockSubscriber);
        store.set({ count: 0 });

        expect(mockSubscriber).not.toHaveBeenCalled();
    });

    test('should attach and detach components correctly', () => {
        const componentSubscriber = jest.fn();
        store.attachComponent(componentSubscriber);
        store.set({ count: 2 });

        expect(componentSubscriber).toHaveBeenCalledWith({ count: 2 });

        store.detachComponent();
        store.set({ count: 3 });

        expect(componentSubscriber).toHaveBeenCalledTimes(1);
    });
});
