
# IdentityResult

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**rightData** | **String** | The right part of the signed data (generated randomly). &lt;br&gt;To prevent man-in-the-middle attacks, the data starts with the server&#39;s identity URL and this should be verified by the caller.  |  [optional]
**signature** | **String** | The signature of the concatenation of &#x60;leftData&#x60; and &#x60;rightData&#x60; using the public key &#x60;pubKey&#x60;.  |  [optional]
**expiration** | **Long** | Key expiration date (Unix ms timestamp). &lt;br&gt;Note that the field is not returned if the key has no expiration date.  |  [optional]
**expired** | **Boolean** | Indicates whether the key has expired or not. &lt;br&gt;Note that the field is not returned if the key has not expired.  |  [optional]
**identity** | [**Identity**](Identity.md) |  |  [optional]
**key** | [**Key**](Key.md) |  |  [optional]



