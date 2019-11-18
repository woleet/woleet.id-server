/*
 * Woleet.ID Server
 * This is Woleet.ID Server API documentation.
 *
 * The version of the OpenAPI document: 1.2.1
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
   * Public URL of the &#x60;/identity&#x60; endpoint (ie. the URL that anyone can use to get the identity associated with a public key). 
   * @return identityURL
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "https://identity.mydomain.com/identity", value = "Public URL of the `/identity` endpoint (ie. the URL that anyone can use to get the identity associated with a public key). ")

  public String getIdentityURL() {
    return identityURL;
  }



  public void setIdentityURL(String identityURL) {
    this.identityURL = identityURL;
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
        Objects.equals(this.defaultKeyId, serverConfig.defaultKeyId) &&
        Objects.equals(this.fallbackOnDefaultKey, serverConfig.fallbackOnDefaultKey);
  }

  @Override
  public int hashCode() {
    return Objects.hash(identityURL, defaultKeyId, fallbackOnDefaultKey);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ServerConfig {\n");
    sb.append("    identityURL: ").append(toIndentedString(identityURL)).append("\n");
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

