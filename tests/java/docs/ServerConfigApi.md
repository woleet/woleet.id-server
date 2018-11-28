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
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.ServerConfigApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

ServerConfigApi apiInstance = new ServerConfigApi();
try {
    ServerConfig result = apiInstance.getServerConfig();
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling ServerConfigApi#getServerConfig");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ServerConfig**](ServerConfig.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="updateServerConfig"></a>
# **updateServerConfig**
> ServerConfig updateServerConfig(serverConfig)

Update the server configuration.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.ServerConfigApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

ServerConfigApi apiInstance = new ServerConfigApi();
ServerConfig serverConfig = new ServerConfig(); // ServerConfig | Replacement server config object.
try {
    ServerConfig result = apiInstance.updateServerConfig(serverConfig);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling ServerConfigApi#updateServerConfig");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **serverConfig** | [**ServerConfig**](ServerConfig.md)| Replacement server config object. |

### Return type

[**ServerConfig**](ServerConfig.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

