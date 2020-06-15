/*
 * Woleet.ID Server
 * This is Woleet.ID Server API documentation.
 *
 * The version of the OpenAPI document: 1.2.5
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
import io.woleet.idserver.api.model.KeyGetAllOf;
import io.woleet.idserver.api.model.KeyHolderEnum;
import io.woleet.idserver.api.model.KeyStatusEnum;
import io.woleet.idserver.api.model.KeyTypeEnum;
import java.io.IOException;
import java.util.UUID;

/**
 * KeyGet
 */

public class KeyGet {
  public static final String SERIALIZED_NAME_NAME = "name";
  @SerializedName(SERIALIZED_NAME_NAME)
  private String name;

  public static final String SERIALIZED_NAME_EXPIRATION = "expiration";
  @SerializedName(SERIALIZED_NAME_EXPIRATION)
  private Long expiration;

  public static final String SERIALIZED_NAME_STATUS = "status";
  @SerializedName(SERIALIZED_NAME_STATUS)
  private KeyStatusEnum status = KeyStatusEnum.ACTIVE;

  public static final String SERIALIZED_NAME_ID = "id";
  @SerializedName(SERIALIZED_NAME_ID)
  private UUID id;

  public static final String SERIALIZED_NAME_PUB_KEY = "pubKey";
  @SerializedName(SERIALIZED_NAME_PUB_KEY)
  private String pubKey;

  public static final String SERIALIZED_NAME_TYPE = "type";
  @SerializedName(SERIALIZED_NAME_TYPE)
  private KeyTypeEnum type;

  public static final String SERIALIZED_NAME_HOLDER = "holder";
  @SerializedName(SERIALIZED_NAME_HOLDER)
  private KeyHolderEnum holder;

  public static final String SERIALIZED_NAME_DEVICE = "device";
  @SerializedName(SERIALIZED_NAME_DEVICE)
  private KeyDeviceEnum device;

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


  public KeyGet name(String name) {
    
    this.name = name;
    return this;
  }

   /**
   * Key name.
   * @return name
  **/
  @ApiModelProperty(example = "Jim Smith's key", required = true, value = "Key name.")

  public String getName() {
    return name;
  }


  public void setName(String name) {
    this.name = name;
  }


  public KeyGet expiration(Long expiration) {
    
    this.expiration = expiration;
    return this;
  }

   /**
   * Key expiration date (Unix ms timestamp).&lt;br&gt; Note that the field is not returned if the key has no expiration date. 
   * @return expiration
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "1569542400000", value = "Key expiration date (Unix ms timestamp).<br> Note that the field is not returned if the key has no expiration date. ")

  public Long getExpiration() {
    return expiration;
  }


  public void setExpiration(Long expiration) {
    this.expiration = expiration;
  }


  public KeyGet status(KeyStatusEnum status) {
    
    this.status = status;
    return this;
  }

   /**
   * Get status
   * @return status
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(value = "")

  public KeyStatusEnum getStatus() {
    return status;
  }


  public void setStatus(KeyStatusEnum status) {
    this.status = status;
  }


   /**
   * Key identifier (allocated by the platform).
   * @return id
  **/
  @javax.annotation.Nullable
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
  @javax.annotation.Nullable
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
  @javax.annotation.Nullable
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
  @javax.annotation.Nullable
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
  @javax.annotation.Nullable
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
   * Indicates whether the key has expired or not.&lt;br&gt; Note that the field is not returned if the key has not expired. 
   * @return expired
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "false", value = "Indicates whether the key has expired or not.<br> Note that the field is not returned if the key has not expired. ")

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
   * Key revocation date (Unix ms timestamp).&lt;br&gt; Note that the field is not returned if the key has no revocation date. 
   * @return revokedAt
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "1569542400000", value = "Key revocation date (Unix ms timestamp).<br> Note that the field is not returned if the key has no revocation date. ")

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
   * Date of last usage (Unix ms timestamp).
   * @return lastUsed
  **/
  @javax.annotation.Nullable
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
    return Objects.equals(this.name, keyGet.name) &&
        Objects.equals(this.expiration, keyGet.expiration) &&
        Objects.equals(this.status, keyGet.status) &&
        Objects.equals(this.id, keyGet.id) &&
        Objects.equals(this.pubKey, keyGet.pubKey) &&
        Objects.equals(this.type, keyGet.type) &&
        Objects.equals(this.holder, keyGet.holder) &&
        Objects.equals(this.device, keyGet.device) &&
        Objects.equals(this.expired, keyGet.expired) &&
        Objects.equals(this.revokedAt, keyGet.revokedAt) &&
        Objects.equals(this.createdAt, keyGet.createdAt) &&
        Objects.equals(this.updatedAt, keyGet.updatedAt) &&
        Objects.equals(this.lastUsed, keyGet.lastUsed);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, expiration, status, id, pubKey, type, holder, device, expired, revokedAt, createdAt, updatedAt, lastUsed);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class KeyGet {\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    expiration: ").append(toIndentedString(expiration)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
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

