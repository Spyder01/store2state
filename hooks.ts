import { useCallback, useEffect, useState } from 'react';
import { Store } from './store';
import { type SetterFunc, SET_STATE } from './types';


export const useStore = <State>(store: Store<State>) => {
    const [_, update] = useState<number>(0);
    const reRender = useCallback(() => update((count: number) => ++count), []);
    store.attachComponent(reRender);

    useEffect(() => () => { store.detachComponent() }, [store]);

    const get = () => store.get();
    const set = (setter: SetterFunc<State>) => store.set(setter);

    return { set, get, store };

}

export const useStoreSelector = <State, Selected>(
    store: Store<State>,
    selector: (state: State) => Selected
) => {
    const [selected, setSelected] = useState(() => selector(store.get()));

    useEffect(() => {
        const handler = (state: State) => {
            const newSelected = selector(state);
            if (!Object.is(newSelected, selected)) {
                setSelected(newSelected);
            }
        };
        store.onSetState(handler);
        return () => { store.unsubscribe(SET_STATE, store.getLastSubscriberId()); }
    }, [store, selector, selected]);

    return selected;
};

