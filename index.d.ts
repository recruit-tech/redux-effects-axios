import { CancelToken } from 'axios';
import { Middleware } from 'redux';
declare const methodMap: {
    read: string;
    create: string;
    update: string;
    delete: string;
};
export declare const axiosAction: import("typescript-fsa").ActionCreator<Payload<any, any>>;
declare type RequestType = keyof typeof methodMap;
declare type MethodType = 'get' | 'patch' | 'put' | 'post' | 'delete';
declare type Payload<B = any, P = any> = {
    type: RequestType;
    path: string;
    body?: B;
    params?: P;
    method: MethodType;
    cancelToken?: CancelToken;
};
export declare type AxiosFetchAction = ReturnType<typeof axiosAction>;
export declare const read: (path: string) => () => import("typescript-fsa").Action<Payload<any, any>>;
export declare const del: (path: string) => () => import("typescript-fsa").Action<Payload<any, any>>;
export declare const readByPost: <P = any>(path: string, params: P, cancelToken?: CancelToken | undefined) => () => import("typescript-fsa").Action<Payload<any, any>>;
export declare const create: <B = any>(path: string, body: B) => () => import("typescript-fsa").Action<Payload<any, any>>;
export declare const update: <B = any>(path: string, body: B) => () => import("typescript-fsa").Action<Payload<any, any>>;
export declare const reduxEffectsAxios: Middleware;
export {};
