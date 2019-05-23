# ExternalKeyApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createExternalKey**](ExternalKeyApi.md#createExternalKey) | **POST** /external-key/create/{userId} | Create a new external key for a user.


<a name="createExternalKey"></a>
# **createExternalKey**
> KeyGet createExternalKey(userId, externalKeyPost)

Create a new external key for a user.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.ExternalKeyApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: CookieAuth
ApiKeyAuth CookieAuth = (ApiKeyAuth) defaultClient.getAuthentication("CookieAuth");
CookieAuth.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CookieAuth.setApiKeyPrefix("Token");

ExternalKeyApi apiInstance = new ExternalKeyApi();
UUID userId = feb37e23-d04e-4e71-bf53-1f1a75ba3a68; // UUID | Identifier of the user.
ExternalKeyPost externalKeyPost = new ExternalKeyPost(); // ExternalKeyPost | External Key object to add.
try {
    KeyGet result = apiInstance.createExternalKey(userId, externalKeyPost);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling ExternalKeyApi#createExternalKey");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**UUID**](.md)| Identifier of the user. |
 **externalKeyPost** | [**ExternalKeyPost**](ExternalKeyPost.md)| External Key object to add. |

### Return type

[**KeyGet**](KeyGet.md)

### Authorization

[CookieAuth](../README.md#CookieAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

