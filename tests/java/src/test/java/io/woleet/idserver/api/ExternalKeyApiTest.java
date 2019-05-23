package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.Assert.*;

public class ExternalKeyApiTest extends CRUDApiTest {

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
                list.add(new ExternalKeyApiTest.ObjectGet(keyGet));
            return list;
        }

        @Override
        public ObjectGet deleteObject(UUID id) throws ApiException {
            return new ObjectGet(keyApi.deleteKey(id));
        }

        @Override
        public ObjectGet createObject(CRUDApiTest.ObjectPost objectPost) throws ApiException {
            return new ObjectGet(keyApi.createExternalKey(user.getId(), (ExternalKeyPost) objectPost.get()));
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
            return ((KeyGet) objectBase).getName();
        }

        @Override
        public UUID getId() {
            return ((KeyGet) objectBase).getId();
        }
    }

    class ObjectPost extends CRUDApiTest.ObjectPost<ExternalKeyPost> {

        ObjectPost(ExternalKeyPost keyPost) {
            super(keyPost);
        }

        @Override
        CRUDApiTest.ObjectPost setMinimalAttributes() {
            ExternalKeyPost keyPost = (ExternalKeyPost) objectBase;
            keyPost.setName(Config.randomName());
            keyPost.setPublicKey(Config.randomAddress());
            return new ObjectPost(keyPost);
        }

        @Override
        CRUDApiTest.ObjectPost setFullAttributes() {
            ExternalKeyPost keyPost = (ExternalKeyPost) objectBase;

            // Set status and name
            keyPost.setStatus(KeyStatusEnum.ACTIVE);
            keyPost.setName(Config.randomName());
            keyPost.setPublicKey(Config.randomAddress());

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
                keyPut.setStatus(KeyStatusEnum.BLOCKED);
            if (Config.randomBoolean())
                keyPut.setName(Config.randomName());
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
        return new ObjectPost(new ExternalKeyPost());
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
        assertNull(key.getDeletedAt());

        assertNotNull(key.getName());
        assertNull(key.getLastUsed());
        assertNotNull(key.getPubKey());
        assertNotNull(key.getType());
        assertNotNull(key.getStatus());
    }

    @Override
    void verifyObjectsEquals(CRUDApiTest.ObjectPost pExpected, CRUDApiTest.ObjectGet pActual) {
        ExternalKeyPost expected = (ExternalKeyPost) pExpected.get();
        KeyGet actual = (KeyGet) pActual.get();
        assertEquals(expected.getPublicKey(), actual.getPubKey());
        assertEquals(expected.getName(), actual.getName());
    }

    @Override
    void verifyObjectUpdated(CRUDApiTest.ObjectPut pPut, CRUDApiTest.ObjectPost pPost, CRUDApiTest.ObjectGet pGet) {
        KeyPut put = (KeyPut) pPut.get();
        ExternalKeyPost post = (ExternalKeyPost) pPost.get();
        KeyGet get = (KeyGet) pGet.get();
        assertEquals(put.getStatus() != null ? put.getStatus() : post.getStatus(), get.getStatus());
        assertEquals(put.getName() != null ? put.getName() : post.getName(), get.getName());
    }
}
