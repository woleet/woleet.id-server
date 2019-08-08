/*
 * Woleet.ID Server
 * This is Woleet.ID Server API documentation.
 *
 * OpenAPI spec version: 1.2.0
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
import io.woleet.idserver.api.model.FullIdentity;
import io.woleet.idserver.api.model.UserBase;
import io.woleet.idserver.api.model.UserRoleEnum;
import io.woleet.idserver.api.model.UserStatusEnum;
import java.io.IOException;
import java.util.UUID;

/**
 * UserGet
 */

public class UserGet extends UserBase {
  public static final String SERIALIZED_NAME_CREATED_AT = "createdAt";
  @SerializedName(SERIALIZED_NAME_CREATED_AT)
  private Long createdAt;

  public static final String SERIALIZED_NAME_UPDATED_AT = "updatedAt";
  @SerializedName(SERIALIZED_NAME_UPDATED_AT)
  private Long updatedAt;

  public static final String SERIALIZED_NAME_LAST_LOGIN = "lastLogin";
  @SerializedName(SERIALIZED_NAME_LAST_LOGIN)
  private Long lastLogin;

  public static final String SERIALIZED_NAME_DEFAULT_KEY_ID = "defaultKeyId";
  @SerializedName(SERIALIZED_NAME_DEFAULT_KEY_ID)
  private UUID defaultKeyId;

   /**
   * Date of creation (Unix ms timestamp).
   * @return createdAt
  **/
  @ApiModelProperty(example = "1529052551419", value = "Date of creation (Unix ms timestamp).")
  public Long getCreatedAt() {
    return createdAt;
  }

   /**
   * Date of last modification (Unix ms timestamp).
   * @return updatedAt
  **/
  @ApiModelProperty(example = "1529052551419", value = "Date of last modification (Unix ms timestamp).")
  public Long getUpdatedAt() {
    return updatedAt;
  }

   /**
   * Date of last login (Unix ms timestamp).
   * @return lastLogin
  **/
  @ApiModelProperty(example = "1529050155459", value = "Date of last login (Unix ms timestamp).")
  public Long getLastLogin() {
    return lastLogin;
  }

  public UserGet defaultKeyId(UUID defaultKeyId) {
    this.defaultKeyId = defaultKeyId;
    return this;
  }

   /**
   * Identifier of the default key to use to sign for this user (cannot be the an external key).
   * @return defaultKeyId
  **/
  @ApiModelProperty(example = "c7c6e0de-2acb-4311-80b4-17dbf0b76806", value = "Identifier of the default key to use to sign for this user (cannot be the an external key).")
  public UUID getDefaultKeyId() {
    return defaultKeyId;
  }

  public void setDefaultKeyId(UUID defaultKeyId) {
    this.defaultKeyId = defaultKeyId;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    UserGet userGet = (UserGet) o;
    return Objects.equals(this.createdAt, userGet.createdAt) &&
        Objects.equals(this.updatedAt, userGet.updatedAt) &&
        Objects.equals(this.lastLogin, userGet.lastLogin) &&
        Objects.equals(this.defaultKeyId, userGet.defaultKeyId) &&
        super.equals(o);
  }

  @Override
  public int hashCode() {
    return Objects.hash(createdAt, updatedAt, lastLogin, defaultKeyId, super.hashCode());
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class UserGet {\n");
    sb.append("    ").append(toIndentedString(super.toString())).append("\n");
    sb.append("    createdAt: ").append(toIndentedString(createdAt)).append("\n");
    sb.append("    updatedAt: ").append(toIndentedString(updatedAt)).append("\n");
    sb.append("    lastLogin: ").append(toIndentedString(lastLogin)).append("\n");
    sb.append("    defaultKeyId: ").append(toIndentedString(defaultKeyId)).append("\n");
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

