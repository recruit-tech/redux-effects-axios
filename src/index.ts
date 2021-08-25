import { CancelToken, AxiosInstance } from "axios";
import { AnyAction, Dispatch, Middleware } from "redux";
import { actionCreatorFactory } from "typescript-fsa";

const methodMap = {
  read: "get",
  create: "post",
  update: "put",
  delete: "delete"
};

const actionCreator = actionCreatorFactory();
export const axiosAction = actionCreator<Payload>("EFFECT_FETCHR");

type RequestType = keyof typeof methodMap;
type MethodType = "get" | "patch" | "put" | "post" | "delete";
type Payload<B = any, P = any> = {
  type: RequestType;
  path: string;
  body?: B;
  params?: P;
  method: MethodType;
  cancelToken?: CancelToken;
};
export type AxiosFetchAction = ReturnType<typeof axiosAction>;

const typeToMethod = (type: RequestType) => methodMap[type] as MethodType;

const reqFactory = (axiosInstance: AxiosInstance) => async <T = any, D = any, P = any>(
  requestConfig:
    | {
        method: "patch" | "put" | "post";
        url: string;
        params: P;
        data: D;
        cancelToken?: CancelToken;
      }
    | {
        method: "get" | "delete";
        url: string;
        params: P;
        cancelToken?: CancelToken;
      }
) => {
  const response = await axiosInstance.request<{ results: T }>(requestConfig);
  return { result: response.data };
};

export const read = (
  path: string,
  params = {},
  cancelToken?: CancelToken
) => (): AxiosFetchAction =>
  axiosAction({
    type: "read",
    path,
    params,
    method: typeToMethod("read"),
    cancelToken
  });

export const del = (path: string) => (): AxiosFetchAction =>
  axiosAction({
    type: "delete",
    path,
    method: typeToMethod("delete")
  });

export const create = <B = any>(
  path: string,
  body: B
) => (): AxiosFetchAction =>
  axiosAction({
    type: "read",
    path,
    body,
    method: typeToMethod("read")
  });

export const update = <B = any>(
  path: string,
  body: B
) => (): AxiosFetchAction =>
  axiosAction({
    type: "update",
    path,
    body,
    method: typeToMethod("update")
  });

export const reduxEffectsAxios = (
  axiosInstance: AxiosInstance
): Middleware => {
  const request = reqFactory(axiosInstance)
  return () => (next: Dispatch<AnyAction>) => async (
    action: AnyAction | AxiosFetchAction
  ) => {
    if (action.type !== axiosAction.type) return next(action);
    const { method, path, body, params, cancelToken } = action.payload;

    if (method === "get" || method === "delete") {
      return request({
        method,
        url: path,
        params,
        cancelToken
      });
    } else {
      return request({
        method,
        url: path,
        params,
        data: body,
        cancelToken
      });
    }
  };
};
