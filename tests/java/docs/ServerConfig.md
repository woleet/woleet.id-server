

# ServerConfig

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**identityURL** | **String** | Public URL of the **Identity endpoint** (ie. the URL that anyone can use to get the identity associated to a public key).  |  [optional]
**preventIdentityExposure** | **Boolean** | True to prevent the identity endpoint from exposing the identities.&lt;br&gt; In this mode, the &#x60;/sign&#x60; endpoint requires the &#x60;identityToSign&#x60; parameter and the &#x60;/identity&#x60; endpoint requires the &#x60;signedIdentity&#x60; parameter: the sign endpoint records each (public key, signed identity) pair in the database, so that the identity endpoint can verify that the given signed identity was actually signed at least once by the given public key. If yes, the identity endpoint succeeds and returns only the identity fields present in the provided signed identity.  |  [optional]
**signatureURL** | **String** | Public base URL of **Signature endpoints** (ie. the base URL that authorized users can use to sign and to discover other users).  |  [optional]
**APIURL** | **String** | Public base URL of **API endpoints** (ie. the base URL that authorized users can use to call the server API).  |  [optional]
**defaultKeyId** | [**UUID**](UUID.md) | Identifier of the default key to use when signing with no user and no key specified. |  [optional]
**fallbackOnDefaultKey** | **Boolean** | True is the server must fallback on the default key (if any). |  [optional]



