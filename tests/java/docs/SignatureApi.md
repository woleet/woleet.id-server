# SignatureApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getSignature**](SignatureApi.md#getSignature) | **GET** /sign | Sign some data using a user key.


<a name="getSignature"></a>
# **getSignature**
> SignatureResult getSignature(hashToSign, userId, customUserId, pubKey)

Sign some data using a user key.

Use this endpoint to sign some data using one of the keys of a given user. &lt;br&gt;Compute the SHA256 hash of the data to sign (client side) and provide it in the &#x60;hashToSign&#x60; parameter. &lt;br&gt;Specify the user using either the &#x60;userId&#x60;, &#x60;customUserId&#x60; or the &#x60;pubKey&#x60; parameter. &lt;br&gt;The signature produced is the signature of the hash using the referred key or using the user&#39;s default key. &lt;br&gt;This endpoint is protected using an API token. It is recommended not to expose it publicly. 

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiClient;
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.Configuration;
//import io.woleet.idserver.auth.*;
//import io.woleet.idserver.api.SignatureApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure HTTP basic authorization: APITokenAuth
HttpBasicAuth APITokenAuth = (HttpBasicAuth) defaultClient.getAuthentication("APITokenAuth");
APITokenAuth.setUsername("YOUR USERNAME");
APITokenAuth.setPassword("YOUR PASSWORD");

SignatureApi apiInstance = new SignatureApi();
String hashToSign = d8e734d7c02e5b889e3e15acd5aaf231a67e1d9974f17b2c907148c4f4a7f975; // String | The SHA256 hash that is to be signed (a string formatted like [a-f0-9]{64}).
UUID userId = 345a4513-0266-419a-8344-2daf645b78ed; // UUID | The user identifier.
String customUserId = wol.jim-smith.01; // String | The custom user identifier (`userId` field of the user's identity).
String pubKey = 1GChJMuyxvq28F3Uksqf5v7QkxQ4WLQdBh; // String | The public key to use to sign. When not provided, the default key of the user is used (if any).
try {
    SignatureResult result = apiInstance.getSignature(hashToSign, userId, customUserId, pubKey);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling SignatureApi#getSignature");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **hashToSign** | **String**| The SHA256 hash that is to be signed (a string formatted like [a-f0-9]{64}). |
 **userId** | [**UUID**](.md)| The user identifier. | [optional]
 **customUserId** | **String**| The custom user identifier (&#x60;userId&#x60; field of the user&#39;s identity). | [optional]
 **pubKey** | **String**| The public key to use to sign. When not provided, the default key of the user is used (if any). | [optional]

### Return type

[**SignatureResult**](SignatureResult.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

