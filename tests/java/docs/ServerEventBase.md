
# ServerEventBase

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | [**ServerEventTypeEnum**](ServerEventTypeEnum.md) |  |  [optional]
**occurredAt** | **Long** | Date on which an event occurred (Unix ms timestamp). |  [optional]
**authorizedUserId** | [**UUID**](UUID.md) | Identifier of the user that triggered the event. |  [optional]
**authorizedTokenId** | [**UUID**](UUID.md) | Identifier of the API token used to authentify. |  [optional]
**associatedTokenId** | [**UUID**](UUID.md) | Identifier of the related API token. |  [optional]
**associatedUserId** | [**UUID**](UUID.md) | Identifier of the related user. |  [optional]
**associatedKeyId** | [**UUID**](UUID.md) | Identifier of the related key. |  [optional]



