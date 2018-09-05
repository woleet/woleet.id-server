# ApiTokenApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createAPIToken**](ApiTokenApi.md#createAPIToken) | **POST** /APIToken | Create an API token.
[**deleteAPIToken**](ApiTokenApi.md#deleteAPIToken) | **DELETE** /APIToken/{APITokenId} | Delete an API token.
[**getAPITokenById**](ApiTokenApi.md#getAPITokenById) | **GET** /APIToken/{APITokenId} | Get an API token by its identifier.
[**getAllAPITokens**](ApiTokenApi.md#getAllAPITokens) | **GET** /APIToken/list | List all API tokens.
[**updateAPIToken**](ApiTokenApi.md#updateAPIToken) | **PUT** /APIToken/{APITokenId} | Update an API token.


<a name="createAPIToken"></a>
# **createAPIToken**
> APIToken createAPIToken(apITokenPost)

Create an API token.

Create an API token suitable to call the /sign endpoint (this can only be done by an admin).

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.ApiTokenApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

ApiTokenApi apiInstance = new ApiTokenApi();
APITokenPost apITokenPost = new APITokenPost(); // APITokenPost | API token object to create.
try {
    APIToken result = apiInstance.createAPIToken(apITokenPost);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling ApiTokenApi#createAPIToken");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apITokenPost** | [**APITokenPost**](APITokenPost.md)| API token object to create. |

### Return type

[**APIToken**](APIToken.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteAPIToken"></a>
# **deleteAPIToken**
> APIToken deleteAPIToken(apITokenId)

Delete an API token.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.ApiTokenApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

ApiTokenApi apiInstance = new ApiTokenApi();
UUID apITokenId = f34d92e3-4f71-49ab-862f-69443bd48266; // UUID | Identifier of the API token.
try {
    APIToken result = apiInstance.deleteAPIToken(apITokenId);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling ApiTokenApi#deleteAPIToken");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apITokenId** | [**UUID**](.md)| Identifier of the API token. |

### Return type

[**APIToken**](APIToken.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getAPITokenById"></a>
# **getAPITokenById**
> APIToken getAPITokenById(apITokenId)

Get an API token by its identifier.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.ApiTokenApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

ApiTokenApi apiInstance = new ApiTokenApi();
UUID apITokenId = f34d92e3-4f71-49ab-862f-69443bd48266; // UUID | Identifier of the API token.
try {
    APIToken result = apiInstance.getAPITokenById(apITokenId);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling ApiTokenApi#getAPITokenById");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apITokenId** | [**UUID**](.md)| Identifier of the API token. |

### Return type

[**APIToken**](APIToken.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getAllAPITokens"></a>
# **getAllAPITokens**
> APITokenArray getAllAPITokens(full)

List all API tokens.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.ApiTokenApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

ApiTokenApi apiInstance = new ApiTokenApi();
Boolean full = true; // Boolean | Include deleted elements in the returned list.
try {
    APITokenArray result = apiInstance.getAllAPITokens(full);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling ApiTokenApi#getAllAPITokens");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **full** | **Boolean**| Include deleted elements in the returned list. | [optional]

### Return type

[**APITokenArray**](APITokenArray.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="updateAPIToken"></a>
# **updateAPIToken**
> APIToken updateAPIToken(apITokenId, apITokenPut)

Update an API token.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.ApiTokenApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

ApiTokenApi apiInstance = new ApiTokenApi();
UUID apITokenId = f34d92e3-4f71-49ab-862f-69443bd48266; // UUID | Identifier of the API token.
APITokenPut apITokenPut = new APITokenPut(); // APITokenPut | API token object to update.
try {
    APIToken result = apiInstance.updateAPIToken(apITokenId, apITokenPut);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling ApiTokenApi#updateAPIToken");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apITokenId** | [**UUID**](.md)| Identifier of the API token. |
 **apITokenPut** | [**APITokenPut**](APITokenPut.md)| API token object to update. |

### Return type

[**APIToken**](APIToken.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

