package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;

import java.util.ArrayList;
import java.util.UUID;

import static org.junit.Assert.*;

public class UserApiTest extends CRUDApiTest {

    class Api implements CRUDApiTest.Api {

        UserApi userApi;

        Api(UserApi userApi) {
            this.userApi = userApi;
        }

        @Override
        public ObjectArray getAllObjects(boolean full) throws ApiException {
            return new ObjectArray(userApi.getAllUsers(full));
        }

        @Override
        public CRUDApiTest.ObjectGet deleteObject(UUID id) throws ApiException {
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
            FullIdentity fullIdentity = new FullIdentity();
            fullIdentity.commonName(COMMON_NAME);
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
            userPut.setStatus(UserStatusEnum.BLOCKED);
            userPut.setRole(UserRoleEnum.ADMIN);

            // Set login information
            String USERNAME = Config.randomUsername();
            String EMAIL = USERNAME + "@woleet.com";
            userPut.email(EMAIL).username(USERNAME);
            String PASSWORD = Config.randomHash();
            userPut.password(PASSWORD);

            // Set identity information
            String COMMON_NAME = Config.randomCommonName();
            String ORGANIZATION = Config.randomName();
            String ORGANIZATIONAL_UNIT = Config.randomName();
            String LOCALITY = Config.randomName();
            String COUNTRY = "US";
            String USER_ID = Config.randomUUID().toString();
            FullIdentity fullIdentity = new FullIdentity();
            fullIdentity
                    .userId(USER_ID)
                    .commonName(COMMON_NAME)
                    .organizationalUnit(ORGANIZATIONAL_UNIT)
                    .locality(LOCALITY)
                    .organization(ORGANIZATION)
                    .country(COUNTRY);
            userPut.identity(fullIdentity);
        }
    }

    class ObjectArray extends CRUDApiTest.ObjectArray<UserArray> {

        UserArray userArray;

        ObjectArray(UserArray userArray) {
            this.userArray = userArray;
        }

        @Override
        public boolean contains(CRUDApiTest.ObjectGet object) {
            return userArray.contains(object.get());
        }

        @Override
        public CRUDApiTest.ObjectGet[] getArray() {
            ArrayList<ObjectGet> objectGetArray = new ArrayList<>();
            for (UserGet user : userArray)
                objectGetArray.add(new ObjectGet(user));
            return objectGetArray.toArray(new ObjectGet[0]);
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
    void verifyObject(CRUDApiTest.ObjectGet objectGet) {
        UserGet user = (UserGet) objectGet.get();
        assertNotNull(user.getId());
        assertNotNull(user.getCreatedAt());
        assertTrue(user.getCreatedAt() <= user.getUpdatedAt());
        assertNull(user.getLastLogin());
        assertNull(user.getDeletedAt());
        assertNotNull(user.getDefaultKeyId());
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
    }

    @Override
    void verifyObjectUpdated(CRUDApiTest.ObjectPut pDiff, CRUDApiTest.ObjectPost pExpected, CRUDApiTest.ObjectGet pActual) {
        UserPut diff = (UserPut) pDiff.get();
        UserPost expected = (UserPost) pExpected.get();
        UserGet actual = (UserGet) pActual.get();
        assertEquals(diff.getStatus() != null ? diff.getStatus() : expected.getStatus(), actual.getStatus());
        assertEquals(diff.getRole() != null ? diff.getRole() : expected.getRole(), actual.getRole());
        assertEquals(diff.getUsername() != null ? diff.getUsername() : expected.getUsername(), actual.getUsername());
        assertEquals(diff.getEmail() != null ? diff.getEmail() : expected.getEmail(), actual.getEmail());
        if (diff.getIdentity() != null) {
            FullIdentity d = diff.getIdentity();
            FullIdentity e = expected.getIdentity();
            FullIdentity a = actual.getIdentity();
            assertEquals(d.getUserId() != null ? d.getUserId() : e.getUserId(), a.getUserId());
            assertEquals(d.getCommonName() != null ? d.getCommonName() : e.getCommonName(), a.getCommonName());
            assertEquals(d.getCountry() != null ? d.getCountry() : e.getCountry(), a.getCountry());
            assertEquals(d.getLocality() != null ? d.getLocality() : e.getLocality(), a.getLocality());
            assertEquals(d.getOrganization() != null ? d.getOrganization() : e.getOrganization(), a.getOrganization());
            assertEquals(d.getOrganizationalUnit() != null ? d.getOrganizationalUnit() : e.getOrganizationalUnit(),
                    a.getOrganizationalUnit());
        } else
            assertEquals(expected.getIdentity(), actual.getIdentity());
    }
}
