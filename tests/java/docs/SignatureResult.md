
# SignatureResult

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**pubKey** | **String** | The public key used to sign (must be the same as the &#x60;pubKey&#x60; parameter, if provided). |  [optional]
**signedHash** | **String** | The hash that is signed (same as the &#x60;hashToSign&#x60; parameter). |  [optional]
**signature** | **String** | The signature of &#x60;hashToSign&#x60; using the public key &#x60;pubKey&#x60;. |  [optional]
**identityURL** | **String** | The public URL of the &#x60;/identity&#x60; endpoint (ie. a URL that anyone can use to prove and verify the identity associated with the public key). |  [optional]



