# HealthcheckApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**checkGet**](HealthcheckApi.md#checkGet) | **GET** /check | Check the database availability.


<a name="checkGet"></a>
# **checkGet**
> checkGet()

Check the database availability.

### Example
```java
// Import classes:
//import io.woleet.idserver.ApiException;
//import io.woleet.idserver.api.HealthcheckApi;


HealthcheckApi apiInstance = new HealthcheckApi();
try {
    apiInstance.checkGet();
} catch (ApiException e) {
    System.err.println("Exception when calling HealthcheckApi#checkGet");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

