
# UserBase

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | [**UUID**](UUID.md) | User identifier (allocated by the server). |  [optional]
**email** | **String** | User email (can be used for login). |  [optional]
**username** | **String** | User name (can be used for login). |  [optional]
**countryCallingCode** | **String** | User country calling code |  [optional]
**phone** | **String** | User phone number |  [optional]
**status** | [**UserStatusEnum**](UserStatusEnum.md) |  |  [optional]
**role** | [**UserRoleEnum**](UserRoleEnum.md) |  |  [optional]
**identity** | [**FullIdentity**](FullIdentity.md) |  |  [optional]
**defaultKeyId** | [**UUID**](UUID.md) | Identifier of the default key to use for this user. |  [optional]



