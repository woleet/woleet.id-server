

# EnrollmentGet

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | Name of the enrolled key. |  [optional]
**device** | [**KeyDeviceEnum**](KeyDeviceEnum.md) |  |  [optional]
**expiration** | **Long** | Enrollment expiration date (Unix ms timestamp).&lt;br&gt; Note that the field is not returned if the enrollment has no expiration date.  |  [optional]
**keyExpiration** | **Long** | Enrolled key expiration date (Unix ms timestamp).&lt;br&gt; Note that the field is not returned if the enrollment has no expiration date.  |  [optional]
**id** | [**UUID**](UUID.md) | Enrollment identifier (allocated by the server). |  [optional]
**userId** | [**UUID**](UUID.md) | Id of the enrolled user. |  [optional]



