# KeyApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createExternalKey**](KeyApi.md#createExternalKey) | **POST** /user/{userId}/extern-key | Create a new external key for a user.
[**createKey**](KeyApi.md#createKey) | **POST** /user/{userId}/key | Create a new key for a user.
[**deleteKey**](KeyApi.md#deleteKey) | **DELETE** /key/{keyId} | Delete a key.
[**getKeyById**](KeyApi.md#getKeyById) | **GET** /key/{keyId} | Get a key by its identifier.
[**getUserKeys**](KeyApi.md#getUserKeys) | **GET** /user/{userId}/key/list | Get all the keys of a user.
[**updateKey**](KeyApi.md#updateKey) | **PUT** /key/{keyId} | Update a key.


<a name="createExternalKey"></a>
# **createExternalKey**
> KeyGet createExternalKey(userId, externalKeyPost)

Create a new external key for a user.

Use this endpoint to register a public key that is controlled by a user on an external device. 

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.KeyApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    KeyApi apiInstance = new KeyApi(defaultClient);
    UUID userId = feb37e23-d04e-4e71-bf53-1f1a75ba3a68; // UUID | Identifier of the user.
    ExternalKeyPost externalKeyPost = new ExternalKeyPost(); // ExternalKeyPost | External key object to add.
    try {
      KeyGet result = apiInstance.createExternalKey(userId, externalKeyPost);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling KeyApi#createExternalKey");
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
 **externalKeyPost** | [**ExternalKeyPost**](ExternalKeyPost.md)| External key object to add. |

### Return type

[**KeyGet**](KeyGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**400** | Invalid input. |  -  |
**401** | Missing or invalid session cookie. |  -  |
**404** | User not found. |  -  |

<a name="createKey"></a>
# **createKey**
> KeyGet createKey(userId, keyPost)

Create a new key for a user.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.KeyApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    KeyApi apiInstance = new KeyApi(defaultClient);
    UUID userId = feb37e23-d04e-4e71-bf53-1f1a75ba3a68; // UUID | Identifier of the user.
    KeyPost keyPost = new KeyPost(); // KeyPost | Key object to add.
    try {
      KeyGet result = apiInstance.createKey(userId, keyPost);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling KeyApi#createKey");
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
 **keyPost** | [**KeyPost**](KeyPost.md)| Key object to add. |

### Return type

[**KeyGet**](KeyGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**400** | Invalid input. |  -  |
**401** | Missing or invalid session cookie. |  -  |
**404** | User not found. |  -  |

<a name="deleteKey"></a>
# **deleteKey**
> KeyGet deleteKey(keyId)

Delete a key.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.KeyApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    KeyApi apiInstance = new KeyApi(defaultClient);
    UUID keyId = 552aa3fd-3b5e-434f-bdd3-9b6c58c269c1; // UUID | Identifier of the key.
    try {
      KeyGet result = apiInstance.deleteKey(keyId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling KeyApi#deleteKey");
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
 **keyId** | [**UUID**](.md)| Identifier of the key. |

### Return type

[**KeyGet**](KeyGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**400** | Invalid key identifier. |  -  |
**401** | Missing or invalid session cookie. |  -  |
**404** | Key not found. |  -  |

<a name="getKeyById"></a>
# **getKeyById**
> KeyGet getKeyById(keyId)

Get a key by its identifier.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.KeyApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    KeyApi apiInstance = new KeyApi(defaultClient);
    UUID keyId = 552aa3fd-3b5e-434f-bdd3-9b6c58c269c1; // UUID | Identifier of the key.
    try {
      KeyGet result = apiInstance.getKeyById(keyId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling KeyApi#getKeyById");
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
 **keyId** | [**UUID**](.md)| Identifier of the key. |

### Return type

[**KeyGet**](KeyGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**400** | Invalid key identifier. |  -  |
**401** | Missing or invalid session cookie. |  -  |
**404** | Key not found. |  -  |

<a name="getUserKeys"></a>
# **getUserKeys**
> List&lt;KeyGet&gt; getUserKeys(userId)

Get all the keys of a user.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.KeyApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    KeyApi apiInstance = new KeyApi(defaultClient);
    UUID userId = feb37e23-d04e-4e71-bf53-1f1a75ba3a68; // UUID | Identifier of the user.
    try {
      List<KeyGet> result = apiInstance.getUserKeys(userId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling KeyApi#getUserKeys");
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

[**List&lt;KeyGet&gt;**](KeyGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

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

<a name="updateKey"></a>
# **updateKey**
> KeyGet updateKey(keyId, keyPut)

Update a key.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.KeyApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    KeyApi apiInstance = new KeyApi(defaultClient);
    UUID keyId = 552aa3fd-3b5e-434f-bdd3-9b6c58c269c1; // UUID | Identifier of the key.
    KeyPut keyPut = new KeyPut(); // KeyPut | Key object to update.
    try {
      KeyGet result = apiInstance.updateKey(keyId, keyPut);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling KeyApi#updateKey");
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
 **keyId** | [**UUID**](.md)| Identifier of the key. |
 **keyPut** | [**KeyPut**](KeyPut.md)| Key object to update. |

### Return type

[**KeyGet**](KeyGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**400** | Invalid key identifier. |  -  |
**401** | Missing or invalid session cookie. |  -  |
**404** | Key not found. |  -  |

