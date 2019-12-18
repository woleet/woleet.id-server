

# ServerEventGet

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | [**ServerEventTypeEnum**](ServerEventTypeEnum.md) |  |  [optional]
**occurredAt** | **Long** | Date on which an event occurred (Unix ms timestamp). |  [optional] [readonly]
**authorizedUserId** | [**UUID**](UUID.md) | Identifier of the user that triggered the event. |  [optional]
**authorizedTokenId** | [**UUID**](UUID.md) | Identifier of the API token used to authenticate. |  [optional]
**associatedTokenId** | [**UUID**](UUID.md) | Identifier of the related API token. |  [optional]
**associatedUserId** | [**UUID**](UUID.md) | Identifier of the related user. |  [optional]
**associatedKeyId** | [**UUID**](UUID.md) | Identifier of the related key. |  [optional]
**data** | [**Object**](.md) | Specific additional data associated with the event. |  [optional]



