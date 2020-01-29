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
 * User mode.&lt;br&gt; - &#x60;esign&#x60;: the user is a regular user, and his keys are used to create electronic signatures.&lt;br&gt; - &#x60;seal&#x60;: the user represents a legal entity, and his keys are used to create server seals. 
 */
@JsonAdapter(UserModeEnum.Adapter.class)
public enum UserModeEnum {
  
  SEAL("seal"),
  
  ESIGN("esign");

  private String value;

  UserModeEnum(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
    return String.valueOf(value);
  }

  public static UserModeEnum fromValue(String value) {
    for (UserModeEnum b : UserModeEnum.values()) {
      if (b.value.equals(value)) {
        return b;
      }
    }
    throw new IllegalArgumentException("Unexpected value '" + value + "'");
  }

  public static class Adapter extends TypeAdapter<UserModeEnum> {
    @Override
    public void write(final JsonWriter jsonWriter, final UserModeEnum enumeration) throws IOException {
      jsonWriter.value(enumeration.getValue());
    }

    @Override
    public UserModeEnum read(final JsonReader jsonReader) throws IOException {
      String value = jsonReader.nextString();
      return UserModeEnum.fromValue(value);
    }
  }
}

