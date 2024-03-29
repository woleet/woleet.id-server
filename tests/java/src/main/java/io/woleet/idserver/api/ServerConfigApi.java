/*
 * Woleet.ID Server
 * This is Woleet.ID Server API documentation.
 *
 * The version of the OpenAPI document: 1.2.8
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
import io.woleet.idserver.api.model.ServerConfig;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ServerConfigApi {
    private ApiClient localVarApiClient;

    public ServerConfigApi() {
        this(Configuration.getDefaultApiClient());
    }

    public ServerConfigApi(ApiClient apiClient) {
        this.localVarApiClient = apiClient;
    }

    public ApiClient getApiClient() {
        return localVarApiClient;
    }

    public void setApiClient(ApiClient apiClient) {
        this.localVarApiClient = apiClient;
    }

    /**
     * Build call for getServerConfig
     * @param _callback Callback for upload/download progress
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid API token identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call getServerConfigCall(final ApiCallback _callback) throws ApiException {
        Object localVarPostBody = null;

        // create path and map variables
        String localVarPath = "/server-config";

        List<Pair> localVarQueryParams = new ArrayList<Pair>();
        List<Pair> localVarCollectionQueryParams = new ArrayList<Pair>();
        Map<String, String> localVarHeaderParams = new HashMap<String, String>();
        Map<String, String> localVarCookieParams = new HashMap<String, String>();
        Map<String, Object> localVarFormParams = new HashMap<String, Object>();
        final String[] localVarAccepts = {
            "application/json"
        };
        final String localVarAccept = localVarApiClient.selectHeaderAccept(localVarAccepts);
        if (localVarAccept != null) {
            localVarHeaderParams.put("Accept", localVarAccept);
        }

        final String[] localVarContentTypes = {
            
        };
        final String localVarContentType = localVarApiClient.selectHeaderContentType(localVarContentTypes);
        localVarHeaderParams.put("Content-Type", localVarContentType);

        String[] localVarAuthNames = new String[] { "APITokenAuth", "CookieAuth" };
        return localVarApiClient.buildCall(localVarPath, "GET", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAuthNames, _callback);
    }

    @SuppressWarnings("rawtypes")
    private okhttp3.Call getServerConfigValidateBeforeCall(final ApiCallback _callback) throws ApiException {
        

        okhttp3.Call localVarCall = getServerConfigCall(_callback);
        return localVarCall;

    }

    /**
     * Get the server configuration.
     * 
     * @return ServerConfig
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid API token identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public ServerConfig getServerConfig() throws ApiException {
        ApiResponse<ServerConfig> localVarResp = getServerConfigWithHttpInfo();
        return localVarResp.getData();
    }

    /**
     * Get the server configuration.
     * 
     * @return ApiResponse&lt;ServerConfig&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid API token identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public ApiResponse<ServerConfig> getServerConfigWithHttpInfo() throws ApiException {
        okhttp3.Call localVarCall = getServerConfigValidateBeforeCall(null);
        Type localVarReturnType = new TypeToken<ServerConfig>(){}.getType();
        return localVarApiClient.execute(localVarCall, localVarReturnType);
    }

    /**
     * Get the server configuration. (asynchronously)
     * 
     * @param _callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid API token identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call getServerConfigAsync(final ApiCallback<ServerConfig> _callback) throws ApiException {

        okhttp3.Call localVarCall = getServerConfigValidateBeforeCall(_callback);
        Type localVarReturnType = new TypeToken<ServerConfig>(){}.getType();
        localVarApiClient.executeAsync(localVarCall, localVarReturnType, _callback);
        return localVarCall;
    }
    /**
     * Build call for updateServerConfig
     * @param serverConfig Server config object. (required)
     * @param _callback Callback for upload/download progress
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid object supplied. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call updateServerConfigCall(ServerConfig serverConfig, final ApiCallback _callback) throws ApiException {
        Object localVarPostBody = serverConfig;

        // create path and map variables
        String localVarPath = "/server-config";

        List<Pair> localVarQueryParams = new ArrayList<Pair>();
        List<Pair> localVarCollectionQueryParams = new ArrayList<Pair>();
        Map<String, String> localVarHeaderParams = new HashMap<String, String>();
        Map<String, String> localVarCookieParams = new HashMap<String, String>();
        Map<String, Object> localVarFormParams = new HashMap<String, Object>();
        final String[] localVarAccepts = {
            "application/json"
        };
        final String localVarAccept = localVarApiClient.selectHeaderAccept(localVarAccepts);
        if (localVarAccept != null) {
            localVarHeaderParams.put("Accept", localVarAccept);
        }

        final String[] localVarContentTypes = {
            "application/json"
        };
        final String localVarContentType = localVarApiClient.selectHeaderContentType(localVarContentTypes);
        localVarHeaderParams.put("Content-Type", localVarContentType);

        String[] localVarAuthNames = new String[] { "APITokenAuth", "CookieAuth" };
        return localVarApiClient.buildCall(localVarPath, "PUT", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAuthNames, _callback);
    }

    @SuppressWarnings("rawtypes")
    private okhttp3.Call updateServerConfigValidateBeforeCall(ServerConfig serverConfig, final ApiCallback _callback) throws ApiException {
        
        // verify the required parameter 'serverConfig' is set
        if (serverConfig == null) {
            throw new ApiException("Missing the required parameter 'serverConfig' when calling updateServerConfig(Async)");
        }
        

        okhttp3.Call localVarCall = updateServerConfigCall(serverConfig, _callback);
        return localVarCall;

    }

    /**
     * Update the server configuration.
     * 
     * @param serverConfig Server config object. (required)
     * @return ServerConfig
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid object supplied. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public ServerConfig updateServerConfig(ServerConfig serverConfig) throws ApiException {
        ApiResponse<ServerConfig> localVarResp = updateServerConfigWithHttpInfo(serverConfig);
        return localVarResp.getData();
    }

    /**
     * Update the server configuration.
     * 
     * @param serverConfig Server config object. (required)
     * @return ApiResponse&lt;ServerConfig&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid object supplied. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public ApiResponse<ServerConfig> updateServerConfigWithHttpInfo(ServerConfig serverConfig) throws ApiException {
        okhttp3.Call localVarCall = updateServerConfigValidateBeforeCall(serverConfig, null);
        Type localVarReturnType = new TypeToken<ServerConfig>(){}.getType();
        return localVarApiClient.execute(localVarCall, localVarReturnType);
    }

    /**
     * Update the server configuration. (asynchronously)
     * 
     * @param serverConfig Server config object. (required)
     * @param _callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid object supplied. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call updateServerConfigAsync(ServerConfig serverConfig, final ApiCallback<ServerConfig> _callback) throws ApiException {

        okhttp3.Call localVarCall = updateServerConfigValidateBeforeCall(serverConfig, _callback);
        Type localVarReturnType = new TypeToken<ServerConfig>(){}.getType();
        localVarApiClient.executeAsync(localVarCall, localVarReturnType, _callback);
        return localVarCall;
    }
}
