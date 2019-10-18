/*
 * Woleet.ID Server
 * This is Woleet.ID Server API documentation.
 *
 * OpenAPI spec version: 1.2.1
 * Contact: contact@woleet.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


package io.woleet.idserver.api;

import io.woleet.idserver.ApiCallback;
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.ApiResponse;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.Pair;
import io.woleet.idserver.ProgressRequestBody;
import io.woleet.idserver.ProgressResponseBody;

import com.google.gson.reflect.TypeToken;

import java.io.IOException;


import io.woleet.idserver.api.model.APIError;
import io.woleet.idserver.api.model.APITokenBase;
import io.woleet.idserver.api.model.APITokenGet;
import io.woleet.idserver.api.model.APITokenPost;
import io.woleet.idserver.api.model.APITokenPut;
import java.util.UUID;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ApiTokenApi {
    private ApiClient apiClient;

    public ApiTokenApi() {
        this(Configuration.getDefaultApiClient());
    }

    public ApiTokenApi(ApiClient apiClient) {
        this.apiClient = apiClient;
    }

    public ApiClient getApiClient() {
        return apiClient;
    }

    public void setApiClient(ApiClient apiClient) {
        this.apiClient = apiClient;
    }

    /**
     * Build call for createAPIToken
     * @param apITokenPost API token object to create. (required)
     * @param progressListener Progress listener
     * @param progressRequestListener Progress request listener
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     */
    public com.squareup.okhttp.Call createAPITokenCall(APITokenPost apITokenPost, final ProgressResponseBody.ProgressListener progressListener, final ProgressRequestBody.ProgressRequestListener progressRequestListener) throws ApiException {
        Object localVarPostBody = apITokenPost;

        // create path and map variables
        String localVarPath = "/api-token";

        List<Pair> localVarQueryParams = new ArrayList<Pair>();
        List<Pair> localVarCollectionQueryParams = new ArrayList<Pair>();
        Map<String, String> localVarHeaderParams = new HashMap<String, String>();
        Map<String, Object> localVarFormParams = new HashMap<String, Object>();
        final String[] localVarAccepts = {
            "application/json"
        };
        final String localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        if (localVarAccept != null) {
            localVarHeaderParams.put("Accept", localVarAccept);
        }

        final String[] localVarContentTypes = {
            "application/json"
        };
        final String localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);
        localVarHeaderParams.put("Content-Type", localVarContentType);

        if (progressListener != null) {
            apiClient.getHttpClient().networkInterceptors().add(new com.squareup.okhttp.Interceptor() {
                @Override
                public com.squareup.okhttp.Response intercept(com.squareup.okhttp.Interceptor.Chain chain) throws IOException {
                    com.squareup.okhttp.Response originalResponse = chain.proceed(chain.request());
                    return originalResponse.newBuilder()
                    .body(new ProgressResponseBody(originalResponse.body(), progressListener))
                    .build();
                }
            });
        }

        String[] localVarAuthNames = new String[] { "CookieAuth" };
        return apiClient.buildCall(localVarPath, "POST", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarFormParams, localVarAuthNames, progressRequestListener);
    }

    @SuppressWarnings("rawtypes")
    private com.squareup.okhttp.Call createAPITokenValidateBeforeCall(APITokenPost apITokenPost, final ProgressResponseBody.ProgressListener progressListener, final ProgressRequestBody.ProgressRequestListener progressRequestListener) throws ApiException {
        
        // verify the required parameter 'apITokenPost' is set
        if (apITokenPost == null) {
            throw new ApiException("Missing the required parameter 'apITokenPost' when calling createAPIToken(Async)");
        }
        

        com.squareup.okhttp.Call call = createAPITokenCall(apITokenPost, progressListener, progressRequestListener);
        return call;

    }

    /**
     * Create an API token.
     * 
     * @param apITokenPost API token object to create. (required)
     * @return APITokenGet
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     */
    public APITokenGet createAPIToken(APITokenPost apITokenPost) throws ApiException {
        ApiResponse<APITokenGet> resp = createAPITokenWithHttpInfo(apITokenPost);
        return resp.getData();
    }

    /**
     * Create an API token.
     * 
     * @param apITokenPost API token object to create. (required)
     * @return ApiResponse&lt;APITokenGet&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     */
    public ApiResponse<APITokenGet> createAPITokenWithHttpInfo(APITokenPost apITokenPost) throws ApiException {
        com.squareup.okhttp.Call call = createAPITokenValidateBeforeCall(apITokenPost, null, null);
        Type localVarReturnType = new TypeToken<APITokenGet>(){}.getType();
        return apiClient.execute(call, localVarReturnType);
    }

    /**
     * Create an API token. (asynchronously)
     * 
     * @param apITokenPost API token object to create. (required)
     * @param callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     */
    public com.squareup.okhttp.Call createAPITokenAsync(APITokenPost apITokenPost, final ApiCallback<APITokenGet> callback) throws ApiException {

        ProgressResponseBody.ProgressListener progressListener = null;
        ProgressRequestBody.ProgressRequestListener progressRequestListener = null;

        if (callback != null) {
            progressListener = new ProgressResponseBody.ProgressListener() {
                @Override
                public void update(long bytesRead, long contentLength, boolean done) {
                    callback.onDownloadProgress(bytesRead, contentLength, done);
                }
            };

            progressRequestListener = new ProgressRequestBody.ProgressRequestListener() {
                @Override
                public void onRequestProgress(long bytesWritten, long contentLength, boolean done) {
                    callback.onUploadProgress(bytesWritten, contentLength, done);
                }
            };
        }

        com.squareup.okhttp.Call call = createAPITokenValidateBeforeCall(apITokenPost, progressListener, progressRequestListener);
        Type localVarReturnType = new TypeToken<APITokenGet>(){}.getType();
        apiClient.executeAsync(call, localVarReturnType, callback);
        return call;
    }
    /**
     * Build call for deleteAPIToken
     * @param apITokenId Identifier of the API token. (required)
     * @param progressListener Progress listener
     * @param progressRequestListener Progress request listener
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     */
    public com.squareup.okhttp.Call deleteAPITokenCall(UUID apITokenId, final ProgressResponseBody.ProgressListener progressListener, final ProgressRequestBody.ProgressRequestListener progressRequestListener) throws ApiException {
        Object localVarPostBody = new Object();

        // create path and map variables
        String localVarPath = "/api-token/{APITokenId}"
            .replaceAll("\\{" + "APITokenId" + "\\}", apiClient.escapeString(apITokenId.toString()));

        List<Pair> localVarQueryParams = new ArrayList<Pair>();
        List<Pair> localVarCollectionQueryParams = new ArrayList<Pair>();
        Map<String, String> localVarHeaderParams = new HashMap<String, String>();
        Map<String, Object> localVarFormParams = new HashMap<String, Object>();
        final String[] localVarAccepts = {
            "application/json"
        };
        final String localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        if (localVarAccept != null) {
            localVarHeaderParams.put("Accept", localVarAccept);
        }

        final String[] localVarContentTypes = {
            
        };
        final String localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);
        localVarHeaderParams.put("Content-Type", localVarContentType);

        if (progressListener != null) {
            apiClient.getHttpClient().networkInterceptors().add(new com.squareup.okhttp.Interceptor() {
                @Override
                public com.squareup.okhttp.Response intercept(com.squareup.okhttp.Interceptor.Chain chain) throws IOException {
                    com.squareup.okhttp.Response originalResponse = chain.proceed(chain.request());
                    return originalResponse.newBuilder()
                    .body(new ProgressResponseBody(originalResponse.body(), progressListener))
                    .build();
                }
            });
        }

        String[] localVarAuthNames = new String[] { "CookieAuth" };
        return apiClient.buildCall(localVarPath, "DELETE", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarFormParams, localVarAuthNames, progressRequestListener);
    }

    @SuppressWarnings("rawtypes")
    private com.squareup.okhttp.Call deleteAPITokenValidateBeforeCall(UUID apITokenId, final ProgressResponseBody.ProgressListener progressListener, final ProgressRequestBody.ProgressRequestListener progressRequestListener) throws ApiException {
        
        // verify the required parameter 'apITokenId' is set
        if (apITokenId == null) {
            throw new ApiException("Missing the required parameter 'apITokenId' when calling deleteAPIToken(Async)");
        }
        

        com.squareup.okhttp.Call call = deleteAPITokenCall(apITokenId, progressListener, progressRequestListener);
        return call;

    }

    /**
     * Delete an API token.
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @return APITokenGet
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     */
    public APITokenGet deleteAPIToken(UUID apITokenId) throws ApiException {
        ApiResponse<APITokenGet> resp = deleteAPITokenWithHttpInfo(apITokenId);
        return resp.getData();
    }

    /**
     * Delete an API token.
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @return ApiResponse&lt;APITokenGet&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     */
    public ApiResponse<APITokenGet> deleteAPITokenWithHttpInfo(UUID apITokenId) throws ApiException {
        com.squareup.okhttp.Call call = deleteAPITokenValidateBeforeCall(apITokenId, null, null);
        Type localVarReturnType = new TypeToken<APITokenGet>(){}.getType();
        return apiClient.execute(call, localVarReturnType);
    }

    /**
     * Delete an API token. (asynchronously)
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @param callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     */
    public com.squareup.okhttp.Call deleteAPITokenAsync(UUID apITokenId, final ApiCallback<APITokenGet> callback) throws ApiException {

        ProgressResponseBody.ProgressListener progressListener = null;
        ProgressRequestBody.ProgressRequestListener progressRequestListener = null;

        if (callback != null) {
            progressListener = new ProgressResponseBody.ProgressListener() {
                @Override
                public void update(long bytesRead, long contentLength, boolean done) {
                    callback.onDownloadProgress(bytesRead, contentLength, done);
                }
            };

            progressRequestListener = new ProgressRequestBody.ProgressRequestListener() {
                @Override
                public void onRequestProgress(long bytesWritten, long contentLength, boolean done) {
                    callback.onUploadProgress(bytesWritten, contentLength, done);
                }
            };
        }

        com.squareup.okhttp.Call call = deleteAPITokenValidateBeforeCall(apITokenId, progressListener, progressRequestListener);
        Type localVarReturnType = new TypeToken<APITokenGet>(){}.getType();
        apiClient.executeAsync(call, localVarReturnType, callback);
        return call;
    }
    /**
     * Build call for getAPITokenById
     * @param apITokenId Identifier of the API token. (required)
     * @param progressListener Progress listener
     * @param progressRequestListener Progress request listener
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     */
    public com.squareup.okhttp.Call getAPITokenByIdCall(UUID apITokenId, final ProgressResponseBody.ProgressListener progressListener, final ProgressRequestBody.ProgressRequestListener progressRequestListener) throws ApiException {
        Object localVarPostBody = new Object();

        // create path and map variables
        String localVarPath = "/api-token/{APITokenId}"
            .replaceAll("\\{" + "APITokenId" + "\\}", apiClient.escapeString(apITokenId.toString()));

        List<Pair> localVarQueryParams = new ArrayList<Pair>();
        List<Pair> localVarCollectionQueryParams = new ArrayList<Pair>();
        Map<String, String> localVarHeaderParams = new HashMap<String, String>();
        Map<String, Object> localVarFormParams = new HashMap<String, Object>();
        final String[] localVarAccepts = {
            "application/json"
        };
        final String localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        if (localVarAccept != null) {
            localVarHeaderParams.put("Accept", localVarAccept);
        }

        final String[] localVarContentTypes = {
            
        };
        final String localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);
        localVarHeaderParams.put("Content-Type", localVarContentType);

        if (progressListener != null) {
            apiClient.getHttpClient().networkInterceptors().add(new com.squareup.okhttp.Interceptor() {
                @Override
                public com.squareup.okhttp.Response intercept(com.squareup.okhttp.Interceptor.Chain chain) throws IOException {
                    com.squareup.okhttp.Response originalResponse = chain.proceed(chain.request());
                    return originalResponse.newBuilder()
                    .body(new ProgressResponseBody(originalResponse.body(), progressListener))
                    .build();
                }
            });
        }

        String[] localVarAuthNames = new String[] { "CookieAuth" };
        return apiClient.buildCall(localVarPath, "GET", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarFormParams, localVarAuthNames, progressRequestListener);
    }

    @SuppressWarnings("rawtypes")
    private com.squareup.okhttp.Call getAPITokenByIdValidateBeforeCall(UUID apITokenId, final ProgressResponseBody.ProgressListener progressListener, final ProgressRequestBody.ProgressRequestListener progressRequestListener) throws ApiException {
        
        // verify the required parameter 'apITokenId' is set
        if (apITokenId == null) {
            throw new ApiException("Missing the required parameter 'apITokenId' when calling getAPITokenById(Async)");
        }
        

        com.squareup.okhttp.Call call = getAPITokenByIdCall(apITokenId, progressListener, progressRequestListener);
        return call;

    }

    /**
     * Get an API token by its identifier.
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @return APITokenGet
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     */
    public APITokenGet getAPITokenById(UUID apITokenId) throws ApiException {
        ApiResponse<APITokenGet> resp = getAPITokenByIdWithHttpInfo(apITokenId);
        return resp.getData();
    }

    /**
     * Get an API token by its identifier.
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @return ApiResponse&lt;APITokenGet&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     */
    public ApiResponse<APITokenGet> getAPITokenByIdWithHttpInfo(UUID apITokenId) throws ApiException {
        com.squareup.okhttp.Call call = getAPITokenByIdValidateBeforeCall(apITokenId, null, null);
        Type localVarReturnType = new TypeToken<APITokenGet>(){}.getType();
        return apiClient.execute(call, localVarReturnType);
    }

    /**
     * Get an API token by its identifier. (asynchronously)
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @param callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     */
    public com.squareup.okhttp.Call getAPITokenByIdAsync(UUID apITokenId, final ApiCallback<APITokenGet> callback) throws ApiException {

        ProgressResponseBody.ProgressListener progressListener = null;
        ProgressRequestBody.ProgressRequestListener progressRequestListener = null;

        if (callback != null) {
            progressListener = new ProgressResponseBody.ProgressListener() {
                @Override
                public void update(long bytesRead, long contentLength, boolean done) {
                    callback.onDownloadProgress(bytesRead, contentLength, done);
                }
            };

            progressRequestListener = new ProgressRequestBody.ProgressRequestListener() {
                @Override
                public void onRequestProgress(long bytesWritten, long contentLength, boolean done) {
                    callback.onUploadProgress(bytesWritten, contentLength, done);
                }
            };
        }

        com.squareup.okhttp.Call call = getAPITokenByIdValidateBeforeCall(apITokenId, progressListener, progressRequestListener);
        Type localVarReturnType = new TypeToken<APITokenGet>(){}.getType();
        apiClient.executeAsync(call, localVarReturnType, callback);
        return call;
    }
    /**
     * Build call for getAllAPITokens
     * @param progressListener Progress listener
     * @param progressRequestListener Progress request listener
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     */
    public com.squareup.okhttp.Call getAllAPITokensCall(final ProgressResponseBody.ProgressListener progressListener, final ProgressRequestBody.ProgressRequestListener progressRequestListener) throws ApiException {
        Object localVarPostBody = new Object();

        // create path and map variables
        String localVarPath = "/api-token/list";

        List<Pair> localVarQueryParams = new ArrayList<Pair>();
        List<Pair> localVarCollectionQueryParams = new ArrayList<Pair>();
        Map<String, String> localVarHeaderParams = new HashMap<String, String>();
        Map<String, Object> localVarFormParams = new HashMap<String, Object>();
        final String[] localVarAccepts = {
            "application/json"
        };
        final String localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        if (localVarAccept != null) {
            localVarHeaderParams.put("Accept", localVarAccept);
        }

        final String[] localVarContentTypes = {
            
        };
        final String localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);
        localVarHeaderParams.put("Content-Type", localVarContentType);

        if (progressListener != null) {
            apiClient.getHttpClient().networkInterceptors().add(new com.squareup.okhttp.Interceptor() {
                @Override
                public com.squareup.okhttp.Response intercept(com.squareup.okhttp.Interceptor.Chain chain) throws IOException {
                    com.squareup.okhttp.Response originalResponse = chain.proceed(chain.request());
                    return originalResponse.newBuilder()
                    .body(new ProgressResponseBody(originalResponse.body(), progressListener))
                    .build();
                }
            });
        }

        String[] localVarAuthNames = new String[] { "CookieAuth" };
        return apiClient.buildCall(localVarPath, "GET", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarFormParams, localVarAuthNames, progressRequestListener);
    }

    @SuppressWarnings("rawtypes")
    private com.squareup.okhttp.Call getAllAPITokensValidateBeforeCall(final ProgressResponseBody.ProgressListener progressListener, final ProgressRequestBody.ProgressRequestListener progressRequestListener) throws ApiException {
        

        com.squareup.okhttp.Call call = getAllAPITokensCall(progressListener, progressRequestListener);
        return call;

    }

    /**
     * List all API tokens.
     * 
     * @return List&lt;APITokenGet&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     */
    public List<APITokenGet> getAllAPITokens() throws ApiException {
        ApiResponse<List<APITokenGet>> resp = getAllAPITokensWithHttpInfo();
        return resp.getData();
    }

    /**
     * List all API tokens.
     * 
     * @return ApiResponse&lt;List&lt;APITokenGet&gt;&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     */
    public ApiResponse<List<APITokenGet>> getAllAPITokensWithHttpInfo() throws ApiException {
        com.squareup.okhttp.Call call = getAllAPITokensValidateBeforeCall(null, null);
        Type localVarReturnType = new TypeToken<List<APITokenGet>>(){}.getType();
        return apiClient.execute(call, localVarReturnType);
    }

    /**
     * List all API tokens. (asynchronously)
     * 
     * @param callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     */
    public com.squareup.okhttp.Call getAllAPITokensAsync(final ApiCallback<List<APITokenGet>> callback) throws ApiException {

        ProgressResponseBody.ProgressListener progressListener = null;
        ProgressRequestBody.ProgressRequestListener progressRequestListener = null;

        if (callback != null) {
            progressListener = new ProgressResponseBody.ProgressListener() {
                @Override
                public void update(long bytesRead, long contentLength, boolean done) {
                    callback.onDownloadProgress(bytesRead, contentLength, done);
                }
            };

            progressRequestListener = new ProgressRequestBody.ProgressRequestListener() {
                @Override
                public void onRequestProgress(long bytesWritten, long contentLength, boolean done) {
                    callback.onUploadProgress(bytesWritten, contentLength, done);
                }
            };
        }

        com.squareup.okhttp.Call call = getAllAPITokensValidateBeforeCall(progressListener, progressRequestListener);
        Type localVarReturnType = new TypeToken<List<APITokenGet>>(){}.getType();
        apiClient.executeAsync(call, localVarReturnType, callback);
        return call;
    }
    /**
     * Build call for updateAPIToken
     * @param apITokenId Identifier of the API token. (required)
     * @param apITokenPut API token object to update. (required)
     * @param progressListener Progress listener
     * @param progressRequestListener Progress request listener
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     */
    public com.squareup.okhttp.Call updateAPITokenCall(UUID apITokenId, APITokenPut apITokenPut, final ProgressResponseBody.ProgressListener progressListener, final ProgressRequestBody.ProgressRequestListener progressRequestListener) throws ApiException {
        Object localVarPostBody = apITokenPut;

        // create path and map variables
        String localVarPath = "/api-token/{APITokenId}"
            .replaceAll("\\{" + "APITokenId" + "\\}", apiClient.escapeString(apITokenId.toString()));

        List<Pair> localVarQueryParams = new ArrayList<Pair>();
        List<Pair> localVarCollectionQueryParams = new ArrayList<Pair>();
        Map<String, String> localVarHeaderParams = new HashMap<String, String>();
        Map<String, Object> localVarFormParams = new HashMap<String, Object>();
        final String[] localVarAccepts = {
            "application/json"
        };
        final String localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        if (localVarAccept != null) {
            localVarHeaderParams.put("Accept", localVarAccept);
        }

        final String[] localVarContentTypes = {
            "application/json"
        };
        final String localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);
        localVarHeaderParams.put("Content-Type", localVarContentType);

        if (progressListener != null) {
            apiClient.getHttpClient().networkInterceptors().add(new com.squareup.okhttp.Interceptor() {
                @Override
                public com.squareup.okhttp.Response intercept(com.squareup.okhttp.Interceptor.Chain chain) throws IOException {
                    com.squareup.okhttp.Response originalResponse = chain.proceed(chain.request());
                    return originalResponse.newBuilder()
                    .body(new ProgressResponseBody(originalResponse.body(), progressListener))
                    .build();
                }
            });
        }

        String[] localVarAuthNames = new String[] { "CookieAuth" };
        return apiClient.buildCall(localVarPath, "PUT", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarFormParams, localVarAuthNames, progressRequestListener);
    }

    @SuppressWarnings("rawtypes")
    private com.squareup.okhttp.Call updateAPITokenValidateBeforeCall(UUID apITokenId, APITokenPut apITokenPut, final ProgressResponseBody.ProgressListener progressListener, final ProgressRequestBody.ProgressRequestListener progressRequestListener) throws ApiException {
        
        // verify the required parameter 'apITokenId' is set
        if (apITokenId == null) {
            throw new ApiException("Missing the required parameter 'apITokenId' when calling updateAPIToken(Async)");
        }
        
        // verify the required parameter 'apITokenPut' is set
        if (apITokenPut == null) {
            throw new ApiException("Missing the required parameter 'apITokenPut' when calling updateAPIToken(Async)");
        }
        

        com.squareup.okhttp.Call call = updateAPITokenCall(apITokenId, apITokenPut, progressListener, progressRequestListener);
        return call;

    }

    /**
     * Update an API token.
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @param apITokenPut API token object to update. (required)
     * @return APITokenGet
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     */
    public APITokenGet updateAPIToken(UUID apITokenId, APITokenPut apITokenPut) throws ApiException {
        ApiResponse<APITokenGet> resp = updateAPITokenWithHttpInfo(apITokenId, apITokenPut);
        return resp.getData();
    }

    /**
     * Update an API token.
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @param apITokenPut API token object to update. (required)
     * @return ApiResponse&lt;APITokenGet&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     */
    public ApiResponse<APITokenGet> updateAPITokenWithHttpInfo(UUID apITokenId, APITokenPut apITokenPut) throws ApiException {
        com.squareup.okhttp.Call call = updateAPITokenValidateBeforeCall(apITokenId, apITokenPut, null, null);
        Type localVarReturnType = new TypeToken<APITokenGet>(){}.getType();
        return apiClient.execute(call, localVarReturnType);
    }

    /**
     * Update an API token. (asynchronously)
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @param apITokenPut API token object to update. (required)
     * @param callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     */
    public com.squareup.okhttp.Call updateAPITokenAsync(UUID apITokenId, APITokenPut apITokenPut, final ApiCallback<APITokenGet> callback) throws ApiException {

        ProgressResponseBody.ProgressListener progressListener = null;
        ProgressRequestBody.ProgressRequestListener progressRequestListener = null;

        if (callback != null) {
            progressListener = new ProgressResponseBody.ProgressListener() {
                @Override
                public void update(long bytesRead, long contentLength, boolean done) {
                    callback.onDownloadProgress(bytesRead, contentLength, done);
                }
            };

            progressRequestListener = new ProgressRequestBody.ProgressRequestListener() {
                @Override
                public void onRequestProgress(long bytesWritten, long contentLength, boolean done) {
                    callback.onUploadProgress(bytesWritten, contentLength, done);
                }
            };
        }

        com.squareup.okhttp.Call call = updateAPITokenValidateBeforeCall(apITokenId, apITokenPut, progressListener, progressRequestListener);
        Type localVarReturnType = new TypeToken<APITokenGet>(){}.getType();
        apiClient.executeAsync(call, localVarReturnType, callback);
        return call;
    }
}
