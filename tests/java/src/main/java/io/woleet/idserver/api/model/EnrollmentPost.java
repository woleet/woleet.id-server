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
import io.woleet.idserver.api.model.EnrollmentBase;
import io.woleet.idserver.api.model.EnrollmentPostAllOf;
import io.woleet.idserver.api.model.KeyDeviceEnum;
import java.io.IOException;
import java.util.UUID;

/**
 * EnrollmentPost
 */

public class EnrollmentPost {
  public static final String SERIALIZED_NAME_NAME = "name";
  @SerializedName(SERIALIZED_NAME_NAME)
  private String name;

  public static final String SERIALIZED_NAME_DEVICE = "device";
  @SerializedName(SERIALIZED_NAME_DEVICE)
  private KeyDeviceEnum device;

  public static final String SERIALIZED_NAME_EXPIRATION = "expiration";
  @SerializedName(SERIALIZED_NAME_EXPIRATION)
  private Long expiration;

  public static final String SERIALIZED_NAME_KEY_EXPIRATION = "keyExpiration";
  @SerializedName(SERIALIZED_NAME_KEY_EXPIRATION)
  private Long keyExpiration;

  public static final String SERIALIZED_NAME_USER_ID = "userId";
  @SerializedName(SERIALIZED_NAME_USER_ID)
  private UUID userId;

  public static final String SERIALIZED_NAME_TEST = "test";
  @SerializedName(SERIALIZED_NAME_TEST)
  private Boolean test;


  public EnrollmentPost name(String name) {
    
    this.name = name;
    return this;
  }

   /**
   * Name of the enrolled key.
   * @return name
  **/
  @ApiModelProperty(example = "test", required = true, value = "Name of the enrolled key.")

  public String getName() {
    return name;
  }


  public void setName(String name) {
    this.name = name;
  }


  public EnrollmentPost device(KeyDeviceEnum device) {
    
    this.device = device;
    return this;
  }

   /**
   * Get device
   * @return device
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(value = "")

  public KeyDeviceEnum getDevice() {
    return device;
  }


  public void setDevice(KeyDeviceEnum device) {
    this.device = device;
  }


  public EnrollmentPost expiration(Long expiration) {
    
    this.expiration = expiration;
    return this;
  }

   /**
   * Enrollment expiration date (Unix ms timestamp).&lt;br&gt; Note that the field is not returned if the enrollment has no expiration date. 
   * @return expiration
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "1569542400000", value = "Enrollment expiration date (Unix ms timestamp).<br> Note that the field is not returned if the enrollment has no expiration date. ")

  public Long getExpiration() {
    return expiration;
  }


  public void setExpiration(Long expiration) {
    this.expiration = expiration;
  }


  public EnrollmentPost keyExpiration(Long keyExpiration) {
    
    this.keyExpiration = keyExpiration;
    return this;
  }

   /**
   * Enrolled key expiration date (Unix ms timestamp).&lt;br&gt; Note that the field is not returned if the enrollment has no expiration date. 
   * @return keyExpiration
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "1569542400000", value = "Enrolled key expiration date (Unix ms timestamp).<br> Note that the field is not returned if the enrollment has no expiration date. ")

  public Long getKeyExpiration() {
    return keyExpiration;
  }


  public void setKeyExpiration(Long keyExpiration) {
    this.keyExpiration = keyExpiration;
  }


  public EnrollmentPost userId(UUID userId) {
    
    this.userId = userId;
    return this;
  }

   /**
   * Id of the enrolled user.
   * @return userId
  **/
  @ApiModelProperty(example = "feb37e23-d04e-4e71-bf53-1f1a75ba3a68", required = true, value = "Id of the enrolled user.")

  public UUID getUserId() {
    return userId;
  }


  public void setUserId(UUID userId) {
    this.userId = userId;
  }


  public EnrollmentPost test(Boolean test) {
    
    this.test = test;
    return this;
  }

   /**
   * Used only for test purpose.
   * @return test
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(value = "Used only for test purpose.")

  public Boolean getTest() {
    return test;
  }


  public void setTest(Boolean test) {
    this.test = test;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    EnrollmentPost enrollmentPost = (EnrollmentPost) o;
    return Objects.equals(this.name, enrollmentPost.name) &&
        Objects.equals(this.device, enrollmentPost.device) &&
        Objects.equals(this.expiration, enrollmentPost.expiration) &&
        Objects.equals(this.keyExpiration, enrollmentPost.keyExpiration) &&
        Objects.equals(this.userId, enrollmentPost.userId) &&
        Objects.equals(this.test, enrollmentPost.test);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, device, expiration, keyExpiration, userId, test);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class EnrollmentPost {\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    device: ").append(toIndentedString(device)).append("\n");
    sb.append("    expiration: ").append(toIndentedString(expiration)).append("\n");
    sb.append("    keyExpiration: ").append(toIndentedString(keyExpiration)).append("\n");
    sb.append("    userId: ").append(toIndentedString(userId)).append("\n");
    sb.append("    test: ").append(toIndentedString(test)).append("\n");
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

