
# ServerConfig

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**identityURL** | **String** | The identity URL that the server returns with a signature. &lt;br&gt;Note that the server always expects to be called on the \&quot;/identity\&quot; endpoint, if you want to map it to another one (like in the example, where it is linked to a dedicated subdomain) you must not forget it in your reverse proxy configuration.  |  [optional]
**defaultKeyId** | [**UUID**](UUID.md) | Identifier of the default key to use when signing with no user and no key specified. |  [optional]
**fallbackOnDefaultKey** | **Boolean** | True is the server must fallback on the default key (if any). |  [optional]
**logoURL** | **String** | The URL of the logo that will be displayed in the sign in page.  |  [optional]
**htMLFrame** | **String** | The HTML frame that will be displayed in the sign in page.  |  [optional]



