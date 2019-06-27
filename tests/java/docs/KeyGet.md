
# KeyGet

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | [**UUID**](UUID.md) | Key identifier (allocated by the platform). |  [optional]
**pubKey** | **String** | Public key (bitcoin address when using BIP39 keys). |  [optional]
**type** | [**KeyTypeEnum**](KeyTypeEnum.md) |  |  [optional]
**holder** | [**KeyHolderEnum**](KeyHolderEnum.md) |  |  [optional]
**device** | [**KeyDeviceEnum**](KeyDeviceEnum.md) |  |  [optional]
**expired** | **Boolean** | Indicates whether the key has expired or not. &lt;br&gt;Note that the field is not returned if the key has not expired.  |  [optional]
**createdAt** | **Long** | Date of creation (Unix ms timestamp). |  [optional]
**updatedAt** | **Long** | Date of last modification (Unix ms timestamp). |  [optional]
**lastUsed** | **Long** | Date of last usage (Unix ms timestamp). |  [optional]



