
# SignatureResult

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**pubKey** | **String** | Public key used to sign (must be the same as the &#x60;pubKey&#x60; parameter if provided). |  [optional]
**signedHash** | **String** | SHA256 hash that is signed (same as the &#x60;hashToSign&#x60; parameter). |  [optional]
**signature** | **String** | Signature of &#x60;hashToSign&#x60; using the public key &#x60;pubKey&#x60;. |  [optional]
**identityURL** | **String** | Public URL of the &#x60;/identity&#x60; endpoint (ie. a URL that anyone can use to prove and verify the identity associated with the public key). |  [optional]



