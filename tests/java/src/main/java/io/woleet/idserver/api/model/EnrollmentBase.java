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
import io.woleet.idserver.api.model.KeyDeviceEnum;
import java.io.IOException;

/**
 * EnrollmentBase
 */

public class EnrollmentBase {
  public static final String SERIALIZED_NAME_NAME = "name";
  @SerializedName(SERIALIZED_NAME_NAME)
  private String name;

  public static final String SERIALIZED_NAME_DEVICE = "device";
  @SerializedName(SERIALIZED_NAME_DEVICE)
  private KeyDeviceEnum device = null;

  public static final String SERIALIZED_NAME_EXPIRATION = "expiration";
  @SerializedName(SERIALIZED_NAME_EXPIRATION)
  private Long expiration;

  public EnrollmentBase name(String name) {
    this.name = name;
    return this;
  }

   /**
   * Name of the enrolled key.
   * @return name
  **/
  @ApiModelProperty(example = "test", value = "Name of the enrolled key.")
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public EnrollmentBase device(KeyDeviceEnum device) {
    this.device = device;
    return this;
  }

   /**
   * Get device
   * @return device
  **/
  @ApiModelProperty(value = "")
  public KeyDeviceEnum getDevice() {
    return device;
  }

  public void setDevice(KeyDeviceEnum device) {
    this.device = device;
  }

  public EnrollmentBase expiration(Long expiration) {
    this.expiration = expiration;
    return this;
  }

   /**
   * Enrollment expiration date (Unix ms timestamp). &lt;br&gt;Note that the field is not returned if the enrollment has no expiration date. 
   * @return expiration
  **/
  @ApiModelProperty(example = "1569542400000", value = "Enrollment expiration date (Unix ms timestamp). <br>Note that the field is not returned if the enrollment has no expiration date. ")
  public Long getExpiration() {
    return expiration;
  }

  public void setExpiration(Long expiration) {
    this.expiration = expiration;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    EnrollmentBase enrollmentBase = (EnrollmentBase) o;
    return Objects.equals(this.name, enrollmentBase.name) &&
        Objects.equals(this.device, enrollmentBase.device) &&
        Objects.equals(this.expiration, enrollmentBase.expiration);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, device, expiration);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class EnrollmentBase {\n");
    
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    device: ").append(toIndentedString(device)).append("\n");
    sb.append("    expiration: ").append(toIndentedString(expiration)).append("\n");
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

