import type { Store } from './store';
import arachnea from 'arachnea';

export enum Status {
    IDLE,
    LOADING,
    ERROR,
    SUCCESS,
}

export type SetAsyncStatus<SuccessPayload, ErrorPayload> = (status: Status, payload?: SuccessPayload | ErrorPayload) => void;
export type AsyncActionMethod<State, Args extends Array<unknown>, SuccessPayload, ErrorPayload> =
    (store: Store<State>, status: SetAsyncStatus<SuccessPayload, ErrorPayload>, ...args: Args) => Promise<SuccessPayload>;
export type AsyncActionEffect<State, Payload> = (store: Store<State>, payload: Payload) => void;

export class AsyncAction<State, Args extends Array<unknown>, SuccessPayload = void, ErrorPayload = Error> {
    private store: Store<State>;
    private action: AsyncActionMethod<State, Args, SuccessPayload, ErrorPayload>;
    private effectStack: {
        error: Array<AsyncActionEffect<State, ErrorPayload>>;
        loading: Array<AsyncActionEffect<State, void>>;
        success: Array<AsyncActionEffect<State, SuccessPayload>>;
    };
    private status: Status;
    private currentPromise: Promise<SuccessPayload> | null = null;
    private abortController: AbortController | null = null;

    constructor(store: Store<State>, action: AsyncActionMethod<State, Args, SuccessPayload, ErrorPayload>) {
        this.action = action;
        this.store = store;
        this.effectStack = {
            error: [],
            loading: [],
            success: [],
        };
        this.status = Status.IDLE;
    }

    onError(effect: AsyncActionEffect<State, ErrorPayload>) {
        this.effectStack.error.push(effect);
        return this;
    }

    onSuccess(effect: AsyncActionEffect<State, SuccessPayload>) {
        this.effectStack.success.push(effect);
        return this;
    }

    onLoading(effect: AsyncActionEffect<State, void>) {
        this.effectStack.loading.push(effect);
        return this;
    }

    setStatus(status: Status, payload?: SuccessPayload | ErrorPayload) {
        this.status = status;
        switch (status) {
            case Status.ERROR:
                arachnea(this.effectStack.error)
                    .forEach(effect => effect(this.store, payload as ErrorPayload))
                    .collect();
                break;
            case Status.SUCCESS:
                arachnea(this.effectStack.success)
                    .forEach(effect => effect(this.store, payload as SuccessPayload))
                    .collect();
                break;
            case Status.LOADING:
                arachnea(this.effectStack.loading)
                    .forEach(effect => effect(this.store, undefined))
                    .collect();
                break;
        }
    }

    async call(...args: Args): Promise<SuccessPayload> {
        if (this.currentPromise) {
            this.cancel();
        }

        this.abortController = new AbortController();
        const { signal } = this.abortController;

        this.setStatus(Status.LOADING);

        this.currentPromise = this.action(
            this.store,
            (status, payload) => {
                if (!signal.aborted) {
                    this.setStatus(status, payload);
                }
            },
            ...args
        );

        try {
            const result = await this.currentPromise;
            if (!signal.aborted) {
                this.setStatus(Status.SUCCESS, result);
            }
            return result;
        } catch (error) {
            if (!signal.aborted) {
                this.setStatus(Status.ERROR, error as ErrorPayload);
            }
            throw error;
        } finally {
            this.currentPromise = null;
            this.abortController = null;
        }
    }

    cancel() {
        if (this.abortController) {
            this.abortController.abort();
            this.currentPromise = null;
            this.abortController = null;
            this.setStatus(Status.IDLE);
        }
    }

    get isLoading(): boolean {
        return this.status === Status.LOADING;
    }

    get isSuccess(): boolean {
        return this.status === Status.SUCCESS;
    }

    get isError(): boolean {
        return this.status === Status.ERROR;
    }

    get isIdle(): boolean {
        return this.status === Status.IDLE;
    }
}

export const createAsyncAction = <State, Args extends Array<unknown>, SuccessPayload = void, ErrorPayload = Error>(
    store: Store<State>,
    action: AsyncActionMethod<State, Args, SuccessPayload, ErrorPayload>
) => new AsyncAction(store, action);
