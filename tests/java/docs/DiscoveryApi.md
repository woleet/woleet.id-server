# DiscoveryApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**discoverConfig**](DiscoveryApi.md#discoverConfig) | **GET** /discover/config | Get the server configuration.
[**discoverUser**](DiscoveryApi.md#discoverUser) | **GET** /discover/user | Get the current logged user.
[**discoverUserByPubKey**](DiscoveryApi.md#discoverUserByPubKey) | **GET** /discover/user/{pubKey} | Get the user associated to a public key.
[**discoverUserKeys**](DiscoveryApi.md#discoverUserKeys) | **GET** /discover/keys/{userId} | Get all public keys of a user.
[**discoverUsers**](DiscoveryApi.md#discoverUsers) | **GET** /discover/users | Get all users matching a search string.


<a name="discoverConfig"></a>
# **discoverConfig**
> ConfigDisco discoverConfig()

Get the server configuration.

Use this endpoint to get the server configuration. 

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

Get the current logged user.

Use this endpoint to get the current logged user. 

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
**200** | Successful operation. Send the user corresponding to the token. |  -  |
**204** | Successful operation. This case occurs when this endpoint is called with an admin token. |  -  |
**401** | Missing or invalid session cookie. |  -  |
**404** | User not found. |  -  |

<a name="discoverUserByPubKey"></a>
# **discoverUserByPubKey**
> UserDisco discoverUserByPubKey(pubKey)

Get the user associated to a public key.

Use this endpoint to get the user owning a public key. 

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

Get all public keys of a user.

Use this endpoint to get all public keys owned by a user. 

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
> List&lt;UserDisco&gt; discoverUsers(search)

Get all users matching a search string.

Use this endpoint to get all users whose &#x60;email&#x60;, &#x60;username&#x60;, &#x60;identity.commonName&#x60;, &#x60;identity.organization&#x60; or &#x60;identity.organizationalUnit&#x60; contains the search string. 

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
    String search = {"email":{"value":"john.doe@acme.com"},"username":{"value":"johndoe"},"x500CommonName":{"value":"John Doe"},"x500Organization":{"value":"Acme corp"},"x500OrganizationalUnit":{"value":"Sales dept"}}; // String | A string used to search users through the fields `email`, `username`, `x500CommonName`, `x500Organization` and `x500OrganizationalUnit`.
    try {
      List<UserDisco> result = apiInstance.discoverUsers(search);
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
 **search** | **String**| A string used to search users through the fields &#x60;email&#x60;, &#x60;username&#x60;, &#x60;x500CommonName&#x60;, &#x60;x500Organization&#x60; and &#x60;x500OrganizationalUnit&#x60;. |

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

