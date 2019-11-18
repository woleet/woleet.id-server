

# UserGet

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | [**UUID**](UUID.md) | User identifier (allocated by the server). |  [optional] [readonly]
**email** | **String** | User email (can be used for login). |  [optional]
**username** | **String** | User name (can be used for login). |  [optional]
**countryCallingCode** | **String** | User country calling code |  [optional]
**phone** | **String** | User phone number |  [optional]
**status** | [**UserStatusEnum**](UserStatusEnum.md) |  |  [optional]
**role** | [**UserRoleEnum**](UserRoleEnum.md) |  |  [optional]
**identity** | [**FullIdentity**](FullIdentity.md) |  |  [optional]
**createdAt** | **Long** | Date of creation (Unix ms timestamp). |  [optional] [readonly]
**updatedAt** | **Long** | Date of last modification (Unix ms timestamp). |  [optional] [readonly]
**lastLogin** | **Long** | Date of last login (Unix ms timestamp). |  [optional] [readonly]
**mode** | [**UserModeEnum**](UserModeEnum.md) |  |  [optional]
**defaultKeyId** | [**UUID**](UUID.md) | Identifier of the default key to use to sign for this user (cannot be the an external key nor a e-signature key). |  [optional]



