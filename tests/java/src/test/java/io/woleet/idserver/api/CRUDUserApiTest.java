package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.Assert.*;

public class CRUDUserApiTest extends CRUDApiTest {

    class Api implements CRUDApiTest.Api {

        UserApi userApi;

        Api(UserApi userApi) {
            this.userApi = userApi;
        }

        @Override
        public List<CRUDApiTest.ObjectGet> getAllObjects() throws ApiException {
            List<CRUDApiTest.ObjectGet> list = new ArrayList<>();
            for (UserGet user : userApi.getAllUsers())
                list.add(new CRUDUserApiTest.ObjectGet(user));
            return list;
        }

        @Override
        public ObjectGet deleteObject(UUID id) throws ApiException {
            return new ObjectGet(userApi.deleteUser(id));
        }

        @Override
        public ObjectGet createObject(CRUDApiTest.ObjectPost objectPost) throws ApiException {
            return new ObjectGet(userApi.createUser((UserPost) objectPost.get()));
        }

        @Override
        public ObjectGet getObjectById(UUID id) throws ApiException {
            return new ObjectGet(userApi.getUserById(id));
        }

        @Override
        public ObjectGet updateObject(UUID id, CRUDApiTest.ObjectPut objectPut) throws ApiException {
            return new ObjectGet(userApi.updateUser(id, (UserPut) objectPut.get()));
        }
    }

    class ObjectGet extends CRUDApiTest.ObjectGet<UserGet> {

        ObjectGet(UserGet user) {
            super(user);
        }

        @Override
        public String getName() {
            return ((UserBase) objectBase).getIdentity().getCommonName();
        }

        @Override
        public UUID getId() {
            return ((UserGet) objectBase).getId();
        }
    }

    class ObjectPost extends CRUDApiTest.ObjectPost<UserPost> {

        ObjectPost(UserPost userPost) {
            super(userPost);
        }

        @Override
        CRUDApiTest.ObjectPost setMinimalAttributes() {
            UserPost userPost = (UserPost) objectBase;
            String COMMON_NAME = Config.randomCommonName();
            String ORGANIZATION = "Woleet SAS";
            FullIdentity fullIdentity = new FullIdentity();
            fullIdentity.commonName(COMMON_NAME);
            fullIdentity.organization(ORGANIZATION);
            userPost.identity(fullIdentity);
            return new ObjectPost(userPost);
        }

        @Override
        CRUDApiTest.ObjectPost setFullAttributes() {
            UserPost userPost = (UserPost) objectBase;

            // Set status and role
            userPost.setStatus(UserStatusEnum.ACTIVE);
            userPost.setRole(UserRoleEnum.USER);

            // Set login information
            String USERNAME = Config.randomUsername();
            String EMAIL = USERNAME + "@woleet.com";
            userPost.email(EMAIL).username(USERNAME);
            String PASSWORD = Config.randomHash();
            userPost.password(PASSWORD);
            String COUNTRYCALLINGCODE = "33";
            userPost.setCountryCallingCode(COUNTRYCALLINGCODE);
            String PHONE = "123456879";
            userPost.setPhone(PHONE);
            userPost.setMode(UserModeEnum.SEAL);

            // Set identity information
            String COMMON_NAME = Config.randomCommonName();
            String ORGANIZATION = "Woleet SAS";
            String ORGANIZATIONAL_UNIT = "Dev";
            String LOCALITY = "Rennes";
            String COUNTRY = "FR";
            String USER_ID = Config.randomUUID().toString();
            FullIdentity fullIdentity = new FullIdentity();
            fullIdentity
                    .userId(USER_ID)
                    .commonName(COMMON_NAME)
                    .organizationalUnit(ORGANIZATIONAL_UNIT)
                    .locality(LOCALITY)
                    .organization(ORGANIZATION)
                    .country(COUNTRY);
            userPost.identity(fullIdentity);

            return new ObjectPost(userPost);
        }
    }

    class ObjectPut extends CRUDApiTest.ObjectPut<UserPut> {

        ObjectPut(UserPut userPut) {
            super(userPut);
        }

