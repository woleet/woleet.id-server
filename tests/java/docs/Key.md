
# Key

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | Key name. |  [optional]
**pubKey** | **String** | Public key (bitcoin address when using BIP39 keys). |  [optional]
**status** | [**StatusEnum**](#StatusEnum) | Key status. |  [optional]
**expiration** | **Long** | Key expiration date (Unix ms timestamp). &lt;br&gt;Note that the field is not returned if the key has no expiration date.  |  [optional]
**revokedAt** | **Long** | Key revocation date (Unix ms timestamp). &lt;br&gt;Note that the field is not returned if the key is not yet revoked.  |  [optional]


<a name="StatusEnum"></a>
## Enum: StatusEnum
Name | Value
---- | -----
VALID | &quot;valid&quot;
EXPIRED | &quot;expired&quot;
REVOKED | &quot;revoked&quot;



