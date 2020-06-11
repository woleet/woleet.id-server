/*
 * Woleet.ID Server
 * This is Woleet.ID Server API documentation.
 *
 * The version of the OpenAPI document: 1.2.4
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

/**
 * SignatureResult
 */

public class SignatureResult {
  public static final String SERIALIZED_NAME_PUB_KEY = "pubKey";
  @SerializedName(SERIALIZED_NAME_PUB_KEY)
  private String pubKey;

  public static final String SERIALIZED_NAME_SIGNED_HASH = "signedHash";
  @SerializedName(SERIALIZED_NAME_SIGNED_HASH)
  private String signedHash;

  public static final String SERIALIZED_NAME_SIGNED_MESSAGE = "signedMessage";
  @SerializedName(SERIALIZED_NAME_SIGNED_MESSAGE)
  private String signedMessage;

  public static final String SERIALIZED_NAME_SIGNATURE = "signature";
  @SerializedName(SERIALIZED_NAME_SIGNATURE)
  private String signature;

  public static final String SERIALIZED_NAME_IDENTITY_U_R_L = "identityURL";
  @SerializedName(SERIALIZED_NAME_IDENTITY_U_R_L)
  private String identityURL;


  public SignatureResult pubKey(String pubKey) {
    
    this.pubKey = pubKey;
    return this;
  }

   /**
   * Public key used to sign (must be the same as the &#x60;pubKey&#x60; parameter if provided).
   * @return pubKey
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "1KjQ8LgUgYVSqeK7JFhA9W8FVsHCzFrFi8", value = "Public key used to sign (must be the same as the `pubKey` parameter if provided).")

  public String getPubKey() {
    return pubKey;
  }


  public void setPubKey(String pubKey) {
    this.pubKey = pubKey;
  }


  public SignatureResult signedHash(String signedHash) {
    
    this.signedHash = signedHash;
    return this;
  }

   /**
   * SHA256 hash that is signed (same as the &#x60;hashToSign&#x60; parameter).
   * @return signedHash
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b", value = "SHA256 hash that is signed (same as the `hashToSign` parameter).")

  public String getSignedHash() {
    return signedHash;
  }


  public void setSignedHash(String signedHash) {
    this.signedHash = signedHash;
  }


  public SignatureResult signedMessage(String signedMessage) {
    
    this.signedMessage = signedMessage;
    return this;
  }

   /**
   * Message that is signed (same as the &#x60;messageToSign&#x60; parameter).
   * @return signedMessage
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b", value = "Message that is signed (same as the `messageToSign` parameter).")

  public String getSignedMessage() {
    return signedMessage;
  }


  public void setSignedMessage(String signedMessage) {
    this.signedMessage = signedMessage;
  }


  public SignatureResult signature(String signature) {
    
    this.signature = signature;
    return this;
  }

   /**
   * Signature of &#x60;messageToSign&#x60; or &#x60;hashToSign&#x60; using the public key &#x60;pubKey&#x60;.
   * @return signature
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "IKnOvW2/BQqahssC2l9Icz7qiJQqesgu0HCKvW/L5xZLaMCLyg19ATDNJojMILdUijFOqiRzgk6ieDXi89DeB0Q=", value = "Signature of `messageToSign` or `hashToSign` using the public key `pubKey`.")

  public String getSignature() {
    return signature;
  }


  public void setSignature(String signature) {
    this.signature = signature;
  }


  public SignatureResult identityURL(String identityURL) {
    
    this.identityURL = identityURL;
    return this;
  }

   /**
   * Public URL of the **Identity endpoint** endpoint (ie. the URL that anyone can use to get the identity associated to a public key). 
   * @return identityURL
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "https://identity.mydomain.com/identity", value = "Public URL of the **Identity endpoint** endpoint (ie. the URL that anyone can use to get the identity associated to a public key). ")

  public String getIdentityURL() {
    return identityURL;
  }


  public void setIdentityURL(String identityURL) {
    this.identityURL = identityURL;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    SignatureResult signatureResult = (SignatureResult) o;
    return Objects.equals(this.pubKey, signatureResult.pubKey) &&
        Objects.equals(this.signedHash, signatureResult.signedHash) &&
        Objects.equals(this.signedMessage, signatureResult.signedMessage) &&
        Objects.equals(this.signature, signatureResult.signature) &&
        Objects.equals(this.identityURL, signatureResult.identityURL);
  }

  @Override
  public int hashCode() {
    return Objects.hash(pubKey, signedHash, signedMessage, signature, identityURL);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class SignatureResult {\n");
    sb.append("    pubKey: ").append(toIndentedString(pubKey)).append("\n");
    sb.append("    signedHash: ").append(toIndentedString(signedHash)).append("\n");
    sb.append("    signedMessage: ").append(toIndentedString(signedMessage)).append("\n");
    sb.append("    signature: ").append(toIndentedString(signature)).append("\n");
    sb.append("    identityURL: ").append(toIndentedString(identityURL)).append("\n");
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

