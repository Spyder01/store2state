export type Subscriber<State> = (state: State) => void;
export type SetterFunc<State> = Partial<State> | ((initialState: State) => Partial<State>);
export const SET_STATE = "setState";

