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

public class KeyApiTest extends CRUDApiTest {

    class Api implements CRUDApiTest.Api {

        KeyApi keyApi;

        Api(KeyApi keyApi) {
            this.keyApi = keyApi;
        }

        @Override
        public List<CRUDApiTest.ObjectGet> getAllObjects() throws ApiException {

            // This code is called before setUp() is called, so user can be null
            if (user == null)
                return new ArrayList<>();

            List<CRUDApiTest.ObjectGet> list = new ArrayList<>();
            for (KeyGet keyGet : keyApi.getAllUserKeys(user.getId()))
                list.add(new KeyApiTest.ObjectGet(keyGet));
            return list;
        }

        @Override
        public ObjectGet deleteObject(UUID id) throws ApiException {
            return new ObjectGet(keyApi.deleteKey(id));
        }

        @Override
        public ObjectGet createObject(CRUDApiTest.ObjectPost objectPost) throws ApiException {
            return new ObjectGet(keyApi.createKey(user.getId(), (KeyPost) objectPost.get()));
        }

        @Override
        public ObjectGet getObjectById(UUID id) throws ApiException {
            return new ObjectGet(keyApi.getKeyById(id));
        }

        @Override
        public ObjectGet updateObject(UUID id, CRUDApiTest.ObjectPut objectPut) throws ApiException {
            return new ObjectGet(keyApi.updateKey(id, (KeyPut) objectPut.get()));
        }
    }

    class ObjectGet extends CRUDApiTest.ObjectGet<KeyGet> {

        ObjectGet(KeyGet key) {
            super(key);
        }

        @Override
        public String getName() {
            return ((KeyBase) objectBase).getName();
        }

        @Override
        public UUID getId() {
            return ((KeyGet) objectBase).getId();
        }
    }

    class ObjectPost extends CRUDApiTest.ObjectPost<KeyPost> {

        ObjectPost(KeyPost keyPost) {
            super(keyPost);
        }

        @Override
        CRUDApiTest.ObjectPost setMinimalAttributes() {
            KeyPost keyPost = (KeyPost) objectBase;
            keyPost.name(Config.randomName());
            return new ObjectPost(keyPost);
        }

        @Override
        CRUDApiTest.ObjectPost setFullAttributes() {
            KeyPost keyPost = (KeyPost) objectBase;
            keyPost.setName(Config.randomName());
            keyPost.setStatus(Config.randomBoolean() ? KeyStatusEnum.BLOCKED : KeyStatusEnum.ACTIVE);
            keyPost.setExpiration(Config.currentTimestamp() + 1000 * 60);
            return new ObjectPost(keyPost);
        }
    }

    class ObjectPut extends CRUDApiTest.ObjectPut<KeyPut> {

        ObjectPut(KeyPut keyPut) {
            super(keyPut);
        }

        @Override
        public void update() {
            KeyPut keyPut = (KeyPut) objectBase;
            if (Config.randomBoolean())
                keyPut.setName(Config.randomName());
            if (Config.randomBoolean())
                keyPut.setStatus(Config.randomBoolean() ? KeyStatusEnum.BLOCKED : KeyStatusEnum.ACTIVE);
            if (Config.randomBoolean())
                keyPut.setExpiration(Config.currentTimestamp());
        }
    }

    private UserGet user;

    @Override
    public void setUp() throws Exception {
        super.setUp();
        user = Config.createTestUser();
    }

    @Override
    String getTestObjectsNamePrefix() {
        return "#tester#-";
    }

    @Override
    Api newApi(ApiClient apiClient) {
        return new Api(new KeyApi(apiClient));
    }

    @Override
    ObjectPost newObjectPost() {
        return new ObjectPost(new KeyPost());
    }

    @Override
    ObjectPut newObjectPut() {
        return new ObjectPut(new KeyPut());
    }

    @Override
    void verifyObjectValid(CRUDApiTest.ObjectGet objectGet) {
        KeyGet key = (KeyGet) objectGet.get();
        assertNotNull(key.getId());
        assertNotNull(key.getCreatedAt());
        assertTrue(key.getCreatedAt() <= key.getUpdatedAt());
        assertNotNull(key.getName());
        assertNull(key.getLastUsed());
        assertNotNull(key.getPubKey());
        assertNotNull(key.getType());
        assertNotNull(key.getStatus());
        assertEquals(key.getHolder(), KeyHolderEnum.SERVER);
        assertEquals(key.getDevice(), KeyDeviceEnum.SERVER);
    }

    @Override
    void verifyObjectsEquals(CRUDApiTest.ObjectPost pExpected, CRUDApiTest.ObjectGet pActual) {
        KeyPost expected = (KeyPost) pExpected.get();
        KeyGet actual = (KeyGet) pActual.get();
        assertEquals(expected.getStatus(), actual.getStatus());
        assertEquals(expected.getName(), actual.getName());
        assertEquals(expected.getStatus(), actual.getStatus());
        assertEquals(expected.getExpiration(), actual.getExpiration());
    }

    @Override
    void verifyObjectUpdated(CRUDApiTest.ObjectPut pPut, CRUDApiTest.ObjectPost pPost, CRUDApiTest.ObjectGet pGet) {
        KeyPut put = (KeyPut) pPut.get();
        KeyPost post = (KeyPost) pPost.get();
        KeyGet get = (KeyGet) pGet.get();
        assertEquals(put.getName() != null ? put.getName() : post.getName(), get.getName());
        assertEquals(put.getStatus() != null ? put.getStatus() : post.getStatus(), get.getStatus());
        assertEquals(put.getExpiration() != null ? put.getExpiration() : post.getExpiration(), get.getExpiration());
    }

    @Test
    public void createExpiredKeyTest() throws ApiException {
        KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());

        KeyPost keyPost = new KeyPost();
        keyPost.setName(Config.randomName());
        keyPost.setExpiration(System.currentTimeMillis() - 1000);

        // Check that we cannot create an already expired key
        try {
            keyApi.createKey(user.getId(), keyPost);
            fail("Should not be able to create an already expired key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }
    }
}
