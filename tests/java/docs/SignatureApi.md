# SignatureApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getSignature**](SignatureApi.md#getSignature) | **GET** /sign | Sign some data using a key.


<a name="getSignature"></a>
# **getSignature**
> SignatureResult getSignature(hashToSign, userId, customUserId, pubKey)

Sign some data using a key.

Use this endpoint to sign a SHA256 hash using one of the keys managed by the server. &lt;br&gt;Provide the SHA256 hash to sign in the &#x60;hashToSign&#x60; parameter. &lt;br&gt;When authenticated using an API token, the key to use can be specified using the &#x60;pubKey&#x60;, &#x60;userId&#x60; and/or &#x60;customUserId&#x60; parameters: &lt;br&gt;- set the &#x60;pubKey&#x60; parameter only: the referred key is used &lt;br&gt;- set the &#x60;userId&#x60; (or the &#x60;customUserId&#x60;) parameter only: the default key of the referred user is used (if any). &lt;br&gt;- set none of the 3 parameters: the default key of the server is used (if any). &lt;br&gt;When authenticated using an OAuth token, the key to use must be one of the authenticated user&#39;s keys and can be specified using the &#x60;pubKey&#x60; parameter. If not specified, the authenticated user&#39;s default key is used (if any). 

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

// Configure HTTP basic authorization: OAuthTokenAuth
HttpBasicAuth OAuthTokenAuth = (HttpBasicAuth) defaultClient.getAuthentication("OAuthTokenAuth");
OAuthTokenAuth.setUsername("YOUR USERNAME");
OAuthTokenAuth.setPassword("YOUR PASSWORD");

SignatureApi apiInstance = new SignatureApi();
String hashToSign = d8e734d7c02e5b889e3e15acd5aaf231a67e1d9974f17b2c907148c4f4a7f975; // String | SHA256 hash to be signed (a string formatted like [a-f0-9]{64}).
UUID userId = 345a4513-0266-419a-8344-2daf645b78ed; // UUID | User identifier.
String customUserId = wol.jim-smith.01; // String | Custom user identifier (ie. `userId` field of the user's identity).
String pubKey = 1GChJMuyxvq28F3Uksqf5v7QkxQ4WLQdBh; // String | The public key to use to sign. <br>When not provided and a user is provided, the default key of the user is used (if any). <br>When not provided and no user is provided, the default key of the server is used (if any). 
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
 **hashToSign** | **String**| SHA256 hash to be signed (a string formatted like [a-f0-9]{64}). |
 **userId** | [**UUID**](.md)| User identifier. | [optional]
 **customUserId** | **String**| Custom user identifier (ie. &#x60;userId&#x60; field of the user&#39;s identity). | [optional]
 **pubKey** | **String**| The public key to use to sign. &lt;br&gt;When not provided and a user is provided, the default key of the user is used (if any). &lt;br&gt;When not provided and no user is provided, the default key of the server is used (if any).  | [optional]

### Return type

[**SignatureResult**](SignatureResult.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [OAuthTokenAuth](../README.md#OAuthTokenAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

