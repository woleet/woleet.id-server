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
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.UserApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    UserApi apiInstance = new UserApi(defaultClient);
    UserPost userPost = new UserPost(); // UserPost | User object to create.
    try {
      UserGet result = apiInstance.createUser(userPost);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling UserApi#createUser");
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
 **userPost** | [**UserPost**](UserPost.md)| User object to create. |

### Return type

[**UserGet**](UserGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**401** | Missing or invalid session cookie. |  -  |
**400** | Invalid object supplied. |  -  |

<a name="deleteUser"></a>
# **deleteUser**
> UserGet deleteUser(userId)

Delete a user.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.UserApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    UserApi apiInstance = new UserApi(defaultClient);
    UUID userId = feb37e23-d04e-4e71-bf53-1f1a75ba3a68; // UUID | Identifier of the user.
    try {
      UserGet result = apiInstance.deleteUser(userId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling UserApi#deleteUser");
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

[**UserGet**](UserGet.md)

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

<a name="getAllUsers"></a>
# **getAllUsers**
> List&lt;UserGet&gt; getAllUsers(mode, role, commonName, organization, organizationalUnit, locality, country, userId, email, status, countryCallingCode, phone)

List all users.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.UserApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    UserApi apiInstance = new UserApi(defaultClient);
    String mode = seal; // String | Filter the user mode.
    String role = user; // String | Filter the user role.
    String commonName = John Doe; // String | Filter the user X500 common name.
    String organization = Woleet; // String | Filter the user X500 organization.
    String organizationalUnit = Sales; // String | Filter the user X500 organizational unit.
    String locality = Rennes; // String | Filter the user X500 locality.
    String country = FR; // String | Filter the user X500 country.
    String userId = wol.jim-smith.01; // String | Filter the user X500 organization.
    String email = john.doe@acme.com; // String | Filter the user email.
    String status = active; // String | Filter the user status.
    String countryCallingCode = 33; // String | Filter the user country calling code.
    String phone = 123456789; // String | Filter the user phone.
    try {
      List<UserGet> result = apiInstance.getAllUsers(mode, role, commonName, organization, organizationalUnit, locality, country, userId, email, status, countryCallingCode, phone);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling UserApi#getAllUsers");
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
 **mode** | **String**| Filter the user mode. | [optional] [enum: seal, esign]
 **role** | **String**| Filter the user role. | [optional] [enum: user, manager, admin]
 **commonName** | **String**| Filter the user X500 common name. | [optional]
 **organization** | **String**| Filter the user X500 organization. | [optional]
 **organizationalUnit** | **String**| Filter the user X500 organizational unit. | [optional]
 **locality** | **String**| Filter the user X500 locality. | [optional]
 **country** | **String**| Filter the user X500 country. | [optional]
 **userId** | **String**| Filter the user X500 organization. | [optional]
 **email** | **String**| Filter the user email. | [optional]
 **status** | **String**| Filter the user status. | [optional] [enum: active, blocked]
 **countryCallingCode** | **String**| Filter the user country calling code. | [optional]
 **phone** | **String**| Filter the user phone. | [optional]

### Return type

[**List&lt;UserGet&gt;**](UserGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Array of users. |  -  |

<a name="getUserById"></a>
# **getUserById**
> UserGet getUserById(userId)

Get a user by his identifier.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.UserApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    UserApi apiInstance = new UserApi(defaultClient);
    UUID userId = feb37e23-d04e-4e71-bf53-1f1a75ba3a68; // UUID | Identifier of the user.
    try {
      UserGet result = apiInstance.getUserById(userId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling UserApi#getUserById");
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

[**UserGet**](UserGet.md)

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

<a name="updateUser"></a>
# **updateUser**
> UserGet updateUser(userId, userPut)

Update a user.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.UserApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure API key authorization: CookieAuth
    ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
    CookieAuth.setApiKey("YOUR API KEY");
    // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
    //CookieAuth.setApiKeyPrefix("Token");

    UserApi apiInstance = new UserApi(defaultClient);
    UUID userId = feb37e23-d04e-4e71-bf53-1f1a75ba3a68; // UUID | Identifier of the user.
    UserPut userPut = new UserPut(); // UserPut | User object to update.
    try {
      UserGet result = apiInstance.updateUser(userId, userPut);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling UserApi#updateUser");
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
 **userPut** | [**UserPut**](UserPut.md)| User object to update. |

### Return type

[**UserGet**](UserGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**400** | Invalid object supplied / Invalid user identifier. |  -  |
**401** | Missing or invalid session cookie. |  -  |
**404** | User not found. |  -  |

