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
import io.swagger.annotations.ApiModel;
import com.google.gson.annotations.SerializedName;

import java.io.IOException;
import com.google.gson.TypeAdapter;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

/**
 * The status of the key:&lt;br&gt; - &#x60;active&#x60;: the key is active: it can be used to sign&lt;br&gt; - &#x60;blocked&#x60;: the key is blocked: it cannot be used to sign&lt;br&gt; - &#x60;revoked&#x60; the key is revoked: it will no longer be used to sign 
 */
@JsonAdapter(KeyStatusEnum.Adapter.class)
public enum KeyStatusEnum {
  
  ACTIVE("active"),
  
  BLOCKED("blocked"),
  
  REVOKED("revoked");

  private String value;

  KeyStatusEnum(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
    return String.valueOf(value);
  }

  public static KeyStatusEnum fromValue(String value) {
    for (KeyStatusEnum b : KeyStatusEnum.values()) {
      if (b.value.equals(value)) {
        return b;
      }
    }
    throw new IllegalArgumentException("Unexpected value '" + value + "'");
  }

  public static class Adapter extends TypeAdapter<KeyStatusEnum> {
    @Override
    public void write(final JsonWriter jsonWriter, final KeyStatusEnum enumeration) throws IOException {
      jsonWriter.value(enumeration.getValue());
    }

    @Override
    public KeyStatusEnum read(final JsonReader jsonReader) throws IOException {
      String value = jsonReader.nextString();
      return KeyStatusEnum.fromValue(value);
    }
  }
}

