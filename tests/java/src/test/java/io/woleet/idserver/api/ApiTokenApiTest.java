package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;

import java.util.ArrayList;
import java.util.UUID;

import static org.junit.Assert.*;

public class ApiTokenApiTest extends CRUDApiTest {

    class Api implements CRUDApiTest.Api {

        ApiTokenApi apiTokenApi;

        Api(ApiTokenApi apiTokenApi) {
            this.apiTokenApi = apiTokenApi;
        }

        @Override
        public ObjectArray getAllObjects(boolean full) throws ApiException {
            return new ObjectArray(apiTokenApi.getAllAPITokens(full));
        }

        @Override
        public CRUDApiTest.ObjectGet deleteObject(UUID id) throws ApiException {
            return new ObjectGet(apiTokenApi.deleteAPIToken(id));
        }

        @Override
        public ObjectGet createObject(CRUDApiTest.ObjectPost objectPost) throws ApiException {
            return new ObjectGet(apiTokenApi.createAPIToken((APITokenPost) objectPost.get()));
        }

        @Override
        public ObjectGet getObjectById(UUID id) throws ApiException {
            return new ObjectGet(apiTokenApi.getAPITokenById(id));
        }

        @Override
        public ObjectGet updateObject(UUID id, CRUDApiTest.ObjectPut objectPut) throws ApiException {
            return new ObjectGet(apiTokenApi.updateAPIToken(id, (APITokenPut) objectPut.get()));
        }
    }

    class ObjectGet extends CRUDApiTest.ObjectGet<APITokenGet> {

        ObjectGet(APITokenGet apiToken) {
            super(apiToken);
        }

        @Override
        public String getName() {
            return ((APITokenBase) objectBase).getName();
        }

        @Override
        public UUID getId() {
            return ((APITokenGet) objectBase).getId();
        }
    }

    class ObjectPost extends CRUDApiTest.ObjectPost<APITokenPost> {

        ObjectPost(APITokenPost apiTokenPost) {
            super(apiTokenPost);
        }

        @Override
        CRUDApiTest.ObjectPost setMinimalAttributes() {
            APITokenPost apiTokenPost = (APITokenPost) objectBase;
            apiTokenPost.name(Config.randomName());
            return new ObjectPost(apiTokenPost);
        }

        @Override
        CRUDApiTest.ObjectPost setFullAttributes() {
            APITokenPost apiTokenPost = (APITokenPost) objectBase;

            // Set status and name
            apiTokenPost.setStatus(APITokenStatusEnum.ACTIVE);
            apiTokenPost.setName(Config.randomName());

            return new ObjectPost(apiTokenPost);
        }
    }

    class ObjectPut extends CRUDApiTest.ObjectPut<APITokenPut> {

        ObjectPut(APITokenPut apiTokenPut) {
            super(apiTokenPut);
        }

        @Override
        public void update() {
            APITokenPut apiTokenPut = (APITokenPut) objectBase;
            if (Config.randomBoolean())
                apiTokenPut.status(APITokenStatusEnum.BLOCKED);
            if (Config.randomBoolean())
                apiTokenPut.name(Config.randomName());
        }
    }

    class ObjectArray extends CRUDApiTest.ObjectArray<APITokenArray> {

        APITokenArray apiTokenArray;

        ObjectArray(APITokenArray apiTokenArray) {
            this.apiTokenArray = apiTokenArray;
        }

        @Override
        public boolean contains(CRUDApiTest.ObjectGet object) {
            return apiTokenArray.contains(object.get());
        }

        @Override
        public CRUDApiTest.ObjectGet[] getArray() {
            ArrayList<ObjectGet> objectGetArray = new ArrayList<>();
            for (APITokenGet apiToken : apiTokenArray)
                objectGetArray.add(new ObjectGet(apiToken));
            return objectGetArray.toArray(new ObjectGet[0]);
        }
    }

    @Override
    String getTestObjectsNamePrefix() {
        return "#tester#-";
    }

    @Override
    Api newApi(ApiClient apiClient) {
        return new Api(new ApiTokenApi(apiClient));
    }

    @Override
    ObjectPost newObjectPost() {
        return new ObjectPost(new APITokenPost());
    }

    @Override
    ObjectPut newObjectPut() {
        return new ObjectPut(new APITokenPut());
    }

    @Override
    void verifyObjectValid(CRUDApiTest.ObjectGet objectGet) {
        APITokenGet apiToken = (APITokenGet) objectGet.get();
        assertNotNull(apiToken.getId());
        assertNotNull(apiToken.getCreatedAt());
        assertTrue(apiToken.getCreatedAt() <= apiToken.getUpdatedAt());
        assertNull(apiToken.getDeletedAt());
    }

    @Override
    void verifyObjectsEquals(CRUDApiTest.ObjectPost pExpected, CRUDApiTest.ObjectGet pActual) {
        APITokenPost expected = (APITokenPost) pExpected.get();
        APITokenGet actual = (APITokenGet) pActual.get();
        assertEquals(expected.getStatus(), actual.getStatus());
        assertEquals(expected.getName(), actual.getName());
    }

    @Override
    void verifyObjectUpdated(CRUDApiTest.ObjectPut pDiff, CRUDApiTest.ObjectPost pExpected, CRUDApiTest.ObjectGet pActual) {
        APITokenPut diff = (APITokenPut) pDiff.get();
        APITokenPost expected = (APITokenPost) pExpected.get();
        APITokenGet actual = (APITokenGet) pActual.get();
        assertEquals(diff.getStatus() != null ? diff.getStatus() : expected.getStatus(), actual.getStatus());
        assertEquals(diff.getName() != null ? diff.getName() : expected.getName(), actual.getName());
    }
}
