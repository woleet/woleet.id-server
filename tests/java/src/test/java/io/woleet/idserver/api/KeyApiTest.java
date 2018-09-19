package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;

import java.util.ArrayList;
import java.util.UUID;

import static org.junit.Assert.*;

public class KeyApiTest extends CRUDApiTest {

    class Api implements CRUDApiTest.Api {

        KeyApi keyApi;

        Api(KeyApi keyApi) {
            this.keyApi = keyApi;
        }

        @Override
        public ObjectArray getAllObjects(boolean full) throws ApiException {

            // This code is called before setUp() is called, so user can be null
            if (user == null)
                return new ObjectArray(new KeyArray());

            return new ObjectArray(keyApi.getAllUserKeys(user.getId(), full));
        }

        @Override
        public CRUDApiTest.ObjectGet deleteObject(UUID id) throws ApiException {
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

            // Set status and name
            keyPost.setStatus(KeyStatusEnum.ACTIVE);
            keyPost.setName(Config.randomName());

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
            keyPut.setStatus(KeyStatusEnum.BLOCKED);
            keyPut.setName(Config.randomName());
        }
    }

    class ObjectArray extends CRUDApiTest.ObjectArray<KeyArray> {

        KeyArray keyArray;

        ObjectArray(KeyArray keyArray) {
            this.keyArray = keyArray;
        }

        @Override
        public boolean contains(CRUDApiTest.ObjectGet object) {
            return keyArray.contains(object.get());
        }

        @Override
        public CRUDApiTest.ObjectGet[] getArray() {
            ArrayList<ObjectGet> objectGetArray = new ArrayList<>();
            for (KeyGet key : keyArray)
                objectGetArray.add(new ObjectGet(key));
            return objectGetArray.toArray(new ObjectGet[0]);
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
    void verifyObject(CRUDApiTest.ObjectGet objectGet) {
        KeyGet key = (KeyGet) objectGet.get();
        assertNotNull(key.getId());
        assertNotNull(key.getCreatedAt());
        assertTrue(key.getCreatedAt() <= key.getUpdatedAt());
        assertNull(key.getDeletedAt());
    }

    @Override
    void verifyObjectsEquals(CRUDApiTest.ObjectPost pExpected, CRUDApiTest.ObjectGet pActual) {
        KeyPost expected = (KeyPost) pExpected.get();
        KeyGet actual = (KeyGet) pActual.get();
        assertEquals(expected.getStatus(), actual.getStatus());
        assertEquals(expected.getName(), actual.getName());
    }

    @Override
    void verifyObjectUpdated(CRUDApiTest.ObjectPut pDiff, CRUDApiTest.ObjectPost pExpected, CRUDApiTest.ObjectGet pActual) {
        KeyPut diff = (KeyPut) pDiff.get();
        KeyPost expected = (KeyPost) pExpected.get();
        KeyGet actual = (KeyGet) pActual.get();
        assertEquals(diff.getStatus() != null ? diff.getStatus() : expected.getStatus(), actual.getStatus());
        assertEquals(diff.getName() != null ? diff.getName() : expected.getName(), actual.getName());
    }
}
