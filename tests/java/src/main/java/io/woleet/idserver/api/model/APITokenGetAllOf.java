/*
 * Woleet.ID Server
 * This is Woleet.ID Server API documentation.
 *
 * The version of the OpenAPI document: 1.2.2
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
 * APITokenGetAllOf
 */

public class APITokenGetAllOf {
  public static final String SERIALIZED_NAME_ID = "id";
  @SerializedName(SERIALIZED_NAME_ID)
  private UUID id;

  public static final String SERIALIZED_NAME_VALUE = "value";
  @SerializedName(SERIALIZED_NAME_VALUE)
  private String value;

  public static final String SERIALIZED_NAME_USER_ID = "userId";
  @SerializedName(SERIALIZED_NAME_USER_ID)
  private UUID userId;

  public static final String SERIALIZED_NAME_CREATED_AT = "createdAt";
  @SerializedName(SERIALIZED_NAME_CREATED_AT)
  private Long createdAt;

  public static final String SERIALIZED_NAME_UPDATED_AT = "updatedAt";
  @SerializedName(SERIALIZED_NAME_UPDATED_AT)
  private Long updatedAt;

  public static final String SERIALIZED_NAME_LAST_USED = "lastUsed";
  @SerializedName(SERIALIZED_NAME_LAST_USED)
  private Long lastUsed;


   /**
   * API token identifier (allocated by the platform).
   * @return id
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "a35c9fee-3893-4eb7-adde-205e1be03209", value = "API token identifier (allocated by the platform).")

  public UUID getId() {
    return id;
  }




   /**
   * Token to use for the signature endpoint.
   * @return value
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "b9PXEeMpSCyeaPpQiZ3Bvw==", value = "Token to use for the signature endpoint.")

  public String getValue() {
    return value;
  }




  public APITokenGetAllOf userId(UUID userId) {
    
    this.userId = userId;
    return this;
  }

   /**
   * Id of the authorized user.
   * @return userId
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "feb37e23-d04e-4e71-bf53-1f1a75ba3a68", value = "Id of the authorized user.")

  public UUID getUserId() {
    return userId;
  }


  public void setUserId(UUID userId) {
    this.userId = userId;
  }


   /**
   * Date of creation (Unix ms timestamp).
   * @return createdAt
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "1529052551419", value = "Date of creation (Unix ms timestamp).")

  public Long getCreatedAt() {
    return createdAt;
  }




   /**
   * Date of last modification (Unix ms timestamp).
   * @return updatedAt
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "1529052551419", value = "Date of last modification (Unix ms timestamp).")

  public Long getUpdatedAt() {
    return updatedAt;
  }




   /**
   * Date of last usage (Unix ms timestamp).
   * @return lastUsed
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "1529059167339", value = "Date of last usage (Unix ms timestamp).")

  public Long getLastUsed() {
    return lastUsed;
  }




  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    APITokenGetAllOf apITokenGetAllOf = (APITokenGetAllOf) o;
    return Objects.equals(this.id, apITokenGetAllOf.id) &&
        Objects.equals(this.value, apITokenGetAllOf.value) &&
        Objects.equals(this.userId, apITokenGetAllOf.userId) &&
        Objects.equals(this.createdAt, apITokenGetAllOf.createdAt) &&
        Objects.equals(this.updatedAt, apITokenGetAllOf.updatedAt) &&
        Objects.equals(this.lastUsed, apITokenGetAllOf.lastUsed);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, value, userId, createdAt, updatedAt, lastUsed);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class APITokenGetAllOf {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    value: ").append(toIndentedString(value)).append("\n");
    sb.append("    userId: ").append(toIndentedString(userId)).append("\n");
    sb.append("    createdAt: ").append(toIndentedString(createdAt)).append("\n");
    sb.append("    updatedAt: ").append(toIndentedString(updatedAt)).append("\n");
    sb.append("    lastUsed: ").append(toIndentedString(lastUsed)).append("\n");
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

