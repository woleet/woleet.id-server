# ApiTokenApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createAPIToken**](ApiTokenApi.md#createAPIToken) | **POST** /api-token | Create an API token.
[**deleteAPIToken**](ApiTokenApi.md#deleteAPIToken) | **DELETE** /api-token/{APITokenId} | Delete an API token.
[**getAPITokenById**](ApiTokenApi.md#getAPITokenById) | **GET** /api-token/{APITokenId} | Get an API token by its identifier.
[**getAPITokens**](ApiTokenApi.md#getAPITokens) | **GET** /api-token/list | Get all API tokens.
[**updateAPIToken**](ApiTokenApi.md#updateAPIToken) | **PUT** /api-token/{APITokenId} | Update an API token.


<a name="createAPIToken"></a>
# **createAPIToken**
> APITokenGet createAPIToken(apITokenPost)

Create an API token.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.ApiTokenApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure HTTP bearer authorization: APITokenAuth
    HttpBearerAuth APITokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("APITokenAuth");
    APITokenAuth.setBearerToken("BEARER TOKEN");

    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    ApiTokenApi apiInstance = new ApiTokenApi(defaultClient);
    APITokenPost apITokenPost = new APITokenPost(); // APITokenPost | API token object to create.
    try {
      APITokenGet result = apiInstance.createAPIToken(apITokenPost);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ApiTokenApi#createAPIToken");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apITokenPost** | [**APITokenPost**](APITokenPost.md)| API token object to create. |

### Return type

[**APITokenGet**](APITokenGet.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**400** | Invalid object supplied. |  -  |
**401** | Missing or invalid session cookie. |  -  |
**403** | Users cannot manage other users&#39; API tokens. |  -  |

<a name="deleteAPIToken"></a>
# **deleteAPIToken**
> APITokenGet deleteAPIToken(apITokenId)

Delete an API token.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.ApiTokenApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure HTTP bearer authorization: APITokenAuth
    HttpBearerAuth APITokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("APITokenAuth");
    APITokenAuth.setBearerToken("BEARER TOKEN");

    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    ApiTokenApi apiInstance = new ApiTokenApi(defaultClient);
    UUID apITokenId = f34d92e3-4f71-49ab-862f-69443bd48266; // UUID | Identifier of the API token.
    try {
      APITokenGet result = apiInstance.deleteAPIToken(apITokenId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ApiTokenApi#deleteAPIToken");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apITokenId** | [**UUID**](.md)| Identifier of the API token. |

### Return type

[**APITokenGet**](APITokenGet.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**400** | Invalid API token identifier. |  -  |
**401** | Missing or invalid session cookie. |  -  |
**403** | Users cannot manage other users&#39; API tokens. |  -  |
**404** | API token not found. |  -  |

<a name="getAPITokenById"></a>
# **getAPITokenById**
> APITokenGet getAPITokenById(apITokenId)

Get an API token by its identifier.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.ApiTokenApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure HTTP bearer authorization: APITokenAuth
    HttpBearerAuth APITokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("APITokenAuth");
    APITokenAuth.setBearerToken("BEARER TOKEN");

    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    ApiTokenApi apiInstance = new ApiTokenApi(defaultClient);
    UUID apITokenId = f34d92e3-4f71-49ab-862f-69443bd48266; // UUID | Identifier of the API token.
    try {
      APITokenGet result = apiInstance.getAPITokenById(apITokenId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ApiTokenApi#getAPITokenById");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apITokenId** | [**UUID**](.md)| Identifier of the API token. |

### Return type

[**APITokenGet**](APITokenGet.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**400** | Invalid API token identifier. |  -  |
**401** | Missing or invalid session cookie. |  -  |
**403** | Users cannot manage other users&#39; API tokens. |  -  |
**404** | API token not found. |  -  |

<a name="getAPITokens"></a>
# **getAPITokens**
> List&lt;APITokenGet&gt; getAPITokens()

Get all API tokens.

When logged as a user, only the tokens belonging to the user are returned.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.ApiTokenApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure HTTP bearer authorization: APITokenAuth
    HttpBearerAuth APITokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("APITokenAuth");
    APITokenAuth.setBearerToken("BEARER TOKEN");

    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    ApiTokenApi apiInstance = new ApiTokenApi(defaultClient);
    try {
      List<APITokenGet> result = apiInstance.getAPITokens();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ApiTokenApi#getAPITokens");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List&lt;APITokenGet&gt;**](APITokenGet.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Succesful operation. |  -  |
**401** | Missing or invalid session cookie. |  -  |

<a name="updateAPIToken"></a>
# **updateAPIToken**
> APITokenGet updateAPIToken(apITokenId, apITokenPut)

Update an API token.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.ApiTokenApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure HTTP bearer authorization: APITokenAuth
    HttpBearerAuth APITokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("APITokenAuth");
    APITokenAuth.setBearerToken("BEARER TOKEN");

    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    ApiTokenApi apiInstance = new ApiTokenApi(defaultClient);
    UUID apITokenId = f34d92e3-4f71-49ab-862f-69443bd48266; // UUID | Identifier of the API token.
    APITokenPut apITokenPut = new APITokenPut(); // APITokenPut | API token object to update.
    try {
      APITokenGet result = apiInstance.updateAPIToken(apITokenId, apITokenPut);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ApiTokenApi#updateAPIToken");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apITokenId** | [**UUID**](.md)| Identifier of the API token. |
 **apITokenPut** | [**APITokenPut**](APITokenPut.md)| API token object to update. |

### Return type

[**APITokenGet**](APITokenGet.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**400** | Invalid object supplied. |  -  |
**401** | Missing or invalid session cookie. |  -  |
**403** | Users cannot manage other users&#39; API tokens. |  -  |
**404** | API token not found. |  -  |

