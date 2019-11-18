# ServerEventApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getServerEventById**](ServerEventApi.md#getServerEventById) | **GET** /server-event/{ServerEventId} | Get a server event by its identifier.
[**getServerEventList**](ServerEventApi.md#getServerEventList) | **GET** /server-event/list | List all server events.


<a name="getServerEventById"></a>
# **getServerEventById**
> ServerEventGet getServerEventById(serverEventId)

Get a server event by its identifier.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.ServerEventApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    ServerEventApi apiInstance = new ServerEventApi(defaultClient);
    UUID serverEventId = 813797c8-01e3-4a80-8068-bc2bda13df16; // UUID | Identifier of the server event.
    try {
      ServerEventGet result = apiInstance.getServerEventById(serverEventId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ServerEventApi#getServerEventById");
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
 **serverEventId** | [**UUID**](.md)| Identifier of the server event. |

### Return type

[**ServerEventGet**](ServerEventGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**400** | Invalid Server Event identifier. |  -  |
**401** | Missing or invalid session cookie. |  -  |
**404** | Server Event not found. |  -  |

<a name="getServerEventList"></a>
# **getServerEventList**
> List&lt;ServerEventGet&gt; getServerEventList()

List all server events.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.ServerEventApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    ServerEventApi apiInstance = new ServerEventApi(defaultClient);
    try {
      List<ServerEventGet> result = apiInstance.getServerEventList();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ServerEventApi#getServerEventList");
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

[**List&lt;ServerEventGet&gt;**](ServerEventGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Succesful operation. |  -  |
**401** | Missing or invalid session cookie. |  -  |

