/*
 * Woleet.ID Server
 * This is Woleet.ID Server API documentation.
 *
 * The version of the OpenAPI document: 1.2.3
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
 * The type of device storing the key.&lt;br&gt; - &#x60;server&#x60;: Woleet.ID Server or equivalent&lt;br&gt; - &#x60;mobile&#x60;: Woleet.ID Mobile or equivalent&lt;br&gt; - &#x60;nano&#x60;: Ledger Nano S or equivalent 
 */
@JsonAdapter(KeyDeviceEnum.Adapter.class)
public enum KeyDeviceEnum {
  
  SERVER("server"),
  
  MOBILE("mobile"),
  
  NANO("nano");

  private String value;

  KeyDeviceEnum(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
    return String.valueOf(value);
  }

  public static KeyDeviceEnum fromValue(String value) {
    for (KeyDeviceEnum b : KeyDeviceEnum.values()) {
      if (b.value.equals(value)) {
        return b;
      }
    }
    throw new IllegalArgumentException("Unexpected value '" + value + "'");
  }

  public static class Adapter extends TypeAdapter<KeyDeviceEnum> {
    @Override
    public void write(final JsonWriter jsonWriter, final KeyDeviceEnum enumeration) throws IOException {
      jsonWriter.value(enumeration.getValue());
    }

    @Override
    public KeyDeviceEnum read(final JsonReader jsonReader) throws IOException {
      String value = jsonReader.nextString();
      return KeyDeviceEnum.fromValue(value);
    }
  }
}

