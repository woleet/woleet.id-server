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
import com.google.gson.TypeAdapter;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.woleet.idserver.api.model.FullIdentityAllOf;
import io.woleet.idserver.api.model.Identity;
import java.io.IOException;

/**
 * FullIdentity
 */

public class FullIdentity {
  public static final String SERIALIZED_NAME_COMMON_NAME = "commonName";
  @SerializedName(SERIALIZED_NAME_COMMON_NAME)
  private String commonName;

  public static final String SERIALIZED_NAME_ORGANIZATION = "organization";
  @SerializedName(SERIALIZED_NAME_ORGANIZATION)
  private String organization;

  public static final String SERIALIZED_NAME_ORGANIZATIONAL_UNIT = "organizationalUnit";
  @SerializedName(SERIALIZED_NAME_ORGANIZATIONAL_UNIT)
  private String organizationalUnit;

  public static final String SERIALIZED_NAME_LOCALITY = "locality";
  @SerializedName(SERIALIZED_NAME_LOCALITY)
  private String locality;

  public static final String SERIALIZED_NAME_COUNTRY = "country";
  @SerializedName(SERIALIZED_NAME_COUNTRY)
  private String country;

  public static final String SERIALIZED_NAME_USER_ID = "userId";
  @SerializedName(SERIALIZED_NAME_USER_ID)
  private String userId;


  public FullIdentity commonName(String commonName) {
    
    this.commonName = commonName;
    return this;
  }

   /**
   * Common name (CN) (2.5.4.3)
   * @return commonName
  **/
  @ApiModelProperty(example = "Jim Smith", required = true, value = "Common name (CN) (2.5.4.3)")

  public String getCommonName() {
    return commonName;
  }


  public void setCommonName(String commonName) {
    this.commonName = commonName;
  }


  public FullIdentity organization(String organization) {
    
    this.organization = organization;
    return this;
  }

   /**
   * Organization name (O) (2.5.4.10)
   * @return organization
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "Woleet", value = "Organization name (O) (2.5.4.10)")

  public String getOrganization() {
    return organization;
  }


  public void setOrganization(String organization) {
    this.organization = organization;
  }


  public FullIdentity organizationalUnit(String organizationalUnit) {
    
    this.organizationalUnit = organizationalUnit;
    return this;
  }

   /**
   * Organizational unit name (OU) (2.5.4.11)
   * @return organizationalUnit
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "Sales", value = "Organizational unit name (OU) (2.5.4.11)")

  public String getOrganizationalUnit() {
    return organizationalUnit;
  }


  public void setOrganizationalUnit(String organizationalUnit) {
    this.organizationalUnit = organizationalUnit;
  }


  public FullIdentity locality(String locality) {
    
    this.locality = locality;
    return this;
  }

   /**
   * Locality name (L) (2.5.4.7)
   * @return locality
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "Rennes", value = "Locality name (L) (2.5.4.7)")

  public String getLocality() {
    return locality;
  }


  public void setLocality(String locality) {
    this.locality = locality;
  }


  public FullIdentity country(String country) {
    
    this.country = country;
    return this;
  }

   /**
   * Country code (C) (2.5.4.6)
   * @return country
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "FR", value = "Country code (C) (2.5.4.6)")

  public String getCountry() {
    return country;
  }


  public void setCountry(String country) {
    this.country = country;
  }


  public FullIdentity userId(String userId) {
    
    this.userId = userId;
    return this;
  }

   /**
   * Custom user identifier (UID) (0.9.2342.19200300.100.1.1) must be unique for each user.
   * @return userId
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "wol.jim-smith.01", value = "Custom user identifier (UID) (0.9.2342.19200300.100.1.1) must be unique for each user.")

  public String getUserId() {
    return userId;
  }


  public void setUserId(String userId) {
    this.userId = userId;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    FullIdentity fullIdentity = (FullIdentity) o;
    return Objects.equals(this.commonName, fullIdentity.commonName) &&
        Objects.equals(this.organization, fullIdentity.organization) &&
        Objects.equals(this.organizationalUnit, fullIdentity.organizationalUnit) &&
        Objects.equals(this.locality, fullIdentity.locality) &&
        Objects.equals(this.country, fullIdentity.country) &&
        Objects.equals(this.userId, fullIdentity.userId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(commonName, organization, organizationalUnit, locality, country, userId);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class FullIdentity {\n");
    sb.append("    commonName: ").append(toIndentedString(commonName)).append("\n");
    sb.append("    organization: ").append(toIndentedString(organization)).append("\n");
    sb.append("    organizationalUnit: ").append(toIndentedString(organizationalUnit)).append("\n");
    sb.append("    locality: ").append(toIndentedString(locality)).append("\n");
    sb.append("    country: ").append(toIndentedString(country)).append("\n");
    sb.append("    userId: ").append(toIndentedString(userId)).append("\n");
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

