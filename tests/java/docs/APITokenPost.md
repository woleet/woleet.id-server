

# APITokenPost

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | API token name. | 
**status** | [**APITokenStatusEnum**](APITokenStatusEnum.md) |  |  [optional]
**userId** | [**UUID**](UUID.md) | Identifier of the authorized user.&lt;br&gt; If set, the token allows to authenticate as the user, if not the token allow to authenticate as a server admin.  |  [optional]



