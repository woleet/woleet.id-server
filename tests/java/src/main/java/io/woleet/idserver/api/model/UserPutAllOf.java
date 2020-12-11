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
 * UserPutAllOf
 */

public class UserPutAllOf {
  public static final String SERIALIZED_NAME_PASSWORD = "password";
  @SerializedName(SERIALIZED_NAME_PASSWORD)
  private String password;

  public static final String SERIALIZED_NAME_DEFAULT_KEY_ID = "defaultKeyId";
  @SerializedName(SERIALIZED_NAME_DEFAULT_KEY_ID)
  private UUID defaultKeyId;


  public UserPutAllOf password(String password) {
    
    this.password = password;
    return this;
  }

   /**
   * User password.
   * @return password
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "nSBa+rV3%2/LpD", value = "User password.")

  public String getPassword() {
    return password;
  }


  public void setPassword(String password) {
    this.password = password;
  }


  public UserPutAllOf defaultKeyId(UUID defaultKeyId) {
    
    this.defaultKeyId = defaultKeyId;
    return this;
  }

   /**
   * Identifier of the default key to use to sign for this user (cannot be the an external key).
   * @return defaultKeyId
  **/
  @javax.annotation.Nullable
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
    UserPutAllOf userPutAllOf = (UserPutAllOf) o;
    return Objects.equals(this.password, userPutAllOf.password) &&
        Objects.equals(this.defaultKeyId, userPutAllOf.defaultKeyId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(password, defaultKeyId);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class UserPutAllOf {\n");
    sb.append("    password: ").append(toIndentedString(password)).append("\n");
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

