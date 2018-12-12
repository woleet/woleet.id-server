# DiscoveryApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**discoverUserByPubKey**](DiscoveryApi.md#discoverUserByPubKey) | **GET** /discover/user/{pubKey} | Get the user associated to a public key.
[**discoverUserKeys**](DiscoveryApi.md#discoverUserKeys) | **GET** /discover/keys/{userId} | Get all public keys of a user.
[**discoverUsers**](DiscoveryApi.md#discoverUsers) | **GET** /discover/users | Get all users matching a search string.


<a name="discoverUserByPubKey"></a>
# **discoverUserByPubKey**
> UserDisco discoverUserByPubKey(pubKey)

Get the user associated to a public key.

Use this endpoint to get the user owning a given public key. 

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.DiscoveryApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

DiscoveryApi apiInstance = new DiscoveryApi();
String pubKey = 1GChJMuyxvq28F3Uksqf5v7QkxQ4WLQdBh; // String | Public key (bitcoin address when using BIP39 keys).
try {
    UserDisco result = apiInstance.discoverUserByPubKey(pubKey);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DiscoveryApi#discoverUserByPubKey");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pubKey** | **String**| Public key (bitcoin address when using BIP39 keys). |

### Return type

[**UserDisco**](UserDisco.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="discoverUserKeys"></a>
# **discoverUserKeys**
> List&lt;KeyDisco&gt; discoverUserKeys(userId)

Get all public keys of a user.

Use this endpoint to get all public keys owned by a given user. 

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.DiscoveryApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

DiscoveryApi apiInstance = new DiscoveryApi();
UUID userId = feb37e23-d04e-4e71-bf53-1f1a75ba3a68; // UUID | Identifier of the user.
try {
    List<KeyDisco> result = apiInstance.discoverUserKeys(userId);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DiscoveryApi#discoverUserKeys");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**UUID**](.md)| Identifier of the user. |

### Return type

[**List&lt;KeyDisco&gt;**](KeyDisco.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="discoverUsers"></a>
# **discoverUsers**
> List&lt;UserDisco&gt; discoverUsers(search)

Get all users matching a search string.

Use this endpoint to get all users whose &#x60;email&#x60;, &#x60;username&#x60;, &#x60;x500CommonName&#x60;, &#x60;x500Organization&#x60; or &#x60;x500OrganizationalUnit&#x60; contains the search string. 

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.DiscoveryApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

DiscoveryApi apiInstance = new DiscoveryApi();
String search = {"email":{"value":"john.doe@acme.com"},"username":{"value":"johndoe"},"x500CommonName":{"value":"John Doe"},"x500Organization":{"value":"Acme corp"},"x500OrganizationalUnit":{"value":"Business unit"}}; // String | A string used to search users through the fields `email`, `username`, `x500CommonName`, `x500Organization` and `x500OrganizationalUnit`.
try {
    List<UserDisco> result = apiInstance.discoverUsers(search);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DiscoveryApi#discoverUsers");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **search** | **String**| A string used to search users through the fields &#x60;email&#x60;, &#x60;username&#x60;, &#x60;x500CommonName&#x60;, &#x60;x500Organization&#x60; and &#x60;x500OrganizationalUnit&#x60;. |

### Return type

[**List&lt;UserDisco&gt;**](UserDisco.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

