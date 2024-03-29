package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class CRUDEnrollmentApiTest extends CRUDApiTest {

    class Api implements CRUDApiTest.Api {

        EnrollmentApi enrollmentApi;

        Api(EnrollmentApi enrollmentApi) {
            this.enrollmentApi = enrollmentApi;
        }

        @Override
        public List<CRUDApiTest.ObjectGet> getAllObjects() throws ApiException {

            // This code is called before setUp() is called, so user can be null
            if (user == null)
                return new ArrayList<>();

            List<CRUDApiTest.ObjectGet> list = new ArrayList<>();
            for (EnrollmentGet enrollmentGet : enrollmentApi.getEnrollments())
                list.add(new CRUDEnrollmentApiTest.ObjectGet(enrollmentGet));
            return list;
        }

        @Override
        public ObjectGet deleteObject(UUID id) throws ApiException {
            return new ObjectGet(enrollmentApi.deleteEnrollment(id));
        }

        @Override
        public ObjectGet createObject(CRUDApiTest.ObjectPost objectPost) throws ApiException {
            return new ObjectGet(enrollmentApi.createEnrollment((EnrollmentPost) objectPost.get()));
        }

        @Override
        public ObjectGet getObjectById(UUID id) throws ApiException {
            return new ObjectGet(enrollmentApi.getEnrollment(id));
        }

        @Override
        public ObjectGet updateObject(UUID id, CRUDApiTest.ObjectPut objectPut) throws ApiException {
            return new ObjectGet(enrollmentApi.updateEnrollment(id, (EnrollmentPut) objectPut.get()));
        }
    }

    class ObjectGet extends CRUDApiTest.ObjectGet<EnrollmentGet> {

        ObjectGet(EnrollmentGet key) {
            super(key);
        }

        @Override
        public String getName() {
            return ((EnrollmentGet) objectBase).getName();
        }

        @Override
        public UUID getId() {
            return ((EnrollmentGet) objectBase).getId();
        }
    }

    class ObjectPost extends CRUDApiTest.ObjectPost<EnrollmentPost> {

        ObjectPost(EnrollmentPost keyPost) {
            super(keyPost);
        }

        @Override
        CRUDApiTest.ObjectPost setMinimalAttributes() {
            EnrollmentPost enrollmentPost = (EnrollmentPost) objectBase;
            enrollmentPost.name(Config.randomName());
            enrollmentPost.setUserId(user.getId());
            enrollmentPost.setTest(true);
            return new ObjectPost(enrollmentPost);
        }

        @Override
        CRUDApiTest.ObjectPost setFullAttributes() {
            EnrollmentPost enrollmentPost = (EnrollmentPost) objectBase;

            // Set status and name
            enrollmentPost.setUserId(user.getId());
            enrollmentPost.setName(Config.randomName());
            enrollmentPost.setDevice(KeyDeviceEnum.NANO);
            enrollmentPost.setTest(true);
            enrollmentPost.setExpiration(Config.currentTimestamp() + 1000 * 60);
            enrollmentPost.setKeyExpiration(Config.currentTimestamp() + 1000 * 60);

            return new ObjectPost(enrollmentPost);
        }
    }

    class ObjectPut extends CRUDApiTest.ObjectPut<EnrollmentPut> {

        ObjectPut(EnrollmentPut enrollmentPut) {
            super(enrollmentPut);
        }

        @Override
        public void update() {
            EnrollmentPut enrollmentPut = (EnrollmentPut) objectBase;
            if (Config.randomBoolean())
                enrollmentPut.setDevice(KeyDeviceEnum.MOBILE);
            if (Config.randomBoolean())
                enrollmentPut.setName(Config.randomName());
        }
    }

    private UserGet user;

    @Override
    public void setUp() throws Exception {
        super.setUp();
        user = Config.createTestUser(UserModeEnum.ESIGN);
    }

    @Override
    String getTestObjectsNamePrefix() {
        return "#tester#-";
    }

    @Override
    Api newApi(ApiClient apiClient) {
        return new Api(new EnrollmentApi(apiClient));
    }

    @Override
    ObjectPost newObjectPost() {
        return new ObjectPost(new EnrollmentPost());
    }

    @Override
    ObjectPut newObjectPut() {
        return new ObjectPut(new EnrollmentPut());
    }

    @Override
    void verifyObjectValid(CRUDApiTest.ObjectGet objectGet) {
        EnrollmentGet enrollment = (EnrollmentGet) objectGet.get();
        assertNotNull(enrollment.getId());
        assertNotNull(enrollment.getUserId());
        assertNotNull(enrollment.getName());
    }

    @Override
    void verifyObjectsEquals(CRUDApiTest.ObjectPost pExpected, CRUDApiTest.ObjectGet pActual) {
        EnrollmentPost expected = (EnrollmentPost) pExpected.get();
        EnrollmentGet actual = (EnrollmentGet) pActual.get();
        assertEquals(expected.getUserId(), actual.getUserId());
        assertEquals(expected.getName(), actual.getName());
        assertEquals(expected.getDevice(), actual.getDevice());
    }

    @Override
    void verifyObjectUpdated(CRUDApiTest.ObjectPut pPut, CRUDApiTest.ObjectPost pPost, CRUDApiTest.ObjectGet pGet) {
        EnrollmentPut put = (EnrollmentPut) pPut.get();
        EnrollmentPost post = (EnrollmentPost) pPost.get();
        EnrollmentGet get = (EnrollmentGet) pGet.get();
        assertEquals(put.getDevice() != null ? put.getDevice() : post.getDevice(), get.getDevice());
        assertEquals(put.getName() != null ? put.getName() : post.getName(), get.getName());
    }
}
