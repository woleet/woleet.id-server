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

/**
 * UserPostAllOf
 */

public class UserPostAllOf {
  public static final String SERIALIZED_NAME_PASSWORD = "password";
  @SerializedName(SERIALIZED_NAME_PASSWORD)
  private String password;

  public static final String SERIALIZED_NAME_CREATE_DEFAULT_KEY = "createDefaultKey";
  @SerializedName(SERIALIZED_NAME_CREATE_DEFAULT_KEY)
  private Boolean createDefaultKey;

  public static final String SERIALIZED_NAME_MODE = "mode";
  @SerializedName(SERIALIZED_NAME_MODE)
  private UserModeEnum mode = UserModeEnum.SEAL;


  public UserPostAllOf password(String password) {
    
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


  public UserPostAllOf createDefaultKey(Boolean createDefaultKey) {
    
    this.createDefaultKey = createDefaultKey;
    return this;
  }

   /**
   * If true create a key holded by the server when this user is created.
   * @return createDefaultKey
  **/
  @ApiModelProperty(required = true, value = "If true create a key holded by the server when this user is created.")

  public Boolean getCreateDefaultKey() {
    return createDefaultKey;
  }


  public void setCreateDefaultKey(Boolean createDefaultKey) {
    this.createDefaultKey = createDefaultKey;
  }


  public UserPostAllOf mode(UserModeEnum mode) {
    
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


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    UserPostAllOf userPostAllOf = (UserPostAllOf) o;
    return Objects.equals(this.password, userPostAllOf.password) &&
        Objects.equals(this.createDefaultKey, userPostAllOf.createDefaultKey) &&
        Objects.equals(this.mode, userPostAllOf.mode);
  }

  @Override
  public int hashCode() {
    return Objects.hash(password, createDefaultKey, mode);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class UserPostAllOf {\n");
    sb.append("    password: ").append(toIndentedString(password)).append("\n");
    sb.append("    createDefaultKey: ").append(toIndentedString(createDefaultKey)).append("\n");
    sb.append("    mode: ").append(toIndentedString(mode)).append("\n");
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

