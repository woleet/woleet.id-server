# EnrollmentApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createEnrollment**](EnrollmentApi.md#createEnrollment) | **POST** /enrollment | Create an enrollment request.
[**deleteEnrollment**](EnrollmentApi.md#deleteEnrollment) | **DELETE** /enrollment/{EnrollmentId} | Delete an enrollment request.
[**getAllEnrollment**](EnrollmentApi.md#getAllEnrollment) | **GET** /enrollment/list | Get all enrollment requests.
[**getEnrollment**](EnrollmentApi.md#getEnrollment) | **GET** /enrollment/{EnrollmentId} | Get an enrollment request.
[**getEnrollmentUser**](EnrollmentApi.md#getEnrollmentUser) | **GET** /enrollment/{EnrollmentId}/user | Get an enrollment request user.
[**postSignatureRequest**](EnrollmentApi.md#postSignatureRequest) | **POST** /enrollment/{EnrollmentId}/create-signature-request | Get an enrollment request.
[**updateEnrollment**](EnrollmentApi.md#updateEnrollment) | **PUT** /enrollment/{EnrollmentId} | Update an enrollment request.


<a name="createEnrollment"></a>
# **createEnrollment**
> EnrollmentGet createEnrollment(enrollmentPost)

Create an enrollment request.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.EnrollmentApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

EnrollmentApi apiInstance = new EnrollmentApi();
EnrollmentPost enrollmentPost = new EnrollmentPost(); // EnrollmentPost | Enrollment object to add.
try {
    EnrollmentGet result = apiInstance.createEnrollment(enrollmentPost);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling EnrollmentApi#createEnrollment");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **enrollmentPost** | [**EnrollmentPost**](EnrollmentPost.md)| Enrollment object to add. |

### Return type

[**EnrollmentGet**](EnrollmentGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteEnrollment"></a>
# **deleteEnrollment**
> EnrollmentGet deleteEnrollment(enrollmentId)

Delete an enrollment request.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.EnrollmentApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

EnrollmentApi apiInstance = new EnrollmentApi();
UUID enrollmentId = 813797c8-01e3-4a80-8068-bc2bda13df16; // UUID | Identifier of the enrollment.
try {
    EnrollmentGet result = apiInstance.deleteEnrollment(enrollmentId);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling EnrollmentApi#deleteEnrollment");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **enrollmentId** | [**UUID**](.md)| Identifier of the enrollment. |

### Return type

[**EnrollmentGet**](EnrollmentGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getAllEnrollment"></a>
# **getAllEnrollment**
> List&lt;EnrollmentGet&gt; getAllEnrollment()

Get all enrollment requests.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.EnrollmentApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

EnrollmentApi apiInstance = new EnrollmentApi();
try {
    List<EnrollmentGet> result = apiInstance.getAllEnrollment();
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling EnrollmentApi#getAllEnrollment");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List&lt;EnrollmentGet&gt;**](EnrollmentGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getEnrollment"></a>
# **getEnrollment**
> EnrollmentGet getEnrollment(enrollmentId)

Get an enrollment request.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.EnrollmentApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

EnrollmentApi apiInstance = new EnrollmentApi();
UUID enrollmentId = 813797c8-01e3-4a80-8068-bc2bda13df16; // UUID | Identifier of the enrollment.
try {
    EnrollmentGet result = apiInstance.getEnrollment(enrollmentId);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling EnrollmentApi#getEnrollment");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **enrollmentId** | [**UUID**](.md)| Identifier of the enrollment. |

### Return type

[**EnrollmentGet**](EnrollmentGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getEnrollmentUser"></a>
# **getEnrollmentUser**
> UserGet getEnrollmentUser(enrollmentId)

Get an enrollment request user.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.EnrollmentApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

EnrollmentApi apiInstance = new EnrollmentApi();
UUID enrollmentId = 813797c8-01e3-4a80-8068-bc2bda13df16; // UUID | Identifier of the enrollment.
try {
    UserGet result = apiInstance.getEnrollmentUser(enrollmentId);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling EnrollmentApi#getEnrollmentUser");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **enrollmentId** | [**UUID**](.md)| Identifier of the enrollment. |

### Return type

[**UserGet**](UserGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="postSignatureRequest"></a>
# **postSignatureRequest**
> String postSignatureRequest(enrollmentId)

Get an enrollment request.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.EnrollmentApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

EnrollmentApi apiInstance = new EnrollmentApi();
UUID enrollmentId = 813797c8-01e3-4a80-8068-bc2bda13df16; // UUID | Identifier of the enrollment.
try {
    String result = apiInstance.postSignatureRequest(enrollmentId);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling EnrollmentApi#postSignatureRequest");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **enrollmentId** | [**UUID**](.md)| Identifier of the enrollment. |

### Return type

**String**

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="updateEnrollment"></a>
# **updateEnrollment**
> EnrollmentGet updateEnrollment(enrollmentId, enrollmentPut)

Update an enrollment request.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.EnrollmentApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

EnrollmentApi apiInstance = new EnrollmentApi();
UUID enrollmentId = 813797c8-01e3-4a80-8068-bc2bda13df16; // UUID | Identifier of the enrollment.
EnrollmentPut enrollmentPut = new EnrollmentPut(); // EnrollmentPut | Enrollment object to update.
try {
    EnrollmentGet result = apiInstance.updateEnrollment(enrollmentId, enrollmentPut);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling EnrollmentApi#updateEnrollment");
    e.printStackTrace();
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

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

