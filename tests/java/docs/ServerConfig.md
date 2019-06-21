
# ServerConfig

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**identityURL** | **String** | Public URL of the &#x60;/identity&#x60; endpoint (ie. the URL that anyone can use to get the identity associated with a public key).  |  [optional]
**defaultKeyId** | [**UUID**](UUID.md) | Identifier of the default key to use when signing with no user and no key specified. |  [optional]
**fallbackOnDefaultKey** | **Boolean** | True is the server must fallback on the default key (if any). |  [optional]



