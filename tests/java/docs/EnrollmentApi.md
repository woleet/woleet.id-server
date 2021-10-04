# EnrollmentApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createEnrollment**](EnrollmentApi.md#createEnrollment) | **POST** /enrollment | Create a key enrollment request.
[**createSignatureRequest**](EnrollmentApi.md#createSignatureRequest) | **POST** /enrollment/{EnrollmentId}/create-signature-request | Create and send the signature request of the TCU to the owner of the enrolled key.
[**deleteEnrollment**](EnrollmentApi.md#deleteEnrollment) | **DELETE** /enrollment/{EnrollmentId} | Delete a key enrollment request.
[**getEnrollment**](EnrollmentApi.md#getEnrollment) | **GET** /enrollment/{EnrollmentId} | Get a key enrollment request.
[**getEnrollmentUser**](EnrollmentApi.md#getEnrollmentUser) | **GET** /enrollment/{EnrollmentId}/user | Get the user of a key enrollment request.
[**getEnrollments**](EnrollmentApi.md#getEnrollments) | **GET** /enrollment/list | Get all key enrollment requests.
[**updateEnrollment**](EnrollmentApi.md#updateEnrollment) | **PUT** /enrollment/{EnrollmentId} | Update a key enrollment request.


<a name="createEnrollment"></a>
# **createEnrollment**
> EnrollmentGet createEnrollment(enrollmentPost)

Create a key enrollment request.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.EnrollmentApi;

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

    EnrollmentApi apiInstance = new EnrollmentApi(defaultClient);
    EnrollmentPost enrollmentPost = new EnrollmentPost(); // EnrollmentPost | Enrollment object to add.
    try {
      EnrollmentGet result = apiInstance.createEnrollment(enrollmentPost);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling EnrollmentApi#createEnrollment");
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
 **enrollmentPost** | [**EnrollmentPost**](EnrollmentPost.md)| Enrollment object to add. |

### Return type

[**EnrollmentGet**](EnrollmentGet.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**400** | Invalid object supplied. |  -  |
**401** | Missing or invalid session cookie. |  -  |

<a name="createSignatureRequest"></a>
# **createSignatureRequest**
> createSignatureRequest(enrollmentId)

Create and send the signature request of the TCU to the owner of the enrolled key.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.EnrollmentApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    EnrollmentApi apiInstance = new EnrollmentApi(defaultClient);
    UUID enrollmentId = 813797c8-01e3-4a80-8068-bc2bda13df16; // UUID | Identifier of the enrollment.
    try {
      apiInstance.createSignatureRequest(enrollmentId);
    } catch (ApiException e) {
      System.err.println("Exception when calling EnrollmentApi#createSignatureRequest");
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
 **enrollmentId** | [**UUID**](.md)| Identifier of the enrollment. |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**400** | Invalid object supplied / The signature request creation is not possible. |  -  |

<a name="deleteEnrollment"></a>
# **deleteEnrollment**
> EnrollmentGet deleteEnrollment(enrollmentId)

Delete a key enrollment request.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.EnrollmentApi;

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

    EnrollmentApi apiInstance = new EnrollmentApi(defaultClient);
    UUID enrollmentId = 813797c8-01e3-4a80-8068-bc2bda13df16; // UUID | Identifier of the enrollment.
    try {
      EnrollmentGet result = apiInstance.deleteEnrollment(enrollmentId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling EnrollmentApi#deleteEnrollment");
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
 **enrollmentId** | [**UUID**](.md)| Identifier of the enrollment. |

### Return type

[**EnrollmentGet**](EnrollmentGet.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**400** | Invalid object supplied. |  -  |
**401** | Missing or invalid session cookie. |  -  |

<a name="getEnrollment"></a>
# **getEnrollment**
> EnrollmentGet getEnrollment(enrollmentId)

Get a key enrollment request.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.EnrollmentApi;

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

    EnrollmentApi apiInstance = new EnrollmentApi(defaultClient);
    UUID enrollmentId = 813797c8-01e3-4a80-8068-bc2bda13df16; // UUID | Identifier of the enrollment.
    try {
      EnrollmentGet result = apiInstance.getEnrollment(enrollmentId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling EnrollmentApi#getEnrollment");
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
 **enrollmentId** | [**UUID**](.md)| Identifier of the enrollment. |

### Return type

[**EnrollmentGet**](EnrollmentGet.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |

<a name="getEnrollmentUser"></a>
# **getEnrollmentUser**
> UserGet getEnrollmentUser(enrollmentId)

Get the user of a key enrollment request.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.EnrollmentApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    EnrollmentApi apiInstance = new EnrollmentApi(defaultClient);
    UUID enrollmentId = 813797c8-01e3-4a80-8068-bc2bda13df16; // UUID | Identifier of the enrollment.
    try {
      UserGet result = apiInstance.getEnrollmentUser(enrollmentId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling EnrollmentApi#getEnrollmentUser");
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
 **enrollmentId** | [**UUID**](.md)| Identifier of the enrollment. |

### Return type

[**UserGet**](UserGet.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |

<a name="getEnrollments"></a>
# **getEnrollments**
> List&lt;EnrollmentGet&gt; getEnrollments()

Get all key enrollment requests.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.EnrollmentApi;

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

    EnrollmentApi apiInstance = new EnrollmentApi(defaultClient);
    try {
      List<EnrollmentGet> result = apiInstance.getEnrollments();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling EnrollmentApi#getEnrollments");
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

[**List&lt;EnrollmentGet&gt;**](EnrollmentGet.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |

<a name="updateEnrollment"></a>
# **updateEnrollment**
> EnrollmentGet updateEnrollment(enrollmentId, enrollmentPut)

Update a key enrollment request.

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.EnrollmentApi;

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

    EnrollmentApi apiInstance = new EnrollmentApi(defaultClient);
    UUID enrollmentId = 813797c8-01e3-4a80-8068-bc2bda13df16; // UUID | Identifier of the enrollment.
    EnrollmentPut enrollmentPut = new EnrollmentPut(); // EnrollmentPut | Enrollment object to update.
    try {
      EnrollmentGet result = apiInstance.updateEnrollment(enrollmentId, enrollmentPut);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling EnrollmentApi#updateEnrollment");
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
 **enrollmentId** | [**UUID**](.md)| Identifier of the enrollment. |
 **enrollmentPut** | [**EnrollmentPut**](EnrollmentPut.md)| Enrollment object to update. |

### Return type

[**EnrollmentGet**](EnrollmentGet.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. |  -  |
**400** | Invalid object supplied. |  -  |
**401** | Missing or invalid session cookie. |  -  |

