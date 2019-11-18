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
import java.io.IOException;

/**
 * Key information.
 */
@ApiModel(description = "Key information.")

public class Key {
  public static final String SERIALIZED_NAME_NAME = "name";
  @SerializedName(SERIALIZED_NAME_NAME)
  private String name;

  public static final String SERIALIZED_NAME_PUB_KEY = "pubKey";
  @SerializedName(SERIALIZED_NAME_PUB_KEY)
  private String pubKey;

  /**
   * Key status.
   */
  @JsonAdapter(StatusEnum.Adapter.class)
  public enum StatusEnum {
    VALID("valid"),
    
    EXPIRED("expired"),
    
    REVOKED("revoked");

    private String value;

    StatusEnum(String value) {
      this.value = value;
    }

    public String getValue() {
      return value;
    }

    @Override
    public String toString() {
      return String.valueOf(value);
    }

    public static StatusEnum fromValue(String value) {
      for (StatusEnum b : StatusEnum.values()) {
        if (b.value.equals(value)) {
          return b;
        }
      }
      throw new IllegalArgumentException("Unexpected value '" + value + "'");
    }

    public static class Adapter extends TypeAdapter<StatusEnum> {
      @Override
      public void write(final JsonWriter jsonWriter, final StatusEnum enumeration) throws IOException {
        jsonWriter.value(enumeration.getValue());
      }

      @Override
      public StatusEnum read(final JsonReader jsonReader) throws IOException {
        String value =  jsonReader.nextString();
        return StatusEnum.fromValue(value);
      }
    }
  }

  public static final String SERIALIZED_NAME_STATUS = "status";
  @SerializedName(SERIALIZED_NAME_STATUS)
  private StatusEnum status;

  public static final String SERIALIZED_NAME_EXPIRATION = "expiration";
  @SerializedName(SERIALIZED_NAME_EXPIRATION)
  private Long expiration;

  public static final String SERIALIZED_NAME_REVOKED_AT = "revokedAt";
  @SerializedName(SERIALIZED_NAME_REVOKED_AT)
  private Long revokedAt;


  public Key name(String name) {
    
    this.name = name;
    return this;
  }

   /**
   * Key name.
   * @return name
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "Jim Smith's key", value = "Key name.")

  public String getName() {
    return name;
  }



  public void setName(String name) {
    this.name = name;
  }


  public Key pubKey(String pubKey) {
    
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


  public Key status(StatusEnum status) {
    
    this.status = status;
    return this;
  }

   /**
   * Key status.
   * @return status
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "valid", value = "Key status.")

  public StatusEnum getStatus() {
    return status;
  }



  public void setStatus(StatusEnum status) {
    this.status = status;
  }


  public Key expiration(Long expiration) {
    
    this.expiration = expiration;
    return this;
  }

   /**
   * Key expiration date (Unix ms timestamp). &lt;br&gt;Note that the field is not returned if the key has no expiration date. 
   * @return expiration
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "1569542400000", value = "Key expiration date (Unix ms timestamp). <br>Note that the field is not returned if the key has no expiration date. ")

  public Long getExpiration() {
    return expiration;
  }



  public void setExpiration(Long expiration) {
    this.expiration = expiration;
  }


  public Key revokedAt(Long revokedAt) {
    
    this.revokedAt = revokedAt;
    return this;
  }

   /**
   * Key revocation date (Unix ms timestamp). &lt;br&gt;Note that the field is not returned if the key is not yet revoked. 
   * @return revokedAt
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "1569542400000", value = "Key revocation date (Unix ms timestamp). <br>Note that the field is not returned if the key is not yet revoked. ")

  public Long getRevokedAt() {
    return revokedAt;
  }



  public void setRevokedAt(Long revokedAt) {
    this.revokedAt = revokedAt;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Key key = (Key) o;
    return Objects.equals(this.name, key.name) &&
        Objects.equals(this.pubKey, key.pubKey) &&
        Objects.equals(this.status, key.status) &&
        Objects.equals(this.expiration, key.expiration) &&
        Objects.equals(this.revokedAt, key.revokedAt);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, pubKey, status, expiration, revokedAt);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Key {\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    pubKey: ").append(toIndentedString(pubKey)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
    sb.append("    expiration: ").append(toIndentedString(expiration)).append("\n");
    sb.append("    revokedAt: ").append(toIndentedString(revokedAt)).append("\n");
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

