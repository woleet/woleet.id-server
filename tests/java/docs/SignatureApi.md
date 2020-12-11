# SignatureApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getSignature**](SignatureApi.md#getSignature) | **GET** /sign | Sign a message or a SHA256 hash using a key.


<a name="getSignature"></a>
# **getSignature**
> SignatureResult getSignature(hashToSign, messageToSign, userId, customUserId, pubKey, path, identityToSign)

Sign a message or a SHA256 hash using a key.

Use this endpoint to sign a message or a SHA256 hash using one of the keys managed by the server.&lt;br&gt; **NOTE: this endpoint is by default exposed on the port 3002, and not on port 3000 like for other API endpoints. It is not recommended to expose this endpoint publicly on the internet.**&lt;br&gt; Provide the message to sign in the &#x60;messageToSign&#x60; parameter, or the SHA256 hash to sign in the &#x60;hashToSign&#x60; parameter.&lt;br&gt; When authenticated using an API token, the key to use can be specified using the &#x60;pubKey&#x60;, &#x60;userId&#x60; and/or &#x60;customUserId&#x60; parameters:&lt;br&gt; - set the &#x60;pubKey&#x60; parameter only: the referred key is used&lt;br&gt; - set the &#x60;userId&#x60; (or the &#x60;customUserId&#x60;) parameter only: the default key of the referred user is used (if any).&lt;br&gt; - set none of the 3 parameters: the default key of the server is used (if any).&lt;br&gt; When authenticated using an OAuth token, the key to use must be one of the authenticated user&#39;s keys and can be specified using the &#x60;pubKey&#x60; parameter. If not specified, the authenticated user&#39;s default key is used (if any). 

### Example
```java
// Import classes:
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Configuration;
import io.woleet.idserver.auth.*;
import io.woleet.idserver.models.*;
import io.woleet.idserver.api.SignatureApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");
    
    // Configure HTTP bearer authorization: APITokenAuth
    HttpBearerAuth APITokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("APITokenAuth");
    APITokenAuth.setBearerToken("BEARER TOKEN");

    // Configure HTTP bearer authorization: OAuthTokenAuth
    HttpBearerAuth OAuthTokenAuth = (HttpBearerAuth) defaultClient.getAuthentication("OAuthTokenAuth");
    OAuthTokenAuth.setBearerToken("BEARER TOKEN");

    SignatureApi apiInstance = new SignatureApi(defaultClient);
    String hashToSign = d8e734d7c02e5b889e3e15acd5aaf231a67e1d9974f17b2c907148c4f4a7f975; // String | SHA256 hash to be signed (a string formatted like [a-f0-9]{64}).
    String messageToSign = This is the message to be signed; // String | Message to be signed.
    UUID userId = 345a4513-0266-419a-8344-2daf645b78ed; // UUID | User identifier.
    String customUserId = wol.jim-smith.01; // String | Custom user identifier (ie. `userId` field of the user identity).
    String pubKey = 1GChJMuyxvq28F3Uksqf5v7QkxQ4WLQdBh; // String | The public key to use to sign.<br> When not provided and a user is provided, the default key of the user is used (if any).<br> When not provided and no user is provided, the default key of the server is used (if any). 
    String path = m/'44/'0/'1; // String | The derivation path of the key to use to sign.<br> When not provided, the default derivation path \"m/44'/0'/0'\" is used. 
    String identityToSign = CN,EMAILADDRESS,O,OU,L,C; // String | Identity to sign: when set, the identity of the signer and the domain of the identity issuer are included to the signed data.<br> The identity of the signer is the X500 Distinguished Name built by the server from the identity associated to the key.<br> The domain of the identity issuer is extracted from the server's identity URL.<br> Both are included to the signed data: the signature produced in this case is the signature of SHA256(hash or message to sign + identity of the signer + domain of the identity issuer).<br> The identity of the signer and the domain of the identity issuer are returned respectively in the `signedIdentity` and the `signedIssuerDomain` fields of the signature result.<br> You must specify the fields you want to include in the identity of the signer by providing a string containing the list of the X500 fields to include, separated with ',':<br>   CN: Common name<br>   EMAILADDRESS: Email address<br>   O: Organization<br>   OU: Organizational unit<br>   L: Locality<br>   C: Country<br> If you want to include all fields, you can also provide ALL. 
    try {
      SignatureResult result = apiInstance.getSignature(hashToSign, messageToSign, userId, customUserId, pubKey, path, identityToSign);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling SignatureApi#getSignature");
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
 **hashToSign** | **String**| SHA256 hash to be signed (a string formatted like [a-f0-9]{64}). | [optional]
 **messageToSign** | **String**| Message to be signed. | [optional]
 **userId** | [**UUID**](.md)| User identifier. | [optional]
 **customUserId** | **String**| Custom user identifier (ie. &#x60;userId&#x60; field of the user identity). | [optional]
 **pubKey** | **String**| The public key to use to sign.&lt;br&gt; When not provided and a user is provided, the default key of the user is used (if any).&lt;br&gt; When not provided and no user is provided, the default key of the server is used (if any).  | [optional]
 **path** | **String**| The derivation path of the key to use to sign.&lt;br&gt; When not provided, the default derivation path \&quot;m/44&#39;/0&#39;/0&#39;\&quot; is used.  | [optional]
 **identityToSign** | **String**| Identity to sign: when set, the identity of the signer and the domain of the identity issuer are included to the signed data.&lt;br&gt; The identity of the signer is the X500 Distinguished Name built by the server from the identity associated to the key.&lt;br&gt; The domain of the identity issuer is extracted from the server&#39;s identity URL.&lt;br&gt; Both are included to the signed data: the signature produced in this case is the signature of SHA256(hash or message to sign + identity of the signer + domain of the identity issuer).&lt;br&gt; The identity of the signer and the domain of the identity issuer are returned respectively in the &#x60;signedIdentity&#x60; and the &#x60;signedIssuerDomain&#x60; fields of the signature result.&lt;br&gt; You must specify the fields you want to include in the identity of the signer by providing a string containing the list of the X500 fields to include, separated with &#39;,&#39;:&lt;br&gt;   CN: Common name&lt;br&gt;   EMAILADDRESS: Email address&lt;br&gt;   O: Organization&lt;br&gt;   OU: Organizational unit&lt;br&gt;   L: Locality&lt;br&gt;   C: Country&lt;br&gt; If you want to include all fields, you can also provide ALL.  | [optional]

### Return type

[**SignatureResult**](SignatureResult.md)

### Authorization

[APITokenAuth](../README.md#APITokenAuth), [OAuthTokenAuth](../README.md#OAuthTokenAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful operation. The produced signature and its associated parameters are returned as a JSON object&lt;br&gt; Note that if your are using the Woleet API and you want to anchor this signature, you can simply add a &#x60;name&#x60; field to the returned JSON object, and provide it as is to the &#x60;POST /anchor&#x60; endpoint.  |  -  |
**400** | Missing or invalid query parameter. More details are returned in the response body. |  -  |
**401** | Missing or invalid token. More details are returned in the response body. |  -  |
**404** | Key or User not found. |  -  |
**403** | No &#x60;pubKey&#x60; parameter is provided and the server or the user has no default key to fallback on. |  -  |

