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
import io.woleet.idserver.api.model.ConfigDisco;
import io.woleet.idserver.api.model.KeyDisco;
import java.util.UUID;
import io.woleet.idserver.api.model.UserDisco;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DiscoveryApi {
    private ApiClient localVarApiClient;

    public DiscoveryApi() {
        this(Configuration.getDefaultApiClient());
    }

    public DiscoveryApi(ApiClient apiClient) {
        this.localVarApiClient = apiClient;
    }

    public ApiClient getApiClient() {
        return localVarApiClient;
    }

    public void setApiClient(ApiClient apiClient) {
        this.localVarApiClient = apiClient;
    }

    /**
     * Build call for discoverConfig
     * @param _callback Callback for upload/download progress
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call discoverConfigCall(final ApiCallback _callback) throws ApiException {
        Object localVarPostBody = null;

        // create path and map variables
        String localVarPath = "/discover/config";

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

        String[] localVarAuthNames = new String[] { "APITokenAuth", "OAuthTokenAuth" };
        return localVarApiClient.buildCall(localVarPath, "GET", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAuthNames, _callback);
    }

    @SuppressWarnings("rawtypes")
    private okhttp3.Call discoverConfigValidateBeforeCall(final ApiCallback _callback) throws ApiException {
        

        okhttp3.Call localVarCall = discoverConfigCall(_callback);
        return localVarCall;

    }

    /**
     * Get the server configuration.
     * 
     * @return ConfigDisco
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
     </table>
     */
    public ConfigDisco discoverConfig() throws ApiException {
        ApiResponse<ConfigDisco> localVarResp = discoverConfigWithHttpInfo();
        return localVarResp.getData();
    }

    /**
     * Get the server configuration.
     * 
     * @return ApiResponse&lt;ConfigDisco&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
     </table>
     */
    public ApiResponse<ConfigDisco> discoverConfigWithHttpInfo() throws ApiException {
        okhttp3.Call localVarCall = discoverConfigValidateBeforeCall(null);
        Type localVarReturnType = new TypeToken<ConfigDisco>(){}.getType();
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
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call discoverConfigAsync(final ApiCallback<ConfigDisco> _callback) throws ApiException {

        okhttp3.Call localVarCall = discoverConfigValidateBeforeCall(_callback);
        Type localVarReturnType = new TypeToken<ConfigDisco>(){}.getType();
        localVarApiClient.executeAsync(localVarCall, localVarReturnType, _callback);
        return localVarCall;
    }
    /**
     * Build call for discoverUser
     * @param _callback Callback for upload/download progress
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 204 </td><td> Successful operation. The current authenticated user is a server admin. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> User not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call discoverUserCall(final ApiCallback _callback) throws ApiException {
        Object localVarPostBody = null;

        // create path and map variables
        String localVarPath = "/discover/user";

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

        String[] localVarAuthNames = new String[] { "APITokenAuth", "OAuthTokenAuth" };
        return localVarApiClient.buildCall(localVarPath, "GET", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAuthNames, _callback);
    }

    @SuppressWarnings("rawtypes")
    private okhttp3.Call discoverUserValidateBeforeCall(final ApiCallback _callback) throws ApiException {
        

        okhttp3.Call localVarCall = discoverUserCall(_callback);
        return localVarCall;

    }

    /**
     * Get the current authenticated user.
     * 
     * @return UserDisco
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 204 </td><td> Successful operation. The current authenticated user is a server admin. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> User not found. </td><td>  -  </td></tr>
     </table>
     */
    public UserDisco discoverUser() throws ApiException {
        ApiResponse<UserDisco> localVarResp = discoverUserWithHttpInfo();
        return localVarResp.getData();
    }

    /**
     * Get the current authenticated user.
     * 
     * @return ApiResponse&lt;UserDisco&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 204 </td><td> Successful operation. The current authenticated user is a server admin. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> User not found. </td><td>  -  </td></tr>
     </table>
     */
    public ApiResponse<UserDisco> discoverUserWithHttpInfo() throws ApiException {
        okhttp3.Call localVarCall = discoverUserValidateBeforeCall(null);
        Type localVarReturnType = new TypeToken<UserDisco>(){}.getType();
        return localVarApiClient.execute(localVarCall, localVarReturnType);
    }

    /**
     * Get the current authenticated user. (asynchronously)
     * 
     * @param _callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 204 </td><td> Successful operation. The current authenticated user is a server admin. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> User not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call discoverUserAsync(final ApiCallback<UserDisco> _callback) throws ApiException {

        okhttp3.Call localVarCall = discoverUserValidateBeforeCall(_callback);
        Type localVarReturnType = new TypeToken<UserDisco>(){}.getType();
        localVarApiClient.executeAsync(localVarCall, localVarReturnType, _callback);
        return localVarCall;
    }
    /**
     * Build call for discoverUserByPubKey
     * @param pubKey Public key (bitcoin address when using BIP39 keys). (required)
     * @param _callback Callback for upload/download progress
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> User not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call discoverUserByPubKeyCall(String pubKey, final ApiCallback _callback) throws ApiException {
        Object localVarPostBody = null;

        // create path and map variables
        String localVarPath = "/discover/user/{pubKey}"
            .replaceAll("\\{" + "pubKey" + "\\}", localVarApiClient.escapeString(pubKey.toString()));

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

        String[] localVarAuthNames = new String[] { "APITokenAuth", "OAuthTokenAuth" };
        return localVarApiClient.buildCall(localVarPath, "GET", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAuthNames, _callback);
    }

    @SuppressWarnings("rawtypes")
    private okhttp3.Call discoverUserByPubKeyValidateBeforeCall(String pubKey, final ApiCallback _callback) throws ApiException {
        
        // verify the required parameter 'pubKey' is set
        if (pubKey == null) {
            throw new ApiException("Missing the required parameter 'pubKey' when calling discoverUserByPubKey(Async)");
        }
        

        okhttp3.Call localVarCall = discoverUserByPubKeyCall(pubKey, _callback);
        return localVarCall;

    }

    /**
     * Get the user associated to a public key.
     * 
     * @param pubKey Public key (bitcoin address when using BIP39 keys). (required)
     * @return UserDisco
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> User not found. </td><td>  -  </td></tr>
     </table>
     */
    public UserDisco discoverUserByPubKey(String pubKey) throws ApiException {
        ApiResponse<UserDisco> localVarResp = discoverUserByPubKeyWithHttpInfo(pubKey);
        return localVarResp.getData();
    }

    /**
     * Get the user associated to a public key.
     * 
     * @param pubKey Public key (bitcoin address when using BIP39 keys). (required)
     * @return ApiResponse&lt;UserDisco&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> User not found. </td><td>  -  </td></tr>
     </table>
     */
    public ApiResponse<UserDisco> discoverUserByPubKeyWithHttpInfo(String pubKey) throws ApiException {
        okhttp3.Call localVarCall = discoverUserByPubKeyValidateBeforeCall(pubKey, null);
        Type localVarReturnType = new TypeToken<UserDisco>(){}.getType();
        return localVarApiClient.execute(localVarCall, localVarReturnType);
    }

    /**
     * Get the user associated to a public key. (asynchronously)
     * 
     * @param pubKey Public key (bitcoin address when using BIP39 keys). (required)
     * @param _callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> User not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call discoverUserByPubKeyAsync(String pubKey, final ApiCallback<UserDisco> _callback) throws ApiException {

        okhttp3.Call localVarCall = discoverUserByPubKeyValidateBeforeCall(pubKey, _callback);
        Type localVarReturnType = new TypeToken<UserDisco>(){}.getType();
        localVarApiClient.executeAsync(localVarCall, localVarReturnType, _callback);
        return localVarCall;
    }
    /**
     * Build call for discoverUserKeys
     * @param userId Identifier of the user. (required)
     * @param _callback Callback for upload/download progress
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid user identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> User not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call discoverUserKeysCall(UUID userId, final ApiCallback _callback) throws ApiException {
        Object localVarPostBody = null;

        // create path and map variables
        String localVarPath = "/discover/keys/{userId}"
            .replaceAll("\\{" + "userId" + "\\}", localVarApiClient.escapeString(userId.toString()));

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

        String[] localVarAuthNames = new String[] { "APITokenAuth", "OAuthTokenAuth" };
        return localVarApiClient.buildCall(localVarPath, "GET", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAuthNames, _callback);
    }

    @SuppressWarnings("rawtypes")
    private okhttp3.Call discoverUserKeysValidateBeforeCall(UUID userId, final ApiCallback _callback) throws ApiException {
        
        // verify the required parameter 'userId' is set
        if (userId == null) {
            throw new ApiException("Missing the required parameter 'userId' when calling discoverUserKeys(Async)");
        }
        

        okhttp3.Call localVarCall = discoverUserKeysCall(userId, _callback);
        return localVarCall;

    }

    /**
     * Get all the public keys of a user.
     * 
     * @param userId Identifier of the user. (required)
     * @return List&lt;KeyDisco&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid user identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> User not found. </td><td>  -  </td></tr>
     </table>
     */
    public List<KeyDisco> discoverUserKeys(UUID userId) throws ApiException {
        ApiResponse<List<KeyDisco>> localVarResp = discoverUserKeysWithHttpInfo(userId);
        return localVarResp.getData();
    }

    /**
     * Get all the public keys of a user.
     * 
     * @param userId Identifier of the user. (required)
     * @return ApiResponse&lt;List&lt;KeyDisco&gt;&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid user identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> User not found. </td><td>  -  </td></tr>
     </table>
     */
    public ApiResponse<List<KeyDisco>> discoverUserKeysWithHttpInfo(UUID userId) throws ApiException {
        okhttp3.Call localVarCall = discoverUserKeysValidateBeforeCall(userId, null);
        Type localVarReturnType = new TypeToken<List<KeyDisco>>(){}.getType();
        return localVarApiClient.execute(localVarCall, localVarReturnType);
    }

    /**
     * Get all the public keys of a user. (asynchronously)
     * 
     * @param userId Identifier of the user. (required)
     * @param _callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid user identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> User not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call discoverUserKeysAsync(UUID userId, final ApiCallback<List<KeyDisco>> _callback) throws ApiException {

        okhttp3.Call localVarCall = discoverUserKeysValidateBeforeCall(userId, _callback);
        Type localVarReturnType = new TypeToken<List<KeyDisco>>(){}.getType();
        localVarApiClient.executeAsync(localVarCall, localVarReturnType, _callback);
        return localVarCall;
    }
    /**
     * Build call for discoverUsers
     * @param offset Offset of the returned results (0 to get all results from the beginning). (optional)
     * @param limit Maximum number of returned results. (optional)
     * @param search Filter the users using a search string.&lt;br&gt; Only users whose &#x60;email&#x60;, &#x60;username&#x60;, &#x60;identity.commonName&#x60;, &#x60;identity.organization&#x60; or &#x60;identity.organizationalUnit&#x60; contains the search string match.  (optional)
     * @param _callback Callback for upload/download progress
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call discoverUsersCall(Integer offset, Integer limit, String search, final ApiCallback _callback) throws ApiException {
        Object localVarPostBody = null;

        // create path and map variables
        String localVarPath = "/discover/users";

        List<Pair> localVarQueryParams = new ArrayList<Pair>();
        List<Pair> localVarCollectionQueryParams = new ArrayList<Pair>();
        if (offset != null) {
            localVarQueryParams.addAll(localVarApiClient.parameterToPair("offset", offset));
        }

        if (limit != null) {
            localVarQueryParams.addAll(localVarApiClient.parameterToPair("limit", limit));
        }

        if (search != null) {
            localVarQueryParams.addAll(localVarApiClient.parameterToPair("search", search));
        }

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

        String[] localVarAuthNames = new String[] { "APITokenAuth", "OAuthTokenAuth" };
        return localVarApiClient.buildCall(localVarPath, "GET", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAuthNames, _callback);
    }

    @SuppressWarnings("rawtypes")
    private okhttp3.Call discoverUsersValidateBeforeCall(Integer offset, Integer limit, String search, final ApiCallback _callback) throws ApiException {
        

        okhttp3.Call localVarCall = discoverUsersCall(offset, limit, search, _callback);
        return localVarCall;

    }

    /**
     * Get all the users matching a set of filters.
     * Use this operation to get all the users, or a subset of the users matching specified filters.&lt;br&gt; Results can be paged. 
     * @param offset Offset of the returned results (0 to get all results from the beginning). (optional)
     * @param limit Maximum number of returned results. (optional)
     * @param search Filter the users using a search string.&lt;br&gt; Only users whose &#x60;email&#x60;, &#x60;username&#x60;, &#x60;identity.commonName&#x60;, &#x60;identity.organization&#x60; or &#x60;identity.organizationalUnit&#x60; contains the search string match.  (optional)
     * @return List&lt;UserDisco&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
     </table>
     */
    public List<UserDisco> discoverUsers(Integer offset, Integer limit, String search) throws ApiException {
        ApiResponse<List<UserDisco>> localVarResp = discoverUsersWithHttpInfo(offset, limit, search);
        return localVarResp.getData();
    }

    /**
     * Get all the users matching a set of filters.
     * Use this operation to get all the users, or a subset of the users matching specified filters.&lt;br&gt; Results can be paged. 
     * @param offset Offset of the returned results (0 to get all results from the beginning). (optional)
     * @param limit Maximum number of returned results. (optional)
     * @param search Filter the users using a search string.&lt;br&gt; Only users whose &#x60;email&#x60;, &#x60;username&#x60;, &#x60;identity.commonName&#x60;, &#x60;identity.organization&#x60; or &#x60;identity.organizationalUnit&#x60; contains the search string match.  (optional)
     * @return ApiResponse&lt;List&lt;UserDisco&gt;&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
     </table>
     */
    public ApiResponse<List<UserDisco>> discoverUsersWithHttpInfo(Integer offset, Integer limit, String search) throws ApiException {
        okhttp3.Call localVarCall = discoverUsersValidateBeforeCall(offset, limit, search, null);
        Type localVarReturnType = new TypeToken<List<UserDisco>>(){}.getType();
        return localVarApiClient.execute(localVarCall, localVarReturnType);
    }

    /**
     * Get all the users matching a set of filters. (asynchronously)
     * Use this operation to get all the users, or a subset of the users matching specified filters.&lt;br&gt; Results can be paged. 
     * @param offset Offset of the returned results (0 to get all results from the beginning). (optional)
     * @param limit Maximum number of returned results. (optional)
     * @param search Filter the users using a search string.&lt;br&gt; Only users whose &#x60;email&#x60;, &#x60;username&#x60;, &#x60;identity.commonName&#x60;, &#x60;identity.organization&#x60; or &#x60;identity.organizationalUnit&#x60; contains the search string match.  (optional)
     * @param _callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call discoverUsersAsync(Integer offset, Integer limit, String search, final ApiCallback<List<UserDisco>> _callback) throws ApiException {

        okhttp3.Call localVarCall = discoverUsersValidateBeforeCall(offset, limit, search, _callback);
        Type localVarReturnType = new TypeToken<List<UserDisco>>(){}.getType();
        localVarApiClient.executeAsync(localVarCall, localVarReturnType, _callback);
        return localVarCall;
    }
}
