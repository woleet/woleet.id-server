package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.Assert.*;

public class ApiTokenApiTest extends CRUDApiTest {

    class Api implements CRUDApiTest.Api {

        ApiTokenApi apiTokenApi;

        Api(ApiTokenApi apiTokenApi) {
            this.apiTokenApi = apiTokenApi;
        }

        @Override
        public List<CRUDApiTest.ObjectGet> getAllObjects() throws ApiException {
            List<CRUDApiTest.ObjectGet> list = new ArrayList<>();
            for (APITokenGet apiTokenGet : apiTokenApi.getAllAPITokens())
                list.add(new ObjectGet(apiTokenGet));
            return list;
        }

        @Override
        public ObjectGet deleteObject(UUID id) throws ApiException {
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
            apiTokenPost.setUserId(user.getId());

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
        assertNotNull(apiToken.getName());
        assertNull(apiToken.getLastUsed());
        assertNotNull(apiToken.getValue());
        assertNotNull(apiToken.getStatus());
    }

    @Override
    void verifyObjectsEquals(CRUDApiTest.ObjectPost pExpected, CRUDApiTest.ObjectGet pActual) {
        APITokenPost expected = (APITokenPost) pExpected.get();
        APITokenGet actual = (APITokenGet) pActual.get();
        assertEquals(expected.getStatus(), actual.getStatus());
        assertEquals(expected.getName(), actual.getName());
    }

    @Override
    void verifyObjectUpdated(CRUDApiTest.ObjectPut pPut, CRUDApiTest.ObjectPost pPost, CRUDApiTest.ObjectGet pGet) {
        APITokenPut put = (APITokenPut) pPut.get();
        APITokenPost post = (APITokenPost) pPost.get();
        APITokenGet get = (APITokenGet) pGet.get();
        assertEquals(put.getStatus() != null ? put.getStatus() : post.getStatus(), get.getStatus());
        assertEquals(put.getName() != null ? put.getName() : post.getName(), get.getName());
    }
}
