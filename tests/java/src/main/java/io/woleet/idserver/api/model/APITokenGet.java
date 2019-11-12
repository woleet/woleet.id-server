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
import io.woleet.idserver.api.model.APITokenBase;
import io.woleet.idserver.api.model.APITokenGetAllOf;
import io.woleet.idserver.api.model.APITokenStatusEnum;
import java.io.IOException;
import java.util.UUID;

/**
 * APITokenGet
 */

public class APITokenGet {
  public static final String SERIALIZED_NAME_NAME = "name";
  @SerializedName(SERIALIZED_NAME_NAME)
  private String name;

  public static final String SERIALIZED_NAME_STATUS = "status";
  @SerializedName(SERIALIZED_NAME_STATUS)
  private APITokenStatusEnum status = APITokenStatusEnum.ACTIVE;

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


  public APITokenGet name(String name) {
    
    this.name = name;
    return this;
  }

   /**
   * API token name.
   * @return name
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "My API token name", value = "API token name.")

  public String getName() {
    return name;
  }



  public void setName(String name) {
    this.name = name;
  }


  public APITokenGet status(APITokenStatusEnum status) {
    
    this.status = status;
    return this;
  }

   /**
   * Get status
   * @return status
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(value = "")

  public APITokenStatusEnum getStatus() {
    return status;
  }



  public void setStatus(APITokenStatusEnum status) {
    this.status = status;
  }


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




  public APITokenGet userId(UUID userId) {
    
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
    APITokenGet apITokenGet = (APITokenGet) o;
    return Objects.equals(this.name, apITokenGet.name) &&
        Objects.equals(this.status, apITokenGet.status) &&
        Objects.equals(this.id, apITokenGet.id) &&
        Objects.equals(this.value, apITokenGet.value) &&
        Objects.equals(this.userId, apITokenGet.userId) &&
        Objects.equals(this.createdAt, apITokenGet.createdAt) &&
        Objects.equals(this.updatedAt, apITokenGet.updatedAt) &&
        Objects.equals(this.lastUsed, apITokenGet.lastUsed);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, status, id, value, userId, createdAt, updatedAt, lastUsed);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class APITokenGet {\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
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

