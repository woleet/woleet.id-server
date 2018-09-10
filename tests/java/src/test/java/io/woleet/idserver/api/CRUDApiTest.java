package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.User;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;

import static org.junit.Assert.*;

public abstract class CRUDApiTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    interface Api {
        abstract ObjectArray getAllObjects(boolean b) throws ApiException;

        abstract ObjectGet deleteObject(UUID id) throws ApiException;

        abstract ObjectGet createObject(ObjectPost objectPost) throws ApiException;

        abstract ObjectGet getObjectById(UUID id) throws ApiException;

        abstract ObjectGet updateObject(UUID id, ObjectPut objectPut) throws ApiException;
    }

    enum ObjectStatusEnum {
        ACTIVE,
        BLOCKED
    }

    abstract class ObjectBase<T> {

        T objectBase;

        ObjectBase(T objectBase) {
            this.objectBase = objectBase;
        }

        T get() {
            return objectBase;
        }
    }

    abstract class ObjectGet<T> extends ObjectBase {

        ObjectGet(T objectGet) {
            super(objectGet);
        }

        abstract String getName();

        abstract UUID getId();
    }

    abstract class ObjectPut<T> extends ObjectPost {

        ObjectPut(T objectPut) {
            super(objectPut);
        }

        abstract void update();
    }

    abstract class ObjectPost<T> extends ObjectBase {

        ObjectPost(T objectPost) {
            super(objectPost);
        }

        abstract ObjectPost name(String name);

        abstract ObjectPost setMinimalAttributes();

        abstract ObjectPost setFullAttributes();
    }

    abstract class ObjectArray<T> {
        abstract boolean contains(ObjectGet<T> object);

        abstract ObjectGet<T>[] getArray();
    }

    private Api adminAuthApi, userAuthApi, noAuthApi;

    abstract String TEST_OBJECTS_NAME_PREFIX();

    abstract Api newApi(ApiClient apiClient);

    abstract ObjectPost newObjectPost();

    abstract ObjectPut newObjectPut();

    abstract void verifyObject(ObjectGet objectGet);

    abstract void verifyObjectsEquals(ObjectPost expected, ObjectGet actual);

    private void deleteAllTestObjects() throws ApiException {
        Api api = newApi(Config.getAdminAuthApiClient());
        ObjectArray objects = api.getAllObjects(false);
        for (ObjectGet objectGet : objects.getArray()) {
            if (objectGet.getName().startsWith(TEST_OBJECTS_NAME_PREFIX()))
                api.deleteObject(objectGet.getId());
        }
    }

    private ObjectGet createTestObject(Api api) throws ApiException {
        ObjectPost objectPost = newObjectPost();
        String NAME = Config.randomName();
        objectPost.name(NAME);
        return api.createObject(objectPost);
    }

    private ObjectGet createTestObject() throws ApiException {
        return createTestObject(newApi(Config.getAdminAuthApiClient()));
    }

    @Before
    public void setUp() throws Exception {

        // Start form a clean state
        tearDown();

        // Create 3 helper object APIs: one with admin rights, one with user rights, one not authenticated
        adminAuthApi = newApi(Config.getAdminAuthApiClient());
        User user = Config.createTestUser();
        userAuthApi = newApi(Config.getAuthApiClient(user.getUsername(), "pass"));
        noAuthApi = newApi(Config.getNoAuthApiClient());
    }

    @After
    public void tearDown() throws Exception {
        deleteAllTestObjects();
    }

    @Test
    public void createObjectBench() throws ApiException {
        long start = System.currentTimeMillis();
        for (int i = 0; i < 10; i++)
            createTestObject(adminAuthApi);
        logger.info("100 objects created in " + (System.currentTimeMillis() - start) + " ms");
    }

    @Test
    public void createObjectTest() throws ApiException {

        // Try to create a object with no credentials
        try {
            noAuthApi.createObject(newObjectPost());
            fail("Should not be able to create a object with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to create a object with user credentials
        try {
            userAuthApi.createObject(newObjectPost());
            fail("Should not be able to create a object with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to create a object without minimal attributes
        ObjectPost objectPost = newObjectPost();
        try {
            adminAuthApi.createObject(objectPost);
            fail("Should not be able to create a object without common name");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Create and verify a object with minimal attributes
        ObjectGet objectGet = adminAuthApi.createObject(objectPost.setMinimalAttributes());
        verifyObject(objectGet);

        // Create and verify a new object with full attributes
        objectPost = newObjectPost();
        objectPost.setFullAttributes();

        objectGet = adminAuthApi.createObject(objectPost);
        verifyObject(objectGet);
        verifyObjectsEquals(objectPost, objectGet);
    }

    @Test
    public void deleteObjectTest() throws ApiException {

        // Create a object to delete
        ObjectGet objectGet = createTestObject();

        // Delete the object with admin credentials
        adminAuthApi.deleteObject(objectGet.getId());

        // Try to delete a object with no credentials
        try {
            noAuthApi.deleteObject(objectGet.getId());
            fail("Should not be able to delete a object with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to delete a object with user credentials
        try {
            userAuthApi.deleteObject(objectGet.getId());
            fail("Should not be able to delete a object with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to delete a non existing object
        try {
            adminAuthApi.deleteObject(Config.randomUUID());
            fail("Should not be able to delete a non existing object");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }

    @Test
    public void getAllObjectsTest() throws ApiException {

        // Create a object to get
        ObjectGet objectGet = createTestObject();

        // Get all objects with admin credentials
        // and check that the object is within the results
        ObjectArray objects = adminAuthApi.getAllObjects(false);
        assertTrue(objects.contains(objectGet));

        // Delete the object, get all objects (including deleted ons)
        // and check that the object is still within the results
        objectGet = adminAuthApi.deleteObject(objectGet.getId());
        objects = adminAuthApi.getAllObjects(true);
        assertTrue(objects.contains(objectGet));

        // Try to get all objects with no credentials
        try {
            noAuthApi.getAllObjects(false);
            fail("Should not be able to get all objects with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to get all objects with user credentials
        try {
            userAuthApi.getAllObjects(false);
            fail("Should not be able to get all objects with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void getObjectByIdTest() throws ApiException {

        // Create a object to get
        ObjectPost objectPost = newObjectPost();
        objectPost.setFullAttributes();
        ObjectGet objectGet = adminAuthApi.createObject(objectPost);

        // Get and verify a object with admin credentials
        objectGet = adminAuthApi.getObjectById(objectGet.getId());
        verifyObject(objectGet);
        verifyObjectsEquals(objectPost, objectGet);

        // Try to get a object with no credentials
        try {
            noAuthApi.getObjectById(objectGet.getId());
            fail("Should not be able to get a object with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to get a object with user credentials
        try {
            userAuthApi.getObjectById(objectGet.getId());
            fail("Should not be able to get a object with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to get a non existing object
        try {
            adminAuthApi.getObjectById(Config.randomUUID());
            fail("Should not be able to get a non existing object");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }

    @Test
    public void updateObjectTest() throws ApiException {

        // Create an object to update
        ObjectPost objectPost = newObjectPost();
        objectPost.setFullAttributes();
        ObjectGet objectGet = adminAuthApi.createObject(objectPost);

        // Update and verify a object with admin credentials
        ObjectPut objectPut = newObjectPut();
        objectPut.update();
        objectGet = adminAuthApi.updateObject(objectGet.getId(), objectPut);
        verifyObject(objectGet);
        verifyObjectsEquals(objectPost, objectGet);

        // Try to update a object with no credentials
        try {
            noAuthApi.updateObject(objectGet.getId(), objectPut);
            fail("Should not be able to get a object with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to update a object with user credentials
        try {
            userAuthApi.updateObject(objectGet.getId(), objectPut);
            fail("Should not be able to get a object with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to update a non existing object
        try {
            adminAuthApi.updateObject(Config.randomUUID(), objectPut);
            fail("Should not be able to get a non existing object");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }
}
