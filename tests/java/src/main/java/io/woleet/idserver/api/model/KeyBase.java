/*
 * Woleet.ID Server
 * This is Woleet.ID Server API documentation.
 *
 * The version of the OpenAPI document: 1.2.5
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
import io.woleet.idserver.api.model.KeyStatusEnum;
import java.io.IOException;

/**
 * KeyBase
 */

public class KeyBase {
  public static final String SERIALIZED_NAME_NAME = "name";
  @SerializedName(SERIALIZED_NAME_NAME)
  private String name;

  public static final String SERIALIZED_NAME_EXPIRATION = "expiration";
  @SerializedName(SERIALIZED_NAME_EXPIRATION)
  private Long expiration;

  public static final String SERIALIZED_NAME_STATUS = "status";
  @SerializedName(SERIALIZED_NAME_STATUS)
  private KeyStatusEnum status = KeyStatusEnum.ACTIVE;


  public KeyBase name(String name) {
    
    this.name = name;
    return this;
  }

   /**
   * Key name.
   * @return name
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "Jim Smith's key", value = "Key name.")

  public String getName() {
    return name;
  }


  public void setName(String name) {
    this.name = name;
  }


  public KeyBase expiration(Long expiration) {
    
    this.expiration = expiration;
    return this;
  }

   /**
   * Key expiration date (Unix ms timestamp).&lt;br&gt; Note that the field is not returned if the key has no expiration date. 
   * @return expiration
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "1569542400000", value = "Key expiration date (Unix ms timestamp).<br> Note that the field is not returned if the key has no expiration date. ")

  public Long getExpiration() {
    return expiration;
  }


  public void setExpiration(Long expiration) {
    this.expiration = expiration;
  }


  public KeyBase status(KeyStatusEnum status) {
    
    this.status = status;
    return this;
  }

   /**
   * Get status
   * @return status
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(value = "")

  public KeyStatusEnum getStatus() {
    return status;
  }


  public void setStatus(KeyStatusEnum status) {
    this.status = status;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    KeyBase keyBase = (KeyBase) o;
    return Objects.equals(this.name, keyBase.name) &&
        Objects.equals(this.expiration, keyBase.expiration) &&
        Objects.equals(this.status, keyBase.status);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, expiration, status);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class KeyBase {\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    expiration: ").append(toIndentedString(expiration)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
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

