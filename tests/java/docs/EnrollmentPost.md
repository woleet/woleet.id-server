

# EnrollmentPost

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | Name of the enrolled key. | 
**device** | [**KeyDeviceEnum**](KeyDeviceEnum.md) |  |  [optional]
**expiration** | **Long** | Enrollment expiration date (Unix ms timestamp).&lt;br&gt; Note that the field is not returned if the enrollment has no expiration date.  |  [optional]
**keyExpiration** | **Long** | Enrolled key expiration date (Unix ms timestamp).&lt;br&gt; Note that the field is not returned if the enrollment has no expiration date.  |  [optional]
**userId** | [**UUID**](UUID.md) | Identifier of the enrolled user. | 
**test** | **Boolean** | Used only for test purpose only. |  [optional]



