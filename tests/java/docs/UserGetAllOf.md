

# UserGetAllOf

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | [**UUID**](UUID.md) | User identifier (allocated by the server). |  [optional] [readonly]
**createdAt** | **Long** | Date of creation (Unix ms timestamp). |  [optional] [readonly]
**updatedAt** | **Long** | Date of last modification (Unix ms timestamp). |  [optional] [readonly]
**lastLogin** | **Long** | Date of last login (Unix ms timestamp). |  [optional] [readonly]
**mode** | [**UserModeEnum**](UserModeEnum.md) |  |  [optional]
**defaultKeyId** | [**UUID**](UUID.md) | Identifier of the default key to use to sign for this user (cannot be the an external key nor a e-signature key). |  [optional]



