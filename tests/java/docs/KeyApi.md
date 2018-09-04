# KeyApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createKey**](KeyApi.md#createKey) | **POST** /user/{userId}/key | Create a new key for a user.
[**deleteKey**](KeyApi.md#deleteKey) | **DELETE** /key/{keyId} | Deletes a key
[**exportKey**](KeyApi.md#exportKey) | **GET** /key/{keyId}/export | Get the mnemonic words associated to a key.
[**getAllUserKeys**](KeyApi.md#getAllUserKeys) | **GET** /user/{userId}/key/list | List all keys of a user.
[**getKeyById**](KeyApi.md#getKeyById) | **GET** /key/{keyId} | Get a key by its identifier.
[**updateKey**](KeyApi.md#updateKey) | **PUT** /key/{keyId} | Update an existing key.


<a name="createKey"></a>
# **createKey**
> Key createKey(userId, keyPost)

Create a new key for a user.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.KeyApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure HTTP basic authorization: BearerAuth
HttpBasicAuth BearerAuth = (HttpBasicAuth) defaultClient.getAuthentication("BearerAuth");
BearerAuth.setUsername("YOUR USERNAME");
BearerAuth.setPassword("YOUR PASSWORD");

KeyApi apiInstance = new KeyApi();
UUID userId = feb37e23-d04e-4e71-bf53-1f1a75ba3a68; // UUID | Identifier of the user.
KeyPost keyPost = new KeyPost(); // KeyPost | Key object to add.
try {
    Key result = apiInstance.createKey(userId, keyPost);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling KeyApi#createKey");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**UUID**](.md)| Identifier of the user. |
 **keyPost** | [**KeyPost**](KeyPost.md)| Key object to add. |

### Return type

[**Key**](Key.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteKey"></a>
# **deleteKey**
> Key deleteKey(keyId)

Deletes a key

This can only be done by an admin.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.KeyApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure HTTP basic authorization: BearerAuth
HttpBasicAuth BearerAuth = (HttpBasicAuth) defaultClient.getAuthentication("BearerAuth");
BearerAuth.setUsername("YOUR USERNAME");
BearerAuth.setPassword("YOUR PASSWORD");

KeyApi apiInstance = new KeyApi();
UUID keyId = 552aa3fd-3b5e-434f-bdd3-9b6c58c269c1; // UUID | Identifier of the key.
try {
    Key result = apiInstance.deleteKey(keyId);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling KeyApi#deleteKey");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | [**UUID**](.md)| Identifier of the key. |

### Return type

[**Key**](Key.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="exportKey"></a>
# **exportKey**
> Mnemonics exportKey(keyId)

Get the mnemonic words associated to a key.

Returns a list of mnemonic words used to recover or import a key.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.KeyApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure HTTP basic authorization: BearerAuth
HttpBasicAuth BearerAuth = (HttpBasicAuth) defaultClient.getAuthentication("BearerAuth");
BearerAuth.setUsername("YOUR USERNAME");
BearerAuth.setPassword("YOUR PASSWORD");

KeyApi apiInstance = new KeyApi();
UUID keyId = 552aa3fd-3b5e-434f-bdd3-9b6c58c269c1; // UUID | Identifier of the key.
try {
    Mnemonics result = apiInstance.exportKey(keyId);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling KeyApi#exportKey");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | [**UUID**](.md)| Identifier of the key. |

### Return type

[**Mnemonics**](Mnemonics.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getAllUserKeys"></a>
# **getAllUserKeys**
> KeyArray getAllUserKeys(userId, full)

List all keys of a user.

Returns a key.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.KeyApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure HTTP basic authorization: BearerAuth
HttpBasicAuth BearerAuth = (HttpBasicAuth) defaultClient.getAuthentication("BearerAuth");
BearerAuth.setUsername("YOUR USERNAME");
BearerAuth.setPassword("YOUR PASSWORD");

KeyApi apiInstance = new KeyApi();
UUID userId = feb37e23-d04e-4e71-bf53-1f1a75ba3a68; // UUID | Identifier of the user.
Boolean full = true; // Boolean | Include deleted elements in the returned list.
try {
    KeyArray result = apiInstance.getAllUserKeys(userId, full);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling KeyApi#getAllUserKeys");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**UUID**](.md)| Identifier of the user. |
 **full** | **Boolean**| Include deleted elements in the returned list. | [optional]

### Return type

[**KeyArray**](KeyArray.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getKeyById"></a>
# **getKeyById**
> Key getKeyById(keyId)

Get a key by its identifier.

Returns a key.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.KeyApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure HTTP basic authorization: BearerAuth
HttpBasicAuth BearerAuth = (HttpBasicAuth) defaultClient.getAuthentication("BearerAuth");
BearerAuth.setUsername("YOUR USERNAME");
BearerAuth.setPassword("YOUR PASSWORD");

KeyApi apiInstance = new KeyApi();
UUID keyId = 552aa3fd-3b5e-434f-bdd3-9b6c58c269c1; // UUID | Identifier of the key.
try {
    Key result = apiInstance.getKeyById(keyId);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling KeyApi#getKeyById");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | [**UUID**](.md)| Identifier of the key. |

### Return type

[**Key**](Key.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="updateKey"></a>
# **updateKey**
> Key updateKey(keyId, keyPut)

Update an existing key.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.KeyApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure HTTP basic authorization: BearerAuth
HttpBasicAuth BearerAuth = (HttpBasicAuth) defaultClient.getAuthentication("BearerAuth");
BearerAuth.setUsername("YOUR USERNAME");
BearerAuth.setPassword("YOUR PASSWORD");

KeyApi apiInstance = new KeyApi();
UUID keyId = 552aa3fd-3b5e-434f-bdd3-9b6c58c269c1; // UUID | Identifier of the key.
KeyPut keyPut = new KeyPut(); // KeyPut | Replacement key object.
try {
    Key result = apiInstance.updateKey(keyId, keyPut);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling KeyApi#updateKey");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | [**UUID**](.md)| Identifier of the key. |
 **keyPut** | [**KeyPut**](KeyPut.md)| Replacement key object. |

### Return type

[**Key**](Key.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

