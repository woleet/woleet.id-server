# UserApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createUser**](UserApi.md#createUser) | **POST** /user | Create a new user.
[**deleteUser**](UserApi.md#deleteUser) | **DELETE** /user/{userId} | Delete a user.
[**getAllUsers**](UserApi.md#getAllUsers) | **GET** /user/list | List all users.
[**getUserById**](UserApi.md#getUserById) | **GET** /user/{userId} | Get a user by his identifier.
[**updateUser**](UserApi.md#updateUser) | **PUT** /user/{userId} | Update a user.


<a name="createUser"></a>
# **createUser**
> UserGet createUser(userPost)

Create a new user.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.UserApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

UserApi apiInstance = new UserApi();
UserPost userPost = new UserPost(); // UserPost | User object to create.
try {
    UserGet result = apiInstance.createUser(userPost);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling UserApi#createUser");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userPost** | [**UserPost**](UserPost.md)| User object to create. |

### Return type

[**UserGet**](UserGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteUser"></a>
# **deleteUser**
> UserGet deleteUser(userId)

Delete a user.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.UserApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

UserApi apiInstance = new UserApi();
UUID userId = feb37e23-d04e-4e71-bf53-1f1a75ba3a68; // UUID | Identifier of the user.
try {
    UserGet result = apiInstance.deleteUser(userId);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling UserApi#deleteUser");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**UUID**](.md)| Identifier of the user. |

### Return type

[**UserGet**](UserGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getAllUsers"></a>
# **getAllUsers**
> List&lt;UserGet&gt; getAllUsers()

List all users.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.UserApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

UserApi apiInstance = new UserApi();
try {
    List<UserGet> result = apiInstance.getAllUsers();
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling UserApi#getAllUsers");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List&lt;UserGet&gt;**](UserGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUserById"></a>
# **getUserById**
> UserGet getUserById(userId)

Get a user by his identifier.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.UserApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

UserApi apiInstance = new UserApi();
UUID userId = feb37e23-d04e-4e71-bf53-1f1a75ba3a68; // UUID | Identifier of the user.
try {
    UserGet result = apiInstance.getUserById(userId);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling UserApi#getUserById");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**UUID**](.md)| Identifier of the user. |

### Return type

[**UserGet**](UserGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="updateUser"></a>
# **updateUser**
> UserGet updateUser(userId, userPut)

Update a user.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.UserApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

UserApi apiInstance = new UserApi();
UUID userId = feb37e23-d04e-4e71-bf53-1f1a75ba3a68; // UUID | Identifier of the user.
UserPut userPut = new UserPut(); // UserPut | User object to update.
try {
    UserGet result = apiInstance.updateUser(userId, userPut);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling UserApi#updateUser");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**UUID**](.md)| Identifier of the user. |
 **userPut** | [**UserPut**](UserPut.md)| User object to update. |

### Return type

[**UserGet**](UserGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

