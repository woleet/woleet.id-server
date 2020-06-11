

# SignatureResult

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**pubKey** | **String** | Public key used to sign (must be the same as the &#x60;pubKey&#x60; parameter if provided). |  [optional]
**signedHash** | **String** | SHA256 hash that is signed (same as the &#x60;hashToSign&#x60; parameter). |  [optional]
**signedMessage** | **String** | Message that is signed (same as the &#x60;messageToSign&#x60; parameter). |  [optional]
**signature** | **String** | Signature of &#x60;messageToSign&#x60; or &#x60;hashToSign&#x60; using the public key &#x60;pubKey&#x60;. |  [optional]
**identityURL** | **String** | Public URL of the **Identity endpoint** (ie. the URL that anyone can use to get the identity associated to a public key).  |  [optional]



