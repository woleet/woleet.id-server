/*
 * Woleet.ID Server
 * This is Woleet.ID Server API documentation.
 *
 * The version of the OpenAPI document: 1.2.4
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
import io.woleet.idserver.api.model.SignatureResult;
import java.util.UUID;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SignatureApi {
    private ApiClient localVarApiClient;

    public SignatureApi() {
        this(Configuration.getDefaultApiClient());
    }

    public SignatureApi(ApiClient apiClient) {
        this.localVarApiClient = apiClient;
    }

    public ApiClient getApiClient() {
        return localVarApiClient;
    }

    public void setApiClient(ApiClient apiClient) {
        this.localVarApiClient = apiClient;
    }

    /**
     * Build call for getSignature
     * @param hashToSign SHA256 hash to be signed (a string formatted like [a-f0-9]{64}). (optional)
     * @param messageToSign Message to be signed. (optional)
     * @param userId User identifier. (optional)
     * @param customUserId Custom user identifier (ie. &#x60;userId&#x60; field of the user&#39;s identity). (optional)
     * @param pubKey The public key to use to sign.&lt;br&gt; When not provided and a user is provided, the default key of the user is used (if any).&lt;br&gt; When not provided and no user is provided, the default key of the server is used (if any).  (optional)
     * @param path The derivation path of the key to use to sign.&lt;br&gt; When not provided, the default derivation path \&quot;m/44&#39;/0&#39;/0&#39;\&quot; is used.  (optional)
     * @param identityToSign Identity to add to the signature: if you add this query without paramters, all known informations on wids will be added to the signature. You can also select the informations you want to add to the signature by providing a string with these X500 fields separated with &#39;,&#39;:&lt;br&gt;   CN: Common name&lt;br&gt;   O: Organization&lt;br&gt;   OU: Organization unit&lt;br&gt;   L: Locality&lt;br&gt;   C: Country&lt;br&gt;   EMAILADDRESS: Email address  (optional)
     * @param _callback Callback for upload/download progress
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Missing or invalid query parameter. More details are returned in the response body. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid token. More details are returned in the response body. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> Key or User not found. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> No &#x60;pubKey&#x60; parameter is provided and the server or the user has no default key to fallback on. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call getSignatureCall(String hashToSign, String messageToSign, UUID userId, String customUserId, String pubKey, String path, String identityToSign, final ApiCallback _callback) throws ApiException {
        Object localVarPostBody = null;

        // create path and map variables
        String localVarPath = "/sign";

        List<Pair> localVarQueryParams = new ArrayList<Pair>();
        List<Pair> localVarCollectionQueryParams = new ArrayList<Pair>();
        if (hashToSign != null) {
            localVarQueryParams.addAll(localVarApiClient.parameterToPair("hashToSign", hashToSign));
        }

        if (messageToSign != null) {
            localVarQueryParams.addAll(localVarApiClient.parameterToPair("messageToSign", messageToSign));
        }

        if (userId != null) {
            localVarQueryParams.addAll(localVarApiClient.parameterToPair("userId", userId));
        }

        if (customUserId != null) {
            localVarQueryParams.addAll(localVarApiClient.parameterToPair("customUserId", customUserId));
        }

        if (pubKey != null) {
            localVarQueryParams.addAll(localVarApiClient.parameterToPair("pubKey", pubKey));
        }

        if (path != null) {
            localVarQueryParams.addAll(localVarApiClient.parameterToPair("path", path));
        }

        if (identityToSign != null) {
            localVarQueryParams.addAll(localVarApiClient.parameterToPair("identityToSign", identityToSign));
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
    private okhttp3.Call getSignatureValidateBeforeCall(String hashToSign, String messageToSign, UUID userId, String customUserId, String pubKey, String path, String identityToSign, final ApiCallback _callback) throws ApiException {
        

        okhttp3.Call localVarCall = getSignatureCall(hashToSign, messageToSign, userId, customUserId, pubKey, path, identityToSign, _callback);
        return localVarCall;

    }

    /**
     * Sign a message or a SHA256 hash using a key.
     * Use this endpoint to sign a message or a SHA256 hash using one of the keys managed by the server.&lt;br&gt; **NOTE: this endpoint is by default exposed on the port 3002, and not on port 3000 like for other API endpoints. It is not recommended to expose this endpoint publicly on the internet.**&lt;br&gt; Provide the message to sign in the &#x60;messageToSign&#x60; parameter, or the SHA256 hash to sign in the &#x60;hashToSign&#x60; parameter.&lt;br&gt; When authenticated using an API token, the key to use can be specified using the &#x60;pubKey&#x60;, &#x60;userId&#x60; and/or &#x60;customUserId&#x60; parameters:&lt;br&gt; - set the &#x60;pubKey&#x60; parameter only: the referred key is used&lt;br&gt; - set the &#x60;userId&#x60; (or the &#x60;customUserId&#x60;) parameter only: the default key of the referred user is used (if any).&lt;br&gt; - set none of the 3 parameters: the default key of the server is used (if any).&lt;br&gt; When authenticated using an OAuth token, the key to use must be one of the authenticated user&#39;s keys and can be specified using the &#x60;pubKey&#x60; parameter. If not specified, the authenticated user&#39;s default key is used (if any). 
     * @param hashToSign SHA256 hash to be signed (a string formatted like [a-f0-9]{64}). (optional)
     * @param messageToSign Message to be signed. (optional)
     * @param userId User identifier. (optional)
     * @param customUserId Custom user identifier (ie. &#x60;userId&#x60; field of the user&#39;s identity). (optional)
     * @param pubKey The public key to use to sign.&lt;br&gt; When not provided and a user is provided, the default key of the user is used (if any).&lt;br&gt; When not provided and no user is provided, the default key of the server is used (if any).  (optional)
     * @param path The derivation path of the key to use to sign.&lt;br&gt; When not provided, the default derivation path \&quot;m/44&#39;/0&#39;/0&#39;\&quot; is used.  (optional)
     * @param identityToSign Identity to add to the signature: if you add this query without paramters, all known informations on wids will be added to the signature. You can also select the informations you want to add to the signature by providing a string with these X500 fields separated with &#39;,&#39;:&lt;br&gt;   CN: Common name&lt;br&gt;   O: Organization&lt;br&gt;   OU: Organization unit&lt;br&gt;   L: Locality&lt;br&gt;   C: Country&lt;br&gt;   EMAILADDRESS: Email address  (optional)
     * @return SignatureResult
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Missing or invalid query parameter. More details are returned in the response body. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid token. More details are returned in the response body. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> Key or User not found. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> No &#x60;pubKey&#x60; parameter is provided and the server or the user has no default key to fallback on. </td><td>  -  </td></tr>
     </table>
     */
    public SignatureResult getSignature(String hashToSign, String messageToSign, UUID userId, String customUserId, String pubKey, String path, String identityToSign) throws ApiException {
        ApiResponse<SignatureResult> localVarResp = getSignatureWithHttpInfo(hashToSign, messageToSign, userId, customUserId, pubKey, path, identityToSign);
        return localVarResp.getData();
    }

    /**
     * Sign a message or a SHA256 hash using a key.
     * Use this endpoint to sign a message or a SHA256 hash using one of the keys managed by the server.&lt;br&gt; **NOTE: this endpoint is by default exposed on the port 3002, and not on port 3000 like for other API endpoints. It is not recommended to expose this endpoint publicly on the internet.**&lt;br&gt; Provide the message to sign in the &#x60;messageToSign&#x60; parameter, or the SHA256 hash to sign in the &#x60;hashToSign&#x60; parameter.&lt;br&gt; When authenticated using an API token, the key to use can be specified using the &#x60;pubKey&#x60;, &#x60;userId&#x60; and/or &#x60;customUserId&#x60; parameters:&lt;br&gt; - set the &#x60;pubKey&#x60; parameter only: the referred key is used&lt;br&gt; - set the &#x60;userId&#x60; (or the &#x60;customUserId&#x60;) parameter only: the default key of the referred user is used (if any).&lt;br&gt; - set none of the 3 parameters: the default key of the server is used (if any).&lt;br&gt; When authenticated using an OAuth token, the key to use must be one of the authenticated user&#39;s keys and can be specified using the &#x60;pubKey&#x60; parameter. If not specified, the authenticated user&#39;s default key is used (if any). 
     * @param hashToSign SHA256 hash to be signed (a string formatted like [a-f0-9]{64}). (optional)
     * @param messageToSign Message to be signed. (optional)
     * @param userId User identifier. (optional)
     * @param customUserId Custom user identifier (ie. &#x60;userId&#x60; field of the user&#39;s identity). (optional)
     * @param pubKey The public key to use to sign.&lt;br&gt; When not provided and a user is provided, the default key of the user is used (if any).&lt;br&gt; When not provided and no user is provided, the default key of the server is used (if any).  (optional)
     * @param path The derivation path of the key to use to sign.&lt;br&gt; When not provided, the default derivation path \&quot;m/44&#39;/0&#39;/0&#39;\&quot; is used.  (optional)
     * @param identityToSign Identity to add to the signature: if you add this query without paramters, all known informations on wids will be added to the signature. You can also select the informations you want to add to the signature by providing a string with these X500 fields separated with &#39;,&#39;:&lt;br&gt;   CN: Common name&lt;br&gt;   O: Organization&lt;br&gt;   OU: Organization unit&lt;br&gt;   L: Locality&lt;br&gt;   C: Country&lt;br&gt;   EMAILADDRESS: Email address  (optional)
     * @return ApiResponse&lt;SignatureResult&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Missing or invalid query parameter. More details are returned in the response body. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid token. More details are returned in the response body. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> Key or User not found. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> No &#x60;pubKey&#x60; parameter is provided and the server or the user has no default key to fallback on. </td><td>  -  </td></tr>
     </table>
     */
    public ApiResponse<SignatureResult> getSignatureWithHttpInfo(String hashToSign, String messageToSign, UUID userId, String customUserId, String pubKey, String path, String identityToSign) throws ApiException {
        okhttp3.Call localVarCall = getSignatureValidateBeforeCall(hashToSign, messageToSign, userId, customUserId, pubKey, path, identityToSign, null);
        Type localVarReturnType = new TypeToken<SignatureResult>(){}.getType();
        return localVarApiClient.execute(localVarCall, localVarReturnType);
    }

    /**
     * Sign a message or a SHA256 hash using a key. (asynchronously)
     * Use this endpoint to sign a message or a SHA256 hash using one of the keys managed by the server.&lt;br&gt; **NOTE: this endpoint is by default exposed on the port 3002, and not on port 3000 like for other API endpoints. It is not recommended to expose this endpoint publicly on the internet.**&lt;br&gt; Provide the message to sign in the &#x60;messageToSign&#x60; parameter, or the SHA256 hash to sign in the &#x60;hashToSign&#x60; parameter.&lt;br&gt; When authenticated using an API token, the key to use can be specified using the &#x60;pubKey&#x60;, &#x60;userId&#x60; and/or &#x60;customUserId&#x60; parameters:&lt;br&gt; - set the &#x60;pubKey&#x60; parameter only: the referred key is used&lt;br&gt; - set the &#x60;userId&#x60; (or the &#x60;customUserId&#x60;) parameter only: the default key of the referred user is used (if any).&lt;br&gt; - set none of the 3 parameters: the default key of the server is used (if any).&lt;br&gt; When authenticated using an OAuth token, the key to use must be one of the authenticated user&#39;s keys and can be specified using the &#x60;pubKey&#x60; parameter. If not specified, the authenticated user&#39;s default key is used (if any). 
     * @param hashToSign SHA256 hash to be signed (a string formatted like [a-f0-9]{64}). (optional)
     * @param messageToSign Message to be signed. (optional)
     * @param userId User identifier. (optional)
     * @param customUserId Custom user identifier (ie. &#x60;userId&#x60; field of the user&#39;s identity). (optional)
     * @param pubKey The public key to use to sign.&lt;br&gt; When not provided and a user is provided, the default key of the user is used (if any).&lt;br&gt; When not provided and no user is provided, the default key of the server is used (if any).  (optional)
     * @param path The derivation path of the key to use to sign.&lt;br&gt; When not provided, the default derivation path \&quot;m/44&#39;/0&#39;/0&#39;\&quot; is used.  (optional)
     * @param identityToSign Identity to add to the signature: if you add this query without paramters, all known informations on wids will be added to the signature. You can also select the informations you want to add to the signature by providing a string with these X500 fields separated with &#39;,&#39;:&lt;br&gt;   CN: Common name&lt;br&gt;   O: Organization&lt;br&gt;   OU: Organization unit&lt;br&gt;   L: Locality&lt;br&gt;   C: Country&lt;br&gt;   EMAILADDRESS: Email address  (optional)
     * @param _callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Missing or invalid query parameter. More details are returned in the response body. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid token. More details are returned in the response body. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> Key or User not found. </td><td>  -  </td></tr>
        <tr><td> 403 </td><td> No &#x60;pubKey&#x60; parameter is provided and the server or the user has no default key to fallback on. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call getSignatureAsync(String hashToSign, String messageToSign, UUID userId, String customUserId, String pubKey, String path, String identityToSign, final ApiCallback<SignatureResult> _callback) throws ApiException {

        okhttp3.Call localVarCall = getSignatureValidateBeforeCall(hashToSign, messageToSign, userId, customUserId, pubKey, path, identityToSign, _callback);
        Type localVarReturnType = new TypeToken<SignatureResult>(){}.getType();
        localVarApiClient.executeAsync(localVarCall, localVarReturnType, _callback);
        return localVarCall;
    }
}
