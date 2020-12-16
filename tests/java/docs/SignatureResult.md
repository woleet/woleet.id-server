

# SignatureResult

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**pubKey** | **String** | Public key used to sign (must be the same as the &#x60;pubKey&#x60; parameter if provided). |  [optional]
**signedHash** | **String** | SHA256 hash that is signed (same as the &#x60;hashToSign&#x60; parameter). |  [optional]
**signedMessage** | **String** | Message that is signed (same as the &#x60;messageToSign&#x60; parameter). |  [optional]
**signature** | **String** | Signature of &#x60;signedMessage&#x60; or &#x60;signedHash&#x60; using the public key &#x60;pubKey&#x60;, or signature of SHA256(&#x60;signedMessage&#x60; or &#x60;signedHash&#x60; + &#x60;signedIdentity&#x60; + &#x60;signedIssuerDomain&#x60;) if the identity of the signer and the domain of the identity issuer are included to the signed data.  |  [optional]
**identityURL** | **String** | Public URL of the **Identity endpoint** (ie. the URL that anyone can use to get the identity associated to a public key).  |  [optional]
**signedIdentity** | **String** | Identity of the signer (as a X500 Distinguished Name).&lt;br&gt; Returned only if &#x60;identityToSign&#x60; is used.  |  [optional]
**signedIssuerDomain** | **String** | Domain of the identity issuer (ie. of the organization who verified the identity).&lt;br&gt; Returned only if &#x60;identityToSign&#x60; is used.  |  [optional]



