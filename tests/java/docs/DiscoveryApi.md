# DiscoveryApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**discoverConfig**](DiscoveryApi.md#discoverConfig) | **GET** /discover/config | Get the server configuration.
[**discoverUser**](DiscoveryApi.md#discoverUser) | **GET** /discover/user | Get the current authenticated user.
[**discoverUserByPubKey**](DiscoveryApi.md#discoverUserByPubKey) | **GET** /discover/user/{pubKey} | Get the user associated to a public key.
[**discoverUserKeys**](DiscoveryApi.md#discoverUserKeys) | **GET** /discover/keys/{userId} | Get all the public keys of a user.
[**discoverUsers**](DiscoveryApi.md#discoverUsers) | **GET** /discover/users | Get all the users matching a set of filters.


<a name="discoverConfig"></a>
# **discoverConfig**
> ConfigDisco discoverConfig()

Get the server configuration.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.DiscoveryApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure HTTP bearer authorization: APITokenAuth
    HttpBearerAuth APITokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("APITokenAuth");
    APITokenAuth.setBearerToken("BEARER TOKEN");

    // Configure HTTP bearer authorization: OAuthTokenAuth
    HttpBearerAuth OAuthTokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("OAuthTokenAuth");
    OAuthTokenAuth.setBearerToken("BEARER TOKEN");

    DiscoveryApi apiInstance = new DiscoveryApi(defaultClient);
    try {
      ConfigDisco result = apiInstance.discoverConfig();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DiscoveryApi#discoverConfig");
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

[**ConfigDisco**](ConfigDisco.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [OAuthTokenAuth](../README.md#OAuthTokenAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**401** | Missing or invalid session cookie. |  -  |

<a name="discoverUser"></a>
# **discoverUser**
> UserDisco discoverUser()

Get the current authenticated user.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.DiscoveryApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure HTTP bearer authorization: APITokenAuth
    HttpBearerAuth APITokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("APITokenAuth");
    APITokenAuth.setBearerToken("BEARER TOKEN");

    // Configure HTTP bearer authorization: OAuthTokenAuth
    HttpBearerAuth OAuthTokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("OAuthTokenAuth");
    OAuthTokenAuth.setBearerToken("BEARER TOKEN");

    DiscoveryApi apiInstance = new DiscoveryApi(defaultClient);
    try {
      UserDisco result = apiInstance.discoverUser();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DiscoveryApi#discoverUser");
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

[**UserDisco**](UserDisco.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [OAuthTokenAuth](../README.md#OAuthTokenAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**204** | Successful operation. The current authenticated user is a server admin. |  -  |
**401** | Missing or invalid session cookie. |  -  |
**404** | User not found. |  -  |

<a name="discoverUserByPubKey"></a>
# **discoverUserByPubKey**
> UserDisco discoverUserByPubKey(pubKey)

Get the user associated to a public key.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.DiscoveryApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure HTTP bearer authorization: APITokenAuth
    HttpBearerAuth APITokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("APITokenAuth");
    APITokenAuth.setBearerToken("BEARER TOKEN");

    // Configure HTTP bearer authorization: OAuthTokenAuth
    HttpBearerAuth OAuthTokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("OAuthTokenAuth");
    OAuthTokenAuth.setBearerToken("BEARER TOKEN");

    DiscoveryApi apiInstance = new DiscoveryApi(defaultClient);
    String pubKey = 1GChJMuyxvq28F3Uksqf5v7QkxQ4WLQdBh; // String | Public key (bitcoin address when using BIP39 keys).
    try {
      UserDisco result = apiInstance.discoverUserByPubKey(pubKey);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DiscoveryApi#discoverUserByPubKey");
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
 **pubKey** | **String**| Public key (bitcoin address when using BIP39 keys). |

### Return type

[**UserDisco**](UserDisco.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [OAuthTokenAuth](../README.md#OAuthTokenAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**401** | Missing or invalid session cookie. |  -  |
**404** | User not found. |  -  |

<a name="discoverUserKeys"></a>
# **discoverUserKeys**
> List&lt;KeyDisco&gt; discoverUserKeys(userId)

Get all the public keys of a user.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.DiscoveryApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure HTTP bearer authorization: APITokenAuth
    HttpBearerAuth APITokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("APITokenAuth");
    APITokenAuth.setBearerToken("BEARER TOKEN");

    // Configure HTTP bearer authorization: OAuthTokenAuth
    HttpBearerAuth OAuthTokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("OAuthTokenAuth");
    OAuthTokenAuth.setBearerToken("BEARER TOKEN");

    DiscoveryApi apiInstance = new DiscoveryApi(defaultClient);
    UUID userId = feb37e23-d04e-4e71-bf53-1f1a75ba3a68; // UUID | Identifier of the user.
    try {
      List<KeyDisco> result = apiInstance.discoverUserKeys(userId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DiscoveryApi#discoverUserKeys");
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
 **userId** | [**UUID**](.md)| Identifier of the user. |

### Return type

[**List&lt;KeyDisco&gt;**](KeyDisco.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [OAuthTokenAuth](../README.md#OAuthTokenAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**400** | Invalid user identifier. |  -  |
**401** | Missing or invalid session cookie. |  -  |
**404** | User not found. |  -  |

<a name="discoverUsers"></a>
# **discoverUsers**
> List&lt;UserDisco&gt; discoverUsers(offset, limit, search)

Get all the users matching a set of filters.

Use this operation to get all the users, or a subset of the users matching specified filters.&lt;br&gt; Results can be paged. 

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.DiscoveryApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure HTTP bearer authorization: APITokenAuth
    HttpBearerAuth APITokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("APITokenAuth");
    APITokenAuth.setBearerToken("BEARER TOKEN");

    // Configure HTTP bearer authorization: OAuthTokenAuth
    HttpBearerAuth OAuthTokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("OAuthTokenAuth");
    OAuthTokenAuth.setBearerToken("BEARER TOKEN");

    DiscoveryApi apiInstance = new DiscoveryApi(defaultClient);
    Integer offset = 20; // Integer | Offset of the returned results (0 to get all results from the beginning).
    Integer limit = 20; // Integer | Maximum number of returned results.
    String search = John Doe; // String | Filter the users using a search string.<br> Only users whose `email`, `username`, `identity.commonName`, `identity.organization` or `identity.organizationalUnit` contains the search string match. 
    try {
      List<UserDisco> result = apiInstance.discoverUsers(offset, limit, search);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DiscoveryApi#discoverUsers");
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
 **offset** | **Integer**| Offset of the returned results (0 to get all results from the beginning). | [optional]
 **limit** | **Integer**| Maximum number of returned results. | [optional]
 **search** | **String**| Filter the users using a search string.&lt;br&gt; Only users whose &#x60;email&#x60;, &#x60;username&#x60;, &#x60;identity.commonName&#x60;, &#x60;identity.organization&#x60; or &#x60;identity.organizationalUnit&#x60; contains the search string match.  | [optional]

### Return type

[**List&lt;UserDisco&gt;**](UserDisco.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [OAuthTokenAuth](../README.md#OAuthTokenAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**401** | Missing or invalid session cookie. |  -  |

