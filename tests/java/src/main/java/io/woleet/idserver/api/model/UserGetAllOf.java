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
import io.woleet.idserver.api.model.UserModeEnum;
import java.io.IOException;
import java.util.UUID;

/**
 * UserGetAllOf
 */

public class UserGetAllOf {
  public static final String SERIALIZED_NAME_CREATED_AT = "createdAt";
  @SerializedName(SERIALIZED_NAME_CREATED_AT)
  private Long createdAt;

  public static final String SERIALIZED_NAME_UPDATED_AT = "updatedAt";
  @SerializedName(SERIALIZED_NAME_UPDATED_AT)
  private Long updatedAt;

  public static final String SERIALIZED_NAME_LAST_LOGIN = "lastLogin";
  @SerializedName(SERIALIZED_NAME_LAST_LOGIN)
  private Long lastLogin;

  public static final String SERIALIZED_NAME_MODE = "mode";
  @SerializedName(SERIALIZED_NAME_MODE)
  private UserModeEnum mode = UserModeEnum.SEAL;

  public static final String SERIALIZED_NAME_DEFAULT_KEY_ID = "defaultKeyId";
  @SerializedName(SERIALIZED_NAME_DEFAULT_KEY_ID)
  private UUID defaultKeyId;


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
   * Date of last login (Unix ms timestamp).
   * @return lastLogin
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "1529050155459", value = "Date of last login (Unix ms timestamp).")

  public Long getLastLogin() {
    return lastLogin;
  }




  public UserGetAllOf mode(UserModeEnum mode) {
    
    this.mode = mode;
    return this;
  }

   /**
   * Get mode
   * @return mode
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(value = "")

  public UserModeEnum getMode() {
    return mode;
  }



  public void setMode(UserModeEnum mode) {
    this.mode = mode;
  }


  public UserGetAllOf defaultKeyId(UUID defaultKeyId) {
    
    this.defaultKeyId = defaultKeyId;
    return this;
  }

   /**
   * Identifier of the default key to use to sign for this user (cannot be the an external key nor a e-signature key).
   * @return defaultKeyId
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "c7c6e0de-2acb-4311-80b4-17dbf0b76806", value = "Identifier of the default key to use to sign for this user (cannot be the an external key nor a e-signature key).")

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
    UserGetAllOf userGetAllOf = (UserGetAllOf) o;
    return Objects.equals(this.createdAt, userGetAllOf.createdAt) &&
        Objects.equals(this.updatedAt, userGetAllOf.updatedAt) &&
        Objects.equals(this.lastLogin, userGetAllOf.lastLogin) &&
        Objects.equals(this.mode, userGetAllOf.mode) &&
        Objects.equals(this.defaultKeyId, userGetAllOf.defaultKeyId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(createdAt, updatedAt, lastLogin, mode, defaultKeyId);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class UserGetAllOf {\n");
    sb.append("    createdAt: ").append(toIndentedString(createdAt)).append("\n");
    sb.append("    updatedAt: ").append(toIndentedString(updatedAt)).append("\n");
    sb.append("    lastLogin: ").append(toIndentedString(lastLogin)).append("\n");
    sb.append("    mode: ").append(toIndentedString(mode)).append("\n");
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

