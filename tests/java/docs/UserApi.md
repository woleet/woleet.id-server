# UserApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createUser**](UserApi.md#createUser) | **POST** /user | Create a new user.
[**deleteUser**](UserApi.md#deleteUser) | **DELETE** /user/{userId} | Delete a user.
[**getUserById**](UserApi.md#getUserById) | **GET** /user/{userId} | Get a user by his identifier.
[**getUsers**](UserApi.md#getUsers) | **GET** /user/list | Get all the users matching a set of filters.
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
    
    // Configure HTTP bearer authorization: APITokenAuth
    HttpBearerAuth APITokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("APITokenAuth");
    APITokenAuth.setBearerToken("BEARER TOKEN");

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

[APITokenAuth](../README.md#APITokenAuth), [CookieAuth](../README.md#CookieAuth)

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
    
    // Configure HTTP bearer authorization: APITokenAuth
    HttpBearerAuth APITokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("APITokenAuth");
    APITokenAuth.setBearerToken("BEARER TOKEN");

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

[APITokenAuth](../README.md#APITokenAuth), [CookieAuth](../README.md#CookieAuth)

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
    
    // Configure HTTP bearer authorization: APITokenAuth
    HttpBearerAuth APITokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("APITokenAuth");
    APITokenAuth.setBearerToken("BEARER TOKEN");

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

[APITokenAuth](../README.md#APITokenAuth), [CookieAuth](../README.md#CookieAuth)

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

<a name="getUsers"></a>
# **getUsers**
> List&lt;UserGet&gt; getUsers(offset, limit, search, mode, role, email, username, commonName, organization, organizationalUnit, locality, country, userId, countryCallingCode, phone, status)

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
import io.woleet.idserver.api.UserApi;

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

    UserApi apiInstance = new UserApi(defaultClient);
    Integer offset = 20; // Integer | Offset of the returned results (0 to get all results from the beginning).
    Integer limit = 20; // Integer | Maximum number of returned results.
    String search = John Doe; // String | Filter the users using a search string.<br> Only users whose `email`, `username`, `identity.commonName`, `identity.organization` or `identity.organizationalUnit` contains the search string match. 
    String mode = seal; // String | Filter the users by their mode (exact match).
    String role = user; // String | Filter the users by their role (exact match).
    String email = john.doe@acme.com; // String | Filter the users by their email (exact match).
    String username = johndoe; // String | Filter the users by their username (exact match).
    String commonName = John Doe; // String | Filter the users by their X500 common name (exact match).
    String organization = Acme corp; // String | Filter the users by their X500 organization (exact match).
    String organizationalUnit = Sales dept; // String | Filter the users by their X500 organizational unit (exact match).
    String locality = Rennes; // String | Filter the users by their X500 locality (exact match).
    String country = FR; // String | Filter the users by their X500 country (exact match).
    String userId = wol.jim-smith.01; // String | Filter the users by their X500 custom user identifier (exact match).
    String countryCallingCode = 33; // String | Filter the users by their country calling code (exact match).
    String phone = 123456789; // String | Filter the users by their phone (exact match).
    String status = active; // String | Filter the users by their status (exact match).
    try {
      List<UserGet> result = apiInstance.getUsers(offset, limit, search, mode, role, email, username, commonName, organization, organizationalUnit, locality, country, userId, countryCallingCode, phone, status);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling UserApi#getUsers");
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
 **mode** | **String**| Filter the users by their mode (exact match). | [optional] [enum: seal, esign]
 **role** | **String**| Filter the users by their role (exact match). | [optional] [enum: user, manager, admin]
 **email** | **String**| Filter the users by their email (exact match). | [optional]
 **username** | **String**| Filter the users by their username (exact match). | [optional]
 **commonName** | **String**| Filter the users by their X500 common name (exact match). | [optional]
 **organization** | **String**| Filter the users by their X500 organization (exact match). | [optional]
 **organizationalUnit** | **String**| Filter the users by their X500 organizational unit (exact match). | [optional]
 **locality** | **String**| Filter the users by their X500 locality (exact match). | [optional]
 **country** | **String**| Filter the users by their X500 country (exact match). | [optional]
 **userId** | **String**| Filter the users by their X500 custom user identifier (exact match). | [optional]
 **countryCallingCode** | **String**| Filter the users by their country calling code (exact match). | [optional]
 **phone** | **String**| Filter the users by their phone (exact match). | [optional]
 **status** | **String**| Filter the users by their status (exact match). | [optional] [enum: active, blocked]

### Return type

[**List&lt;UserGet&gt;**](UserGet.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Array of users. |  -  |

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
    
    // Configure HTTP bearer authorization: APITokenAuth
    HttpBearerAuth APITokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("APITokenAuth");
    APITokenAuth.setBearerToken("BEARER TOKEN");

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

[APITokenAuth](../README.md#APITokenAuth), [CookieAuth](../README.md#CookieAuth)

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

