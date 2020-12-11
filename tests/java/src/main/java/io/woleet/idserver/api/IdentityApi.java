/*
 * Woleet.ID Server
 * This is Woleet.ID Server API documentation.
 *
 * The version of the OpenAPI document: 1.2.6
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
import io.woleet.idserver.api.model.IdentityResult;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class IdentityApi {
    private ApiClient localVarApiClient;

    public IdentityApi() {
        this(Configuration.getDefaultApiClient());
    }

    public IdentityApi(ApiClient apiClient) {
        this.localVarApiClient = apiClient;
    }

    public ApiClient getApiClient() {
        return localVarApiClient;
    }

    public void setApiClient(ApiClient apiClient) {
        this.localVarApiClient = apiClient;
    }

    /**
     * Build call for getIdentity
     * @param pubKey Public key to verify. (required)
     * @param leftData Left part of the random data to sign (should be generated randomly).&lt;br&gt; When not provided, the server does not return a signature, even if it controls the key.  (optional)
     * @param signedIdentity X500 Distinguished Name representing the signed identity. (optional)
     * @param _callback Callback for upload/download progress
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Missing or invalid query parameter. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> Public key not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call getIdentityCall(String pubKey, String leftData, String signedIdentity, final ApiCallback _callback) throws ApiException {
        Object localVarPostBody = null;

        // create path and map variables
        String localVarPath = "/identity";

        List<Pair> localVarQueryParams = new ArrayList<Pair>();
        List<Pair> localVarCollectionQueryParams = new ArrayList<Pair>();
        if (pubKey != null) {
            localVarQueryParams.addAll(localVarApiClient.parameterToPair("pubKey", pubKey));
        }

        if (leftData != null) {
            localVarQueryParams.addAll(localVarApiClient.parameterToPair("leftData", leftData));
        }

        if (signedIdentity != null) {
            localVarQueryParams.addAll(localVarApiClient.parameterToPair("signedIdentity", signedIdentity));
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

        String[] localVarAuthNames = new String[] {  };
        return localVarApiClient.buildCall(localVarPath, "GET", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAuthNames, _callback);
    }

    @SuppressWarnings("rawtypes")
    private okhttp3.Call getIdentityValidateBeforeCall(String pubKey, String leftData, String signedIdentity, final ApiCallback _callback) throws ApiException {
        
        // verify the required parameter 'pubKey' is set
        if (pubKey == null) {
            throw new ApiException("Missing the required parameter 'pubKey' when calling getIdentity(Async)");
        }
        

        okhttp3.Call localVarCall = getIdentityCall(pubKey, leftData, signedIdentity, _callback);
        return localVarCall;

    }

    /**
     * Verify the identity of a user.
     * Use this endpoint to verify that the server knows a given public key and to get or check the identity of the user owning that key.&lt;br&gt; **NOTE: this endpoint is not protected and by default exposed on the port 3001, and not on port 3000 like for other API endpoints.&lt;br&gt; It is recommended to expose this endpoint publicly on the internet on HTTPS default port 443 and to configure the server&#39;s identity URL so that it resolves on this endpoint.**&lt;br&gt; If the server controls the private key associated to the public key, it can also sign some random data and return the produced signature to prove it owns the key.&lt;br&gt; The random data is built by concatenating the &#x60;leftData&#x60; parameter (provided by the client) and some random data generated by the server (returned in the &#x60;rightData&#x60; field).&lt;br&gt; The caller can then verify that the returned signature is valid for the public key (which proves the ownership of the private key by the server).&lt;br&gt; The caller can optionally read the TLS certificate securing this endpoint to get the certified identity of the owner of the domain of this identity endpoint.&lt;br&gt; If the server is configured to prevent users&#39; identity exposure, the caller must also provide a user identity signed at least once by the public key (as an X500 Distinguished Name). 
     * @param pubKey Public key to verify. (required)
     * @param leftData Left part of the random data to sign (should be generated randomly).&lt;br&gt; When not provided, the server does not return a signature, even if it controls the key.  (optional)
     * @param signedIdentity X500 Distinguished Name representing the signed identity. (optional)
     * @return IdentityResult
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Missing or invalid query parameter. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> Public key not found. </td><td>  -  </td></tr>
     </table>
     */
    public IdentityResult getIdentity(String pubKey, String leftData, String signedIdentity) throws ApiException {
        ApiResponse<IdentityResult> localVarResp = getIdentityWithHttpInfo(pubKey, leftData, signedIdentity);
        return localVarResp.getData();
    }

    /**
     * Verify the identity of a user.
     * Use this endpoint to verify that the server knows a given public key and to get or check the identity of the user owning that key.&lt;br&gt; **NOTE: this endpoint is not protected and by default exposed on the port 3001, and not on port 3000 like for other API endpoints.&lt;br&gt; It is recommended to expose this endpoint publicly on the internet on HTTPS default port 443 and to configure the server&#39;s identity URL so that it resolves on this endpoint.**&lt;br&gt; If the server controls the private key associated to the public key, it can also sign some random data and return the produced signature to prove it owns the key.&lt;br&gt; The random data is built by concatenating the &#x60;leftData&#x60; parameter (provided by the client) and some random data generated by the server (returned in the &#x60;rightData&#x60; field).&lt;br&gt; The caller can then verify that the returned signature is valid for the public key (which proves the ownership of the private key by the server).&lt;br&gt; The caller can optionally read the TLS certificate securing this endpoint to get the certified identity of the owner of the domain of this identity endpoint.&lt;br&gt; If the server is configured to prevent users&#39; identity exposure, the caller must also provide a user identity signed at least once by the public key (as an X500 Distinguished Name). 
     * @param pubKey Public key to verify. (required)
     * @param leftData Left part of the random data to sign (should be generated randomly).&lt;br&gt; When not provided, the server does not return a signature, even if it controls the key.  (optional)
     * @param signedIdentity X500 Distinguished Name representing the signed identity. (optional)
     * @return ApiResponse&lt;IdentityResult&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Missing or invalid query parameter. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> Public key not found. </td><td>  -  </td></tr>
     </table>
     */
    public ApiResponse<IdentityResult> getIdentityWithHttpInfo(String pubKey, String leftData, String signedIdentity) throws ApiException {
        okhttp3.Call localVarCall = getIdentityValidateBeforeCall(pubKey, leftData, signedIdentity, null);
        Type localVarReturnType = new TypeToken<IdentityResult>(){}.getType();
        return localVarApiClient.execute(localVarCall, localVarReturnType);
    }

    /**
     * Verify the identity of a user. (asynchronously)
     * Use this endpoint to verify that the server knows a given public key and to get or check the identity of the user owning that key.&lt;br&gt; **NOTE: this endpoint is not protected and by default exposed on the port 3001, and not on port 3000 like for other API endpoints.&lt;br&gt; It is recommended to expose this endpoint publicly on the internet on HTTPS default port 443 and to configure the server&#39;s identity URL so that it resolves on this endpoint.**&lt;br&gt; If the server controls the private key associated to the public key, it can also sign some random data and return the produced signature to prove it owns the key.&lt;br&gt; The random data is built by concatenating the &#x60;leftData&#x60; parameter (provided by the client) and some random data generated by the server (returned in the &#x60;rightData&#x60; field).&lt;br&gt; The caller can then verify that the returned signature is valid for the public key (which proves the ownership of the private key by the server).&lt;br&gt; The caller can optionally read the TLS certificate securing this endpoint to get the certified identity of the owner of the domain of this identity endpoint.&lt;br&gt; If the server is configured to prevent users&#39; identity exposure, the caller must also provide a user identity signed at least once by the public key (as an X500 Distinguished Name). 
     * @param pubKey Public key to verify. (required)
     * @param leftData Left part of the random data to sign (should be generated randomly).&lt;br&gt; When not provided, the server does not return a signature, even if it controls the key.  (optional)
     * @param signedIdentity X500 Distinguished Name representing the signed identity. (optional)
     * @param _callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Missing or invalid query parameter. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> Public key not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call getIdentityAsync(String pubKey, String leftData, String signedIdentity, final ApiCallback<IdentityResult> _callback) throws ApiException {

        okhttp3.Call localVarCall = getIdentityValidateBeforeCall(pubKey, leftData, signedIdentity, _callback);
        Type localVarReturnType = new TypeToken<IdentityResult>(){}.getType();
        localVarApiClient.executeAsync(localVarCall, localVarReturnType, _callback);
        return localVarCall;
    }
}
