import globalAxios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
} from 'axios';
import { Configuration, FilePath } from '../generated';
import { BaseAPI, BASE_PATH, RequestArgs } from '../generated/base';
import {
  assertParamExists,
  createRequestFunction,
  DUMMY_BASE_URL,
  setSearchParams,
  toPathString,
} from '../generated/common';

export const FileUploadApiAxiosParamCreator = (
  configuration?: Configuration,
) => ({
  postUsersUserIDImages: async (
    userID: number,
    file: File,
    options: AxiosRequestConfig = {},
  ): Promise<RequestArgs> => {
    // verify required parameter 'userID' is not null or undefined
    assertParamExists('postUsersUserIDImages', 'userID', userID);
    const localVarPath = `/users/{userID}/images`.replace(
      `{${'userID'}}`,
      encodeURIComponent(String(userID)),
    );
    // use dummy base URL string because the URL constructor only accepts absolute URLs.
    const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
    let baseOptions;
    if (configuration) {
      baseOptions = configuration.baseOptions;
    }

    const localVarRequestOptions = {
      method: 'POST',
      ...baseOptions,
      ...options,
    };
    const localVarHeaderParameter = {} as any;
    const localVarQueryParameter = {} as any;

    localVarHeaderParameter['Content-Type'] = 'multipart/form-data';

    const data = new FormData();
    data.append('file', file);

    setSearchParams(localVarUrlObj, localVarQueryParameter);
    const headersFromBaseOptions =
      baseOptions && baseOptions.headers ? baseOptions.headers : {};
    localVarRequestOptions.headers = {
      ...localVarHeaderParameter,
      ...headersFromBaseOptions,
      ...options.headers,
    };
    localVarRequestOptions.data = data;

    return {
      url: toPathString(localVarUrlObj),
      options: localVarRequestOptions,
    };
  },
});

export const FileUploadApiFp = (configuration?: Configuration) => {
  const localVarAxiosParamCreator =
    FileUploadApiAxiosParamCreator(configuration);
  return {
    async postUsersUserIDImages(
      userID: number,
      file: File,
      options?: AxiosRequestConfig,
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<FilePath>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.postUsersUserIDImages(
          userID,
          file,
          options,
        );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration,
      );
    },
  };
};

export interface FileUploadApiInterface {
  postUsersUserIDImages(
    userID: number,
    file: File,
    options?: AxiosRequestConfig,
  ): AxiosPromise<FilePath>;
}

export class FileUploadApi extends BaseAPI implements FileUploadApiInterface {
  public postUsersUserIDImages(
    userID: number,
    file: File,
    options?: AxiosRequestConfig,
  ) {
    return FileUploadApiFp(this.configuration)
      .postUsersUserIDImages(userID, file, options)
      .then((request) => request(this.axios, this.basePath));
  }
}
