import arachnea from "arachnea";
import { type Subscriber, type SetterFunc, SET_STATE } from "./types";
import { generateRandomString } from "./utils";

export class Store<State> {
    private state: State
    private subscriptionMap: Record<string, Array<string>>;
    private lastSubscriber: string;
    private subscribers: Record<string, Subscriber<State>>;
    private mounted: boolean;
    private mountedId: string;

    constructor(state: State) {
        this.state = state;
        this.subscribers = {};
        this.subscriptionMap = {};
        this.lastSubscriber = "";
        this.mounted = false;
        this.mountedId = "";
    }

    public get() {
        return this.state;
    }

    public subscribe(eventName: string, subscriber: Subscriber<State>) {
        if (!Object.keys(this.subscriptionMap).includes(eventName)) {
            this.subscriptionMap[eventName] = []
        }

        const id = generateRandomString(100);
        this.subscriptionMap[eventName].push(id);
        this.subscribers[id] = subscriber;
        this.lastSubscriber = id;
        return this;
    }

    public getLastSubscriberId(): string {
        return this.lastSubscriber;
    }

    public unsubscribe(eventName: string, id: string) {
        if (!Object.keys(this.subscriptionMap).includes(eventName)) {
            return this;
        }

        this.subscriptionMap[eventName] = arachnea(this.subscriptionMap[eventName])
            .remove(id)
            .collect();

        delete this.subscribers[id];
        return this;
    }

    public dispatch(eventName: string) {

        if (!this.subscriptionMap[eventName]) {
            return this;
        }

        arachnea(this.subscriptionMap[eventName])
            .forEach(id => this.subscribers[id](this.get()))
            .collect();

        return this;
    }

    public set(newValue: SetterFunc<State>) {
        let nextState: State;
        if (typeof newValue === 'function') {
            nextState = { ...this.state, ...newValue(this.state) };
        } else {
            nextState = { ...this.state, ...newValue };
        }

        if (!this.shallowEqual(this.state, nextState)) {
            this.state = nextState;
            return this.dispatch(SET_STATE);
        }
        return this;
    }

    private shallowEqual(obj1: any, obj2: any): boolean {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) return false;
        for (let key of keys1) {
            if (obj1[key] !== obj2[key]) return false;
        }
        return true;
    }

    public onSetState(subscriber: Subscriber<State>) {
        return this.subscribe(SET_STATE, subscriber);
    }

    public attachComponent(subscriber: Subscriber<State>) {
        this.mountedId = this.subscribe(SET_STATE, subscriber).getLastSubscriberId();
        return this;
    }

    public detachComponent() {
        return this.unsubscribe(SET_STATE, this.mountedId);
    }
}

export const createStore = <State>(initialState: State) => new Store(initialState);
