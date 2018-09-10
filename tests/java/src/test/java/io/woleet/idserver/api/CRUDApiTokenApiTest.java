package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;

import java.util.ArrayList;
import java.util.UUID;

public class CRUDApiTokenApiTest extends CRUDApiTest {

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

    class ObjectGet extends CRUDApiTest.ObjectGet<APIToken> {

        ObjectGet(APIToken apiToken) {
            super(apiToken);
        }

        @Override
        public String getName() {
            return ((APITokenBase) objectBase).getName();
        }

        @Override
        public UUID getId() {
            return ((APIToken) objectBase).getId();
        }
    }

    class ObjectPost extends CRUDApiTest.ObjectPost<APITokenPost> {

        ObjectPost(APITokenPost apiTokenPost) {
            super(apiTokenPost);
        }

        @Override
        CRUDApiTest.ObjectPost name(String name) {
            return new ObjectPost((APITokenPost) ((APITokenBase) objectBase).name(name));
        }

        @Override
        CRUDApiTest.ObjectPost setMinimalAttributes() {
            APITokenPost apiTokenPost = (APITokenPost) objectBase;
            apiTokenPost.name(Config.randomName());
            return new ObjectPost(apiTokenPost);
        }

        @Override
        CRUDApiTest.ObjectPost setFullAttributes() {
            // TODO
            return setMinimalAttributes();
        }
    }

    class ObjectPut extends CRUDApiTest.ObjectPut<APITokenPut> {

        ObjectPut(APITokenPut apiTokenPut) {
            super(apiTokenPut);
        }

        @Override
        public void update() {
            APITokenPut apiTokenPut = (APITokenPut) objectBase;
            apiTokenPut.status(APITokenStatusEnum.BLOCKED);
            apiTokenPut.name(Config.randomName());
        }

        @Override
        CRUDApiTest.ObjectPost name(String name) {
            return ((ObjectPut) objectBase).name(name);
        }

        @Override
        CRUDApiTest.ObjectPost setMinimalAttributes() {
            return ((ObjectPut) objectBase).setMinimalAttributes();
        }

        @Override
        CRUDApiTest.ObjectPost setFullAttributes() {
            return ((ObjectPut) objectBase).setFullAttributes();
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
            for (APIToken apiToken : apiTokenArray)
                objectGetArray.add(new ObjectGet(apiToken));
            return objectGetArray.toArray(new ObjectGet[0]);
        }
    }

    @Override
    String TEST_OBJECTS_NAME_PREFIX() {
        return Config.TEST_APITOKENS_NAME_PREFIX;
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
    void verifyObject(CRUDApiTest.ObjectGet objectGet) {
        // TODO
    }

    @Override
    void verifyObjectsEquals(CRUDApiTest.ObjectPost expected, CRUDApiTest.ObjectGet actual) {
        // TODO
    }
}
