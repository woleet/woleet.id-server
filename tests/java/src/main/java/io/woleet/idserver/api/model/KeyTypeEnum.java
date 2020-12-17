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
import io.swagger.annotations.ApiModel;
import com.google.gson.annotations.SerializedName;

import java.io.IOException;
import com.google.gson.TypeAdapter;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

/**
 * The type of the key (only &#x60;bip39&#x60; is supported).&lt;br&gt; - &#x60;bip39&#x60;: Bitcoin BIP39 
 */
@JsonAdapter(KeyTypeEnum.Adapter.class)
public enum KeyTypeEnum {
  
  BIP39("bip39");

  private String value;

  KeyTypeEnum(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
    return String.valueOf(value);
  }

  public static KeyTypeEnum fromValue(String value) {
    for (KeyTypeEnum b : KeyTypeEnum.values()) {
      if (b.value.equals(value)) {
        return b;
      }
    }
    throw new IllegalArgumentException("Unexpected value '" + value + "'");
  }

  public static class Adapter extends TypeAdapter<KeyTypeEnum> {
    @Override
    public void write(final JsonWriter jsonWriter, final KeyTypeEnum enumeration) throws IOException {
      jsonWriter.value(enumeration.getValue());
    }

    @Override
    public KeyTypeEnum read(final JsonReader jsonReader) throws IOException {
      String value = jsonReader.nextString();
      return KeyTypeEnum.fromValue(value);
    }
  }
}

