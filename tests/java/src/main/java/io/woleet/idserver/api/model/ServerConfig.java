/*
 * Woleet.ID Server
 * This is Woleet.ID Server API documentation.
 *
 * The version of the OpenAPI document: 1.2.6
 * Contact: contact@woleet.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


package io.woleet.idserver.api.model;

import java.util.Objects;
import java.util.Arrays;
import com.google.gson.TypeAdapter;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.IOException;
import java.util.UUID;

/**
 * ServerConfig
 */

public class ServerConfig {
  public static final String SERIALIZED_NAME_IDENTITY_U_R_L = "identityURL";
  @SerializedName(SERIALIZED_NAME_IDENTITY_U_R_L)
  private String identityURL;

  public static final String SERIALIZED_NAME_PREVENT_IDENTITY_EXPOSURE = "preventIdentityExposure";
  @SerializedName(SERIALIZED_NAME_PREVENT_IDENTITY_EXPOSURE)
  private Boolean preventIdentityExposure;

  public static final String SERIALIZED_NAME_SIGNATURE_U_R_L = "signatureURL";
  @SerializedName(SERIALIZED_NAME_SIGNATURE_U_R_L)
  private String signatureURL;

  public static final String SERIALIZED_NAME_A_P_I_U_R_L = "APIURL";
  @SerializedName(SERIALIZED_NAME_A_P_I_U_R_L)
  private String APIURL;

  public static final String SERIALIZED_NAME_DEFAULT_KEY_ID = "defaultKeyId";
  @SerializedName(SERIALIZED_NAME_DEFAULT_KEY_ID)
  private UUID defaultKeyId;

  public static final String SERIALIZED_NAME_FALLBACK_ON_DEFAULT_KEY = "fallbackOnDefaultKey";
  @SerializedName(SERIALIZED_NAME_FALLBACK_ON_DEFAULT_KEY)
  private Boolean fallbackOnDefaultKey;


  public ServerConfig identityURL(String identityURL) {
    
    this.identityURL = identityURL;
    return this;
  }

   /**
   * Public URL of the **Identity endpoint** (ie. the URL that anyone can use to get the identity associated to a public key). 
   * @return identityURL
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "https://identity.mydomain.com/identity", value = "Public URL of the **Identity endpoint** (ie. the URL that anyone can use to get the identity associated to a public key). ")

  public String getIdentityURL() {
    return identityURL;
  }


  public void setIdentityURL(String identityURL) {
    this.identityURL = identityURL;
  }


  public ServerConfig preventIdentityExposure(Boolean preventIdentityExposure) {
    
    this.preventIdentityExposure = preventIdentityExposure;
    return this;
  }

   /**
   * True to prevent the identity endpoint from exposing the identities.&lt;br&gt; In this mode, the &#x60;/sign&#x60; endpoint requires the &#x60;identityToSign&#x60; parameter and the &#x60;/identity&#x60; endpoint requires the &#x60;signedIdentity&#x60; parameter: the sign endpoint records each (public key, signed identity) pair in the database, so that the identity endpoint can verify that the given signed identity was actually signed at least once by the given public key. If yes, the identity endpoint succeeds and returns only the identity fields present in the provided signed identity. 
   * @return preventIdentityExposure
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(value = "True to prevent the identity endpoint from exposing the identities.<br> In this mode, the `/sign` endpoint requires the `identityToSign` parameter and the `/identity` endpoint requires the `signedIdentity` parameter: the sign endpoint records each (public key, signed identity) pair in the database, so that the identity endpoint can verify that the given signed identity was actually signed at least once by the given public key. If yes, the identity endpoint succeeds and returns only the identity fields present in the provided signed identity. ")

  public Boolean getPreventIdentityExposure() {
    return preventIdentityExposure;
  }


  public void setPreventIdentityExposure(Boolean preventIdentityExposure) {
    this.preventIdentityExposure = preventIdentityExposure;
  }


  public ServerConfig signatureURL(String signatureURL) {
    
    this.signatureURL = signatureURL;
    return this;
  }

   /**
   * Public base URL of **Signature endpoints** (ie. the base URL that authorized users can use to sign and to discover other users). 
   * @return signatureURL
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "https://sign.mydomain.com:3002", value = "Public base URL of **Signature endpoints** (ie. the base URL that authorized users can use to sign and to discover other users). ")

  public String getSignatureURL() {
    return signatureURL;
  }


  public void setSignatureURL(String signatureURL) {
    this.signatureURL = signatureURL;
  }


  public ServerConfig APIURL(String APIURL) {
    
    this.APIURL = APIURL;
    return this;
  }

   /**
   * Public base URL of **API endpoints** (ie. the base URL that authorized users can use to call the server API). 
   * @return APIURL
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "https://mydomain.com/api", value = "Public base URL of **API endpoints** (ie. the base URL that authorized users can use to call the server API). ")

  public String getAPIURL() {
    return APIURL;
  }


  public void setAPIURL(String APIURL) {
    this.APIURL = APIURL;
  }


  public ServerConfig defaultKeyId(UUID defaultKeyId) {
    
    this.defaultKeyId = defaultKeyId;
    return this;
  }

   /**
   * Identifier of the default key to use when signing with no user and no key specified.
   * @return defaultKeyId
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "7b8e5c49-18c6-4ef7-9dab-261a5e717b31", value = "Identifier of the default key to use when signing with no user and no key specified.")

  public UUID getDefaultKeyId() {
    return defaultKeyId;
  }


  public void setDefaultKeyId(UUID defaultKeyId) {
    this.defaultKeyId = defaultKeyId;
  }


  public ServerConfig fallbackOnDefaultKey(Boolean fallbackOnDefaultKey) {
    
    this.fallbackOnDefaultKey = fallbackOnDefaultKey;
    return this;
  }

   /**
   * True is the server must fallback on the default key (if any).
   * @return fallbackOnDefaultKey
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "true", value = "True is the server must fallback on the default key (if any).")

  public Boolean getFallbackOnDefaultKey() {
    return fallbackOnDefaultKey;
  }


  public void setFallbackOnDefaultKey(Boolean fallbackOnDefaultKey) {
    this.fallbackOnDefaultKey = fallbackOnDefaultKey;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ServerConfig serverConfig = (ServerConfig) o;
    return Objects.equals(this.identityURL, serverConfig.identityURL) &&
        Objects.equals(this.preventIdentityExposure, serverConfig.preventIdentityExposure) &&
        Objects.equals(this.signatureURL, serverConfig.signatureURL) &&
        Objects.equals(this.APIURL, serverConfig.APIURL) &&
        Objects.equals(this.defaultKeyId, serverConfig.defaultKeyId) &&
        Objects.equals(this.fallbackOnDefaultKey, serverConfig.fallbackOnDefaultKey);
  }

  @Override
  public int hashCode() {
    return Objects.hash(identityURL, preventIdentityExposure, signatureURL, APIURL, defaultKeyId, fallbackOnDefaultKey);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ServerConfig {\n");
    sb.append("    identityURL: ").append(toIndentedString(identityURL)).append("\n");
    sb.append("    preventIdentityExposure: ").append(toIndentedString(preventIdentityExposure)).append("\n");
    sb.append("    signatureURL: ").append(toIndentedString(signatureURL)).append("\n");
    sb.append("    APIURL: ").append(toIndentedString(APIURL)).append("\n");
    sb.append("    defaultKeyId: ").append(toIndentedString(defaultKeyId)).append("\n");
    sb.append("    fallbackOnDefaultKey: ").append(toIndentedString(fallbackOnDefaultKey)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(java.lang.Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }

}

