

# ServerConfig

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**identityURL** | **String** | Public URL of the **Identity endpoint** endpoint (ie. the URL that anyone can use to get the identity associated to a public key).  |  [optional]
**signatureURL** | **String** | Public URL of **Signature endpoints** base path (ie. the URL that authorized users can use to sign and to discover other users).  |  [optional]
**APIURL** | **String** | Public URL of **API endpoints** base path (ie. the URL that authorized users to use Woleet.ID Server API).  |  [optional]
**defaultKeyId** | [**UUID**](UUID.md) | Identifier of the default key to use when signing with no user and no key specified. |  [optional]
**fallbackOnDefaultKey** | **Boolean** | True is the server must fallback on the default key (if any). |  [optional]



