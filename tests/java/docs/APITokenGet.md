

# APITokenGet

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | API token name. |  [optional]
**status** | [**APITokenStatusEnum**](APITokenStatusEnum.md) |  |  [optional]
**id** | [**UUID**](UUID.md) | API token identifier (allocated by the platform). |  [optional]
**value** | **String** | Token to use for the signature endpoint. |  [optional]
**userId** | [**UUID**](UUID.md) | Id of the authorized user. |  [optional]
**createdAt** | **Long** | Date of creation (Unix ms timestamp). |  [optional]
**updatedAt** | **Long** | Date of last modification (Unix ms timestamp). |  [optional]
**lastUsed** | **Long** | Date of last usage (Unix ms timestamp). |  [optional]



