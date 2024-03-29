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
    private ApiClient localVarApiClient;

    public ApiTokenApi() {
        this(Configuration.getDefaultApiClient());
    }

    public ApiTokenApi(ApiClient apiClient) {
        this.localVarApiClient = apiClient;
    }

    public ApiClient getApiClient() {
        return localVarApiClient;
    }

    public void setApiClient(ApiClient apiClient) {
        this.localVarApiClient = apiClient;
    }

    /**
     * Build call for createAPIToken
     * @param apITokenPost API token object to create. (required)
     * @param _callback Callback for upload/download progress
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid object supplied. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> Users cannot manage other users&#39; API tokens. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call createAPITokenCall(APITokenPost apITokenPost, final ApiCallback _callback) throws ApiException {
        Object localVarPostBody = apITokenPost;

        // create path and map variables
        String localVarPath = "/api-token";

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
        return localVarApiClient.buildCall(localVarPath, "POST", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAuthNames, _callback);
    }

    @SuppressWarnings("rawtypes")
    private okhttp3.Call createAPITokenValidateBeforeCall(APITokenPost apITokenPost, final ApiCallback _callback) throws ApiException {
        
        // verify the required parameter 'apITokenPost' is set
        if (apITokenPost == null) {
            throw new ApiException("Missing the required parameter 'apITokenPost' when calling createAPIToken(Async)");
        }
        

        okhttp3.Call localVarCall = createAPITokenCall(apITokenPost, _callback);
        return localVarCall;

    }

    /**
     * Create an API token.
     * 
     * @param apITokenPost API token object to create. (required)
     * @return APITokenGet
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid object supplied. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> Users cannot manage other users&#39; API tokens. </td><td>  -  </td></tr>
     </table>
     */
    public APITokenGet createAPIToken(APITokenPost apITokenPost) throws ApiException {
        ApiResponse<APITokenGet> localVarResp = createAPITokenWithHttpInfo(apITokenPost);
        return localVarResp.getData();
    }

    /**
     * Create an API token.
     * 
     * @param apITokenPost API token object to create. (required)
     * @return ApiResponse&lt;APITokenGet&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid object supplied. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> Users cannot manage other users&#39; API tokens. </td><td>  -  </td></tr>
     </table>
     */
    public ApiResponse<APITokenGet> createAPITokenWithHttpInfo(APITokenPost apITokenPost) throws ApiException {
        okhttp3.Call localVarCall = createAPITokenValidateBeforeCall(apITokenPost, null);
        Type localVarReturnType = new TypeToken<APITokenGet>(){}.getType();
        return localVarApiClient.execute(localVarCall, localVarReturnType);
    }

    /**
     * Create an API token. (asynchronously)
     * 
     * @param apITokenPost API token object to create. (required)
     * @param _callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid object supplied. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> Users cannot manage other users&#39; API tokens. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call createAPITokenAsync(APITokenPost apITokenPost, final ApiCallback<APITokenGet> _callback) throws ApiException {

        okhttp3.Call localVarCall = createAPITokenValidateBeforeCall(apITokenPost, _callback);
        Type localVarReturnType = new TypeToken<APITokenGet>(){}.getType();
        localVarApiClient.executeAsync(localVarCall, localVarReturnType, _callback);
        return localVarCall;
    }
    /**
     * Build call for deleteAPIToken
     * @param apITokenId Identifier of the API token. (required)
     * @param _callback Callback for upload/download progress
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid API token identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> Users cannot manage other users&#39; API tokens. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call deleteAPITokenCall(UUID apITokenId, final ApiCallback _callback) throws ApiException {
        Object localVarPostBody = null;

        // create path and map variables
        String localVarPath = "/api-token/{APITokenId}"
            .replaceAll("\\{" + "APITokenId" + "\\}", localVarApiClient.escapeString(apITokenId.toString()));

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
        return localVarApiClient.buildCall(localVarPath, "DELETE", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAuthNames, _callback);
    }

    @SuppressWarnings("rawtypes")
    private okhttp3.Call deleteAPITokenValidateBeforeCall(UUID apITokenId, final ApiCallback _callback) throws ApiException {
        
        // verify the required parameter 'apITokenId' is set
        if (apITokenId == null) {
            throw new ApiException("Missing the required parameter 'apITokenId' when calling deleteAPIToken(Async)");
        }
        

        okhttp3.Call localVarCall = deleteAPITokenCall(apITokenId, _callback);
        return localVarCall;

    }

    /**
     * Delete an API token.
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @return APITokenGet
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid API token identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> Users cannot manage other users&#39; API tokens. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public APITokenGet deleteAPIToken(UUID apITokenId) throws ApiException {
        ApiResponse<APITokenGet> localVarResp = deleteAPITokenWithHttpInfo(apITokenId);
        return localVarResp.getData();
    }

    /**
     * Delete an API token.
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @return ApiResponse&lt;APITokenGet&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid API token identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> Users cannot manage other users&#39; API tokens. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public ApiResponse<APITokenGet> deleteAPITokenWithHttpInfo(UUID apITokenId) throws ApiException {
        okhttp3.Call localVarCall = deleteAPITokenValidateBeforeCall(apITokenId, null);
        Type localVarReturnType = new TypeToken<APITokenGet>(){}.getType();
        return localVarApiClient.execute(localVarCall, localVarReturnType);
    }

    /**
     * Delete an API token. (asynchronously)
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @param _callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid API token identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> Users cannot manage other users&#39; API tokens. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call deleteAPITokenAsync(UUID apITokenId, final ApiCallback<APITokenGet> _callback) throws ApiException {

        okhttp3.Call localVarCall = deleteAPITokenValidateBeforeCall(apITokenId, _callback);
        Type localVarReturnType = new TypeToken<APITokenGet>(){}.getType();
        localVarApiClient.executeAsync(localVarCall, localVarReturnType, _callback);
        return localVarCall;
    }
    /**
     * Build call for getAPITokenById
     * @param apITokenId Identifier of the API token. (required)
     * @param _callback Callback for upload/download progress
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid API token identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> Users cannot manage other users&#39; API tokens. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call getAPITokenByIdCall(UUID apITokenId, final ApiCallback _callback) throws ApiException {
        Object localVarPostBody = null;

        // create path and map variables
        String localVarPath = "/api-token/{APITokenId}"
            .replaceAll("\\{" + "APITokenId" + "\\}", localVarApiClient.escapeString(apITokenId.toString()));

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
    private okhttp3.Call getAPITokenByIdValidateBeforeCall(UUID apITokenId, final ApiCallback _callback) throws ApiException {
        
        // verify the required parameter 'apITokenId' is set
        if (apITokenId == null) {
            throw new ApiException("Missing the required parameter 'apITokenId' when calling getAPITokenById(Async)");
        }
        

        okhttp3.Call localVarCall = getAPITokenByIdCall(apITokenId, _callback);
        return localVarCall;

    }

    /**
     * Get an API token by its identifier.
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @return APITokenGet
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid API token identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> Users cannot manage other users&#39; API tokens. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public APITokenGet getAPITokenById(UUID apITokenId) throws ApiException {
        ApiResponse<APITokenGet> localVarResp = getAPITokenByIdWithHttpInfo(apITokenId);
        return localVarResp.getData();
    }

    /**
     * Get an API token by its identifier.
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @return ApiResponse&lt;APITokenGet&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid API token identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> Users cannot manage other users&#39; API tokens. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public ApiResponse<APITokenGet> getAPITokenByIdWithHttpInfo(UUID apITokenId) throws ApiException {
        okhttp3.Call localVarCall = getAPITokenByIdValidateBeforeCall(apITokenId, null);
        Type localVarReturnType = new TypeToken<APITokenGet>(){}.getType();
        return localVarApiClient.execute(localVarCall, localVarReturnType);
    }

    /**
     * Get an API token by its identifier. (asynchronously)
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @param _callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid API token identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> Users cannot manage other users&#39; API tokens. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call getAPITokenByIdAsync(UUID apITokenId, final ApiCallback<APITokenGet> _callback) throws ApiException {

        okhttp3.Call localVarCall = getAPITokenByIdValidateBeforeCall(apITokenId, _callback);
        Type localVarReturnType = new TypeToken<APITokenGet>(){}.getType();
        localVarApiClient.executeAsync(localVarCall, localVarReturnType, _callback);
        return localVarCall;
    }
    /**
     * Build call for getAPITokens
     * @param _callback Callback for upload/download progress
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Succesful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call getAPITokensCall(final ApiCallback _callback) throws ApiException {
        Object localVarPostBody = null;

        // create path and map variables
        String localVarPath = "/api-token/list";

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
    private okhttp3.Call getAPITokensValidateBeforeCall(final ApiCallback _callback) throws ApiException {
        

        okhttp3.Call localVarCall = getAPITokensCall(_callback);
        return localVarCall;

    }

    /**
     * Get all API tokens.
     * When logged as a user, only the tokens belonging to the user are returned.
     * @return List&lt;APITokenGet&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Succesful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
     </table>
     */
    public List<APITokenGet> getAPITokens() throws ApiException {
        ApiResponse<List<APITokenGet>> localVarResp = getAPITokensWithHttpInfo();
        return localVarResp.getData();
    }

    /**
     * Get all API tokens.
     * When logged as a user, only the tokens belonging to the user are returned.
     * @return ApiResponse&lt;List&lt;APITokenGet&gt;&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Succesful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
     </table>
     */
    public ApiResponse<List<APITokenGet>> getAPITokensWithHttpInfo() throws ApiException {
        okhttp3.Call localVarCall = getAPITokensValidateBeforeCall(null);
        Type localVarReturnType = new TypeToken<List<APITokenGet>>(){}.getType();
        return localVarApiClient.execute(localVarCall, localVarReturnType);
    }

    /**
     * Get all API tokens. (asynchronously)
     * When logged as a user, only the tokens belonging to the user are returned.
     * @param _callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Succesful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call getAPITokensAsync(final ApiCallback<List<APITokenGet>> _callback) throws ApiException {

        okhttp3.Call localVarCall = getAPITokensValidateBeforeCall(_callback);
        Type localVarReturnType = new TypeToken<List<APITokenGet>>(){}.getType();
        localVarApiClient.executeAsync(localVarCall, localVarReturnType, _callback);
        return localVarCall;
    }
    /**
     * Build call for updateAPIToken
     * @param apITokenId Identifier of the API token. (required)
     * @param apITokenPut API token object to update. (required)
     * @param _callback Callback for upload/download progress
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid object supplied. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> Users cannot manage other users&#39; API tokens. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call updateAPITokenCall(UUID apITokenId, APITokenPut apITokenPut, final ApiCallback _callback) throws ApiException {
        Object localVarPostBody = apITokenPut;

        // create path and map variables
        String localVarPath = "/api-token/{APITokenId}"
            .replaceAll("\\{" + "APITokenId" + "\\}", localVarApiClient.escapeString(apITokenId.toString()));

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
    private okhttp3.Call updateAPITokenValidateBeforeCall(UUID apITokenId, APITokenPut apITokenPut, final ApiCallback _callback) throws ApiException {
        
        // verify the required parameter 'apITokenId' is set
        if (apITokenId == null) {
            throw new ApiException("Missing the required parameter 'apITokenId' when calling updateAPIToken(Async)");
        }
        
        // verify the required parameter 'apITokenPut' is set
        if (apITokenPut == null) {
            throw new ApiException("Missing the required parameter 'apITokenPut' when calling updateAPIToken(Async)");
        }
        

        okhttp3.Call localVarCall = updateAPITokenCall(apITokenId, apITokenPut, _callback);
        return localVarCall;

    }

    /**
     * Update an API token.
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @param apITokenPut API token object to update. (required)
     * @return APITokenGet
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid object supplied. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> Users cannot manage other users&#39; API tokens. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public APITokenGet updateAPIToken(UUID apITokenId, APITokenPut apITokenPut) throws ApiException {
        ApiResponse<APITokenGet> localVarResp = updateAPITokenWithHttpInfo(apITokenId, apITokenPut);
        return localVarResp.getData();
    }

    /**
     * Update an API token.
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @param apITokenPut API token object to update. (required)
     * @return ApiResponse&lt;APITokenGet&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid object supplied. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> Users cannot manage other users&#39; API tokens. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public ApiResponse<APITokenGet> updateAPITokenWithHttpInfo(UUID apITokenId, APITokenPut apITokenPut) throws ApiException {
        okhttp3.Call localVarCall = updateAPITokenValidateBeforeCall(apITokenId, apITokenPut, null);
        Type localVarReturnType = new TypeToken<APITokenGet>(){}.getType();
        return localVarApiClient.execute(localVarCall, localVarReturnType);
    }

    /**
     * Update an API token. (asynchronously)
     * 
     * @param apITokenId Identifier of the API token. (required)
     * @param apITokenPut API token object to update. (required)
     * @param _callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid object supplied. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> Users cannot manage other users&#39; API tokens. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> API token not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call updateAPITokenAsync(UUID apITokenId, APITokenPut apITokenPut, final ApiCallback<APITokenGet> _callback) throws ApiException {

        okhttp3.Call localVarCall = updateAPITokenValidateBeforeCall(apITokenId, apITokenPut, _callback);
        Type localVarReturnType = new TypeToken<APITokenGet>(){}.getType();
        localVarApiClient.executeAsync(localVarCall, localVarReturnType, _callback);
        return localVarCall;
    }
}
