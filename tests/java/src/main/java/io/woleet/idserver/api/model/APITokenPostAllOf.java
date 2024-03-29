/*
 * Woleet.ID Server
 * This is Woleet.ID Server API documentation.
 *
 * The version of the OpenAPI document: 1.2.8
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
 * APITokenPostAllOf
 */

public class APITokenPostAllOf {
  public static final String SERIALIZED_NAME_USER_ID = "userId";
  @SerializedName(SERIALIZED_NAME_USER_ID)
  private UUID userId;


  public APITokenPostAllOf userId(UUID userId) {
    
    this.userId = userId;
    return this;
  }

   /**
   * Identifier of the authorized user.&lt;br&gt; If set, the token allows to authenticate as the user, if not the token allow to authenticate as a server admin. 
   * @return userId
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "feb37e23-d04e-4e71-bf53-1f1a75ba3a68", value = "Identifier of the authorized user.<br> If set, the token allows to authenticate as the user, if not the token allow to authenticate as a server admin. ")

  public UUID getUserId() {
    return userId;
  }


  public void setUserId(UUID userId) {
    this.userId = userId;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    APITokenPostAllOf apITokenPostAllOf = (APITokenPostAllOf) o;
    return Objects.equals(this.userId, apITokenPostAllOf.userId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(userId);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class APITokenPostAllOf {\n");
    sb.append("    userId: ").append(toIndentedString(userId)).append("\n");
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

