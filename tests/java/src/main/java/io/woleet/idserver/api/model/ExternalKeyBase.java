/*
 * Woleet.ID Server
 * This is Woleet.ID Server API documentation.
 *
 * OpenAPI spec version: 1.0.4
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
 * ExternalKeyBase
 */

public class ExternalKeyBase {
  public static final String SERIALIZED_NAME_NAME = "name";
  @SerializedName(SERIALIZED_NAME_NAME)
  private String name;

  public static final String SERIALIZED_NAME_PUBLIC_KEY = "publicKey";
  @SerializedName(SERIALIZED_NAME_PUBLIC_KEY)
  private String publicKey;

  public static final String SERIALIZED_NAME_STATUS = "status";
  @SerializedName(SERIALIZED_NAME_STATUS)
  private KeyStatusEnum status = null;

  public ExternalKeyBase name(String name) {
    this.name = name;
    return this;
  }

   /**
   * Key name.
   * @return name
  **/
  @ApiModelProperty(example = "Jim Smith's key", value = "Key name.")
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public ExternalKeyBase publicKey(String publicKey) {
    this.publicKey = publicKey;
    return this;
  }

   /**
   * Key address.
   * @return publicKey
  **/
  @ApiModelProperty(example = "1HA79GnnZdHLZBMBQusXcgPEeMcrpnWahb", value = "Key address.")
  public String getPublicKey() {
    return publicKey;
  }

  public void setPublicKey(String publicKey) {
    this.publicKey = publicKey;
  }

  public ExternalKeyBase status(KeyStatusEnum status) {
    this.status = status;
    return this;
  }

   /**
   * Get status
   * @return status
  **/
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
    ExternalKeyBase externalKeyBase = (ExternalKeyBase) o;
    return Objects.equals(this.name, externalKeyBase.name) &&
        Objects.equals(this.publicKey, externalKeyBase.publicKey) &&
        Objects.equals(this.status, externalKeyBase.status);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, publicKey, status);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ExternalKeyBase {\n");
    
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    publicKey: ").append(toIndentedString(publicKey)).append("\n");
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

