
# IdentityResult

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**rightData** | **String** | The right part of the signed data (generated randomly). &lt;br&gt;To prevent man-in-the-middle attacks, the data start with the server&#39;s identity URL and this should be verified by the caller.  |  [optional]
**signature** | **String** | Signature of the concatenation of &#x60;leftData&#x60; and &#x60;rightData&#x60; using the public key &#x60;pubKey&#x60;. |  [optional]
**identity** | [**Identity**](Identity.md) |  |  [optional]
**key** | [**Key**](Key.md) |  |  [optional]



