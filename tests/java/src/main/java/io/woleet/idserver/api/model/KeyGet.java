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
import io.woleet.idserver.api.model.KeyBase;
import io.woleet.idserver.api.model.KeyDeviceEnum;
import io.woleet.idserver.api.model.KeyHolderEnum;
import io.woleet.idserver.api.model.KeyStatusEnum;
import io.woleet.idserver.api.model.KeyTypeEnum;
import java.io.IOException;
import java.util.UUID;

/**
 * KeyGet
 */

public class KeyGet extends KeyBase {
  public static final String SERIALIZED_NAME_ID = "id";
  @SerializedName(SERIALIZED_NAME_ID)
  private UUID id;

  public static final String SERIALIZED_NAME_PUB_KEY = "pubKey";
  @SerializedName(SERIALIZED_NAME_PUB_KEY)
  private String pubKey;

  public static final String SERIALIZED_NAME_TYPE = "type";
  @SerializedName(SERIALIZED_NAME_TYPE)
  private KeyTypeEnum type = null;

  public static final String SERIALIZED_NAME_HOLDER = "holder";
  @SerializedName(SERIALIZED_NAME_HOLDER)
  private KeyHolderEnum holder = null;

  public static final String SERIALIZED_NAME_DEVICE = "device";
  @SerializedName(SERIALIZED_NAME_DEVICE)
  private KeyDeviceEnum device = null;

  public static final String SERIALIZED_NAME_EXPIRED = "expired";
  @SerializedName(SERIALIZED_NAME_EXPIRED)
  private Boolean expired;

  public static final String SERIALIZED_NAME_REVOKED_AT = "revokedAt";
  @SerializedName(SERIALIZED_NAME_REVOKED_AT)
  private Long revokedAt;

  public static final String SERIALIZED_NAME_CREATED_AT = "createdAt";
  @SerializedName(SERIALIZED_NAME_CREATED_AT)
  private Long createdAt;

  public static final String SERIALIZED_NAME_UPDATED_AT = "updatedAt";
  @SerializedName(SERIALIZED_NAME_UPDATED_AT)
  private Long updatedAt;

  public static final String SERIALIZED_NAME_LAST_USED = "lastUsed";
  @SerializedName(SERIALIZED_NAME_LAST_USED)
  private Long lastUsed;

   /**
   * Key identifier (allocated by the platform).
   * @return id
  **/
  @ApiModelProperty(example = "a35c9fee-3893-4eb7-adde-205e1be03209", value = "Key identifier (allocated by the platform).")
  public UUID getId() {
    return id;
  }

  public KeyGet pubKey(String pubKey) {
    this.pubKey = pubKey;
    return this;
  }

   /**
   * Public key (bitcoin address when using BIP39 keys).
   * @return pubKey
  **/
  @ApiModelProperty(example = "1GChJMuyxvq28F3Uksqf5v7QkxQ4WLQdBh", value = "Public key (bitcoin address when using BIP39 keys).")
  public String getPubKey() {
    return pubKey;
  }

  public void setPubKey(String pubKey) {
    this.pubKey = pubKey;
  }

  public KeyGet type(KeyTypeEnum type) {
    this.type = type;
    return this;
  }

   /**
   * Get type
   * @return type
  **/
  @ApiModelProperty(value = "")
  public KeyTypeEnum getType() {
    return type;
  }

  public void setType(KeyTypeEnum type) {
    this.type = type;
  }

  public KeyGet holder(KeyHolderEnum holder) {
    this.holder = holder;
    return this;
  }

   /**
   * Get holder
   * @return holder
  **/
  @ApiModelProperty(value = "")
  public KeyHolderEnum getHolder() {
    return holder;
  }

  public void setHolder(KeyHolderEnum holder) {
    this.holder = holder;
  }

  public KeyGet device(KeyDeviceEnum device) {
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

  public KeyGet expired(Boolean expired) {
    this.expired = expired;
    return this;
  }

   /**
   * Indicates whether the key has expired or not. &lt;br&gt;Note that the field is not returned if the key has not expired. 
   * @return expired
  **/
  @ApiModelProperty(value = "Indicates whether the key has expired or not. <br>Note that the field is not returned if the key has not expired. ")
  public Boolean getExpired() {
    return expired;
  }

  public void setExpired(Boolean expired) {
    this.expired = expired;
  }

  public KeyGet revokedAt(Long revokedAt) {
    this.revokedAt = revokedAt;
    return this;
  }

   /**
   * Key expiration date (Unix ms timestamp). &lt;br&gt;Note that the field is not returned if the key has no expiration date. 
   * @return revokedAt
  **/
  @ApiModelProperty(example = "1569542400000", value = "Key expiration date (Unix ms timestamp). <br>Note that the field is not returned if the key has no expiration date. ")
  public Long getRevokedAt() {
    return revokedAt;
  }

  public void setRevokedAt(Long revokedAt) {
    this.revokedAt = revokedAt;
  }

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
   * Date of last usage (Unix ms timestamp).
   * @return lastUsed
  **/
  @ApiModelProperty(example = "1529059167339", value = "Date of last usage (Unix ms timestamp).")
  public Long getLastUsed() {
    return lastUsed;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    KeyGet keyGet = (KeyGet) o;
    return Objects.equals(this.id, keyGet.id) &&
        Objects.equals(this.pubKey, keyGet.pubKey) &&
        Objects.equals(this.type, keyGet.type) &&
        Objects.equals(this.holder, keyGet.holder) &&
        Objects.equals(this.device, keyGet.device) &&
        Objects.equals(this.expired, keyGet.expired) &&
        Objects.equals(this.revokedAt, keyGet.revokedAt) &&
        Objects.equals(this.createdAt, keyGet.createdAt) &&
        Objects.equals(this.updatedAt, keyGet.updatedAt) &&
        Objects.equals(this.lastUsed, keyGet.lastUsed) &&
        super.equals(o);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, pubKey, type, holder, device, expired, revokedAt, createdAt, updatedAt, lastUsed, super.hashCode());
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class KeyGet {\n");
    sb.append("    ").append(toIndentedString(super.toString())).append("\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    pubKey: ").append(toIndentedString(pubKey)).append("\n");
    sb.append("    type: ").append(toIndentedString(type)).append("\n");
    sb.append("    holder: ").append(toIndentedString(holder)).append("\n");
    sb.append("    device: ").append(toIndentedString(device)).append("\n");
    sb.append("    expired: ").append(toIndentedString(expired)).append("\n");
    sb.append("    revokedAt: ").append(toIndentedString(revokedAt)).append("\n");
    sb.append("    createdAt: ").append(toIndentedString(createdAt)).append("\n");
    sb.append("    updatedAt: ").append(toIndentedString(updatedAt)).append("\n");
    sb.append("    lastUsed: ").append(toIndentedString(lastUsed)).append("\n");
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

