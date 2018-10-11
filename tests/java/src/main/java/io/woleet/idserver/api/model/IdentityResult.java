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
import io.woleet.idserver.api.model.Identity;
import java.io.IOException;

/**
 * IdentityResult
 */

public class IdentityResult {
  public static final String SERIALIZED_NAME_RIGHT_DATA = "rightData";
  @SerializedName(SERIALIZED_NAME_RIGHT_DATA)
  private String rightData = null;

  public static final String SERIALIZED_NAME_SIGNATURE = "signature";
  @SerializedName(SERIALIZED_NAME_SIGNATURE)
  private String signature = null;

  public static final String SERIALIZED_NAME_IDENTITY = "identity";
  @SerializedName(SERIALIZED_NAME_IDENTITY)
  private Identity identity = null;

  public IdentityResult rightData(String rightData) {
    this.rightData = rightData;
    return this;
  }

   /**
   * The right part of the signed data (generated randomly). &lt;br&gt;To prevent man-in-the-middle attacks, the data start with the server&#39;s identity URL and this should be verified by the caller. 
   * @return rightData
  **/
  @ApiModelProperty(value = "The right part of the signed data (generated randomly). <br>To prevent man-in-the-middle attacks, the data start with the server's identity URL and this should be verified by the caller. ")
  public String getRightData() {
    return rightData;
  }

  public void setRightData(String rightData) {
    this.rightData = rightData;
  }

  public IdentityResult signature(String signature) {
    this.signature = signature;
    return this;
  }

   /**
   * The signature of the concatenation of &#x60;leftData&#x60; and &#x60;rightData&#x60; using the public key &#x60;pubKey&#x60;.
   * @return signature
  **/
  @ApiModelProperty(example = "IKnOvW2/BQqahssC2l9Icz7qiJQqesgu0HCKvW/L5xZLaMCLyg19ATDNJojMILdUijFOqiRzgk6ieDXi89DeB0Q=", value = "The signature of the concatenation of `leftData` and `rightData` using the public key `pubKey`.")
  public String getSignature() {
    return signature;
  }

  public void setSignature(String signature) {
    this.signature = signature;
  }

  public IdentityResult identity(Identity identity) {
    this.identity = identity;
    return this;
  }

   /**
   * Get identity
   * @return identity
  **/
  @ApiModelProperty(value = "")
  public Identity getIdentity() {
    return identity;
  }

  public void setIdentity(Identity identity) {
    this.identity = identity;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    IdentityResult identityResult = (IdentityResult) o;
    return Objects.equals(this.rightData, identityResult.rightData) &&
        Objects.equals(this.signature, identityResult.signature) &&
        Objects.equals(this.identity, identityResult.identity);
  }

  @Override
  public int hashCode() {
    return Objects.hash(rightData, signature, identity);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class IdentityResult {\n");
    
    sb.append("    rightData: ").append(toIndentedString(rightData)).append("\n");
    sb.append("    signature: ").append(toIndentedString(signature)).append("\n");
    sb.append("    identity: ").append(toIndentedString(identity)).append("\n");
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

