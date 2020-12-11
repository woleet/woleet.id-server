

# ServerConfig

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**identityURL** | **String** | Public URL of the **Identity endpoint** (ie. the URL that anyone can use to get the identity associated to a public key).  |  [optional]
**preventIdentityExposure** | **Boolean** | True to prevent the identity endpoint from exposing the identity of users.&lt;br&gt; In this mode, the identity endpoint requires the &#x60;signedIdentity&#x60; parameter to be provided, and verifies that this identity was signed at least once by the public key.&lt;br&gt; If so, the identity endpoint succeeds and returns only the identity fields present in the provided signed identity.  |  [optional]
**signatureURL** | **String** | Public base URL of **Signature endpoints** (ie. the base URL that authorized users can use to sign and to discover other users).  |  [optional]
**APIURL** | **String** | Public base URL of **API endpoints** (ie. the base URL that authorized users can use to call the server API).  |  [optional]
**defaultKeyId** | [**UUID**](UUID.md) | Identifier of the default key to use when signing with no user and no key specified. |  [optional]
**fallbackOnDefaultKey** | **Boolean** | True is the server must fallback on the default key (if any). |  [optional]



