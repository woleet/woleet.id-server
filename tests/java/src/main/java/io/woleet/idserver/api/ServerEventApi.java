/*
 * Woleet.ID Server
 * This is Woleet.ID Server API documentation.
 *
 * The version of the OpenAPI document: 1.2.2
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
import io.woleet.idserver.api.model.ServerEventGet;
import java.util.UUID;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ServerEventApi {
    private ApiClient localVarApiClient;

    public ServerEventApi() {
        this(Configuration.getDefaultApiClient());
    }

    public ServerEventApi(ApiClient apiClient) {
        this.localVarApiClient = apiClient;
    }

    public ApiClient getApiClient() {
        return localVarApiClient;
    }

    public void setApiClient(ApiClient apiClient) {
        this.localVarApiClient = apiClient;
    }

    /**
     * Build call for getServerEventById
     * @param serverEventId Identifier of the server event. (required)
     * @param _callback Callback for upload/download progress
     * @return Call to execute
     * @throws ApiException If fail to serialize the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid Server Event identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> Server Event not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call getServerEventByIdCall(UUID serverEventId, final ApiCallback _callback) throws ApiException {
        Object localVarPostBody = null;

        // create path and map variables
        String localVarPath = "/server-event/{ServerEventId}"
            .replaceAll("\\{" + "ServerEventId" + "\\}", localVarApiClient.escapeString(serverEventId.toString()));

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

        String[] localVarAuthNames = new String[] { "CookieAuth" };
        return localVarApiClient.buildCall(localVarPath, "GET", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAuthNames, _callback);
    }

    @SuppressWarnings("rawtypes")
    private okhttp3.Call getServerEventByIdValidateBeforeCall(UUID serverEventId, final ApiCallback _callback) throws ApiException {
        
        // verify the required parameter 'serverEventId' is set
        if (serverEventId == null) {
            throw new ApiException("Missing the required parameter 'serverEventId' when calling getServerEventById(Async)");
        }
        

        okhttp3.Call localVarCall = getServerEventByIdCall(serverEventId, _callback);
        return localVarCall;

    }

    /**
     * Get a server event by its identifier.
     * 
     * @param serverEventId Identifier of the server event. (required)
     * @return ServerEventGet
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid Server Event identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> Server Event not found. </td><td>  -  </td></tr>
     </table>
     */
    public ServerEventGet getServerEventById(UUID serverEventId) throws ApiException {
        ApiResponse<ServerEventGet> localVarResp = getServerEventByIdWithHttpInfo(serverEventId);
        return localVarResp.getData();
    }

    /**
     * Get a server event by its identifier.
     * 
     * @param serverEventId Identifier of the server event. (required)
     * @return ApiResponse&lt;ServerEventGet&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid Server Event identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> Server Event not found. </td><td>  -  </td></tr>
     </table>
     */
    public ApiResponse<ServerEventGet> getServerEventByIdWithHttpInfo(UUID serverEventId) throws ApiException {
        okhttp3.Call localVarCall = getServerEventByIdValidateBeforeCall(serverEventId, null);
        Type localVarReturnType = new TypeToken<ServerEventGet>(){}.getType();
        return localVarApiClient.execute(localVarCall, localVarReturnType);
    }

    /**
     * Get a server event by its identifier. (asynchronously)
     * 
     * @param serverEventId Identifier of the server event. (required)
     * @param _callback The callback to be executed when the API call finishes
     * @return The request call
     * @throws ApiException If fail to process the API call, e.g. serializing the request body object
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Successful operation. </td><td>  -  </td></tr>
        <tr><td> 400 </td><td> Invalid Server Event identifier. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
        <tr><td> 404 </td><td> Server Event not found. </td><td>  -  </td></tr>
     </table>
     */
    public okhttp3.Call getServerEventByIdAsync(UUID serverEventId, final ApiCallback<ServerEventGet> _callback) throws ApiException {

        okhttp3.Call localVarCall = getServerEventByIdValidateBeforeCall(serverEventId, _callback);
        Type localVarReturnType = new TypeToken<ServerEventGet>(){}.getType();
        localVarApiClient.executeAsync(localVarCall, localVarReturnType, _callback);
        return localVarCall;
    }
    /**
     * Build call for getServerEventList
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
    public okhttp3.Call getServerEventListCall(final ApiCallback _callback) throws ApiException {
        Object localVarPostBody = null;

        // create path and map variables
        String localVarPath = "/server-event/list";

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

        String[] localVarAuthNames = new String[] { "CookieAuth" };
        return localVarApiClient.buildCall(localVarPath, "GET", localVarQueryParams, localVarCollectionQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAuthNames, _callback);
    }

    @SuppressWarnings("rawtypes")
    private okhttp3.Call getServerEventListValidateBeforeCall(final ApiCallback _callback) throws ApiException {
        

        okhttp3.Call localVarCall = getServerEventListCall(_callback);
        return localVarCall;

    }

    /**
     * List all server events.
     * 
     * @return List&lt;ServerEventGet&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Succesful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
     </table>
     */
    public List<ServerEventGet> getServerEventList() throws ApiException {
        ApiResponse<List<ServerEventGet>> localVarResp = getServerEventListWithHttpInfo();
        return localVarResp.getData();
    }

    /**
     * List all server events.
     * 
     * @return ApiResponse&lt;List&lt;ServerEventGet&gt;&gt;
     * @throws ApiException If fail to call the API, e.g. server error or cannot deserialize the response body
     * @http.response.details
     <table summary="Response Details" border="1">
        <tr><td> Status Code </td><td> Description </td><td> Response Headers </td></tr>
        <tr><td> 200 </td><td> Succesful operation. </td><td>  -  </td></tr>
        <tr><td> 401 </td><td> Missing or invalid session cookie. </td><td>  -  </td></tr>
     </table>
     */
    public ApiResponse<List<ServerEventGet>> getServerEventListWithHttpInfo() throws ApiException {
        okhttp3.Call localVarCall = getServerEventListValidateBeforeCall(null);
        Type localVarReturnType = new TypeToken<List<ServerEventGet>>(){}.getType();
        return localVarApiClient.execute(localVarCall, localVarReturnType);
    }

    /**
     * List all server events. (asynchronously)
     * 
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
    public okhttp3.Call getServerEventListAsync(final ApiCallback<List<ServerEventGet>> _callback) throws ApiException {

        okhttp3.Call localVarCall = getServerEventListValidateBeforeCall(_callback);
        Type localVarReturnType = new TypeToken<List<ServerEventGet>>(){}.getType();
        localVarApiClient.executeAsync(localVarCall, localVarReturnType, _callback);
        return localVarCall;
    }
}
