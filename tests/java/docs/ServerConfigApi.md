# ServerConfigApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getServerConfig**](ServerConfigApi.md#getServerConfig) | **GET** /server-config | Get the server configuration.
[**updateServerConfig**](ServerConfigApi.md#updateServerConfig) | **PUT** /server-config | Update the server configuration.


<a name="getServerConfig"></a>
# **getServerConfig**
> ServerConfig getServerConfig()

Get the server configuration.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.ServerConfigApi;

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

    ServerConfigApi apiInstance = new ServerConfigApi(defaultClient);
    try {
      ServerConfig result = apiInstance.getServerConfig();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ServerConfigApi#getServerConfig");
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

[**ServerConfig**](ServerConfig.md)

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
**404** | API token not found. |  -  |

<a name="updateServerConfig"></a>
# **updateServerConfig**
> ServerConfig updateServerConfig(serverConfig)

Update the server configuration.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.ServerConfigApi;

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

    ServerConfigApi apiInstance = new ServerConfigApi(defaultClient);
    ServerConfig serverConfig = new ServerConfig(); // ServerConfig | Server config object.
    try {
      ServerConfig result = apiInstance.updateServerConfig(serverConfig);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ServerConfigApi#updateServerConfig");
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
 **serverConfig** | [**ServerConfig**](ServerConfig.md)| Server config object. |

### Return type

[**ServerConfig**](ServerConfig.md)

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
**404** | API token not found. |  -  |