        @Override
        public void update() {
            UserPut userPut = (UserPut) objectBase;

            // Set status and role
            if (Config.randomBoolean())
                userPut.setStatus(UserStatusEnum.BLOCKED);
            if (Config.randomBoolean())
                userPut.setRole(UserRoleEnum.ADMIN);

            // Set login information
            String USERNAME = Config.randomUsername();
            String EMAIL = USERNAME + "@woleet.com";
            String PASSWORD = Config.randomHash();
            String COUNTRYCALLINGCODE = "33";
            String PHONE = "123456879";
            if (Config.randomBoolean())
                userPut.username(USERNAME);
            if (Config.randomBoolean())
                userPut.email(EMAIL);
            if (Config.randomBoolean())
                userPut.password(PASSWORD);
            if (Config.randomBoolean())
                userPut.countryCallingCode(COUNTRYCALLINGCODE);
            if (Config.randomBoolean())
                userPut.phone(PHONE);

            // Set identity information
            String COMMON_NAME = Config.randomCommonName();
            String ORGANIZATION = Config.randomName();
            String ORGANIZATIONAL_UNIT = Config.randomName();
            String LOCALITY = Config.randomName();
            String COUNTRY = "US";
            String USER_ID = Config.randomUUID().toString();
            FullIdentity fullIdentity = new FullIdentity();
            if (Config.randomBoolean())
                fullIdentity.userId(USER_ID);
            if (Config.randomBoolean())
                fullIdentity.commonName(COMMON_NAME);
            if (Config.randomBoolean())
                fullIdentity.organizationalUnit(ORGANIZATIONAL_UNIT);
            if (Config.randomBoolean())
                fullIdentity.locality(LOCALITY);
            if (Config.randomBoolean())
                fullIdentity.organization(ORGANIZATION);
            if (Config.randomBoolean())
                fullIdentity.country(COUNTRY);
            userPut.identity(fullIdentity);
        }
    }

    @Override
    String getTestObjectsNamePrefix() {
        return Config.TEST_USERS_COMMONNAME_PREFIX;
    }

    @Override
    Api newApi(ApiClient apiClient) {
        return new Api(new UserApi(apiClient));
    }

    @Override
    ObjectPost newObjectPost() {
        return new ObjectPost(new UserPost());
    }

    @Override
    ObjectPut newObjectPut() {
        return new ObjectPut(new UserPut());
    }

    @Override
    void verifyObjectValid(CRUDApiTest.ObjectGet objectGet) {
        UserGet user = (UserGet) objectGet.get();
        assertNotNull(user.getId());
        assertNotNull(user.getCreatedAt());
        assertTrue(user.getCreatedAt() <= user.getUpdatedAt());
        assertNull(user.getLastLogin());
        assertNotNull(user.getIdentity().getCommonName());
        assertNull(user.getDefaultKeyId());
    }

    @Override
    void verifyObjectsEquals(CRUDApiTest.ObjectPost pExpected, CRUDApiTest.ObjectGet pActual) {
        UserPost expected = (UserPost) pExpected.get();
        UserGet actual = (UserGet) pActual.get();
        assertEquals(expected.getStatus(), actual.getStatus());
        assertEquals(expected.getRole(), actual.getRole());
        assertEquals(expected.getUsername(), actual.getUsername());
        assertEquals(expected.getEmail(), actual.getEmail());
        assertEquals(expected.getIdentity(), actual.getIdentity());
        assertEquals(expected.getCountryCallingCode(), actual.getCountryCallingCode());
        assertEquals(expected.getPhone(), actual.getPhone());
        assertEquals(expected.getMode(), actual.getMode());
    }

    @Override
    void verifyObjectUpdated(CRUDApiTest.ObjectPut pPut, CRUDApiTest.ObjectPost pPost, CRUDApiTest.ObjectGet pGet) {
        UserPut put = (UserPut) pPut.get();
        UserPost post = (UserPost) pPost.get();
        UserGet get = (UserGet) pGet.get();
        assertEquals(put.getStatus() != null ? put.getStatus() : post.getStatus(), get.getStatus());
        assertEquals(put.getRole() != null ? put.getRole() : post.getRole(), get.getRole());
        assertEquals(put.getUsername() != null ? put.getUsername() : post.getUsername(), get.getUsername());
        assertEquals(put.getEmail() != null ? put.getEmail() : post.getEmail(), get.getEmail());
        assertEquals(put.getCountryCallingCode() != null ? put.getCountryCallingCode() : post.getCountryCallingCode(),
                get.getCountryCallingCode());
        assertEquals(put.getPhone() != null ? put.getPhone() : post.getPhone(), get.getPhone());
        if (put.getIdentity() != null) {
            FullIdentity d = put.getIdentity();
            FullIdentity e = post.getIdentity();
            FullIdentity a = get.getIdentity();
            assertEquals(d.getUserId() != null ? d.getUserId() : e.getUserId(), a.getUserId());
            assertEquals(d.getCommonName() != null ? d.getCommonName() : e.getCommonName(), a.getCommonName());
            assertEquals(d.getCountry() != null ? d.getCountry() : e.getCountry(), a.getCountry());
            assertEquals(d.getLocality() != null ? d.getLocality() : e.getLocality(), a.getLocality());
            assertEquals(d.getOrganization() != null ? d.getOrganization() : e.getOrganization(), a.getOrganization());
            assertEquals(d.getOrganizationalUnit() != null ? d.getOrganizationalUnit() : e.getOrganizationalUnit(),
                    a.getOrganizationalUnit());
        } else
            assertEquals(post.getIdentity(), get.getIdentity());
    }
}
