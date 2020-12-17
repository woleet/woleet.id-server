

# APITokenGet

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | API token name. |  [optional]
**status** | [**APITokenStatusEnum**](APITokenStatusEnum.md) |  |  [optional]
**id** | [**UUID**](UUID.md) | API token identifier (allocated by the platform). |  [optional] [readonly]
**value** | **String** | Token to use for the signature endpoint. |  [optional] [readonly]
**userId** | [**UUID**](UUID.md) | Identifier of the authorized user. |  [optional]
**createdAt** | **Long** | Date of creation (Unix ms timestamp). |  [optional] [readonly]
**updatedAt** | **Long** | Date of last modification (Unix ms timestamp). |  [optional] [readonly]
**lastUsed** | **Long** | Date of last usage (Unix ms timestamp). |  [optional] [readonly]



