package io.woleet.idserver.api;

import com.codahale.metrics.Meter;
import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Slf4jReporter;
import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.UserGet;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.*;

public abstract class CRUDApiTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    interface Api {
        List<ObjectGet> getAllObjects() throws ApiException;

        ObjectGet deleteObject(UUID id) throws ApiException;

        ObjectGet createObject(ObjectPost objectPost) throws ApiException;

        ObjectGet getObjectById(UUID id) throws ApiException;

        ObjectGet updateObject(UUID id, ObjectPut objectPut) throws ApiException;
    }

    class ObjectBase<T> {

        T objectBase;

        ObjectBase(T objectBase) {
            this.objectBase = objectBase;
        }

        T get() {
            return objectBase;
        }

        @Override
        public boolean equals(Object obj) {
            return objectBase.equals(((ObjectBase<T>) obj).objectBase);
        }
    }

    abstract class ObjectGet<T> extends ObjectBase {

        ObjectGet(T objectGet) {
            super(objectGet);
        }

        abstract String getName();

        abstract UUID getId();
    }

    abstract class ObjectPut<T> extends ObjectBase {

        ObjectPut(T objectPut) {
            super(objectPut);
        }

        abstract void update();
    }

    abstract class ObjectPost<T> extends ObjectBase {

        ObjectPost(T objectPost) {
            super(objectPost);
        }

        abstract ObjectPost setMinimalAttributes();

        abstract ObjectPost setFullAttributes();
    }

    private Api adminAuthApi, userAuthApi, noAuthApi;

    abstract String getTestObjectsNamePrefix();

    abstract Api newApi(ApiClient apiClient);

    abstract ObjectPost newObjectPost();

    abstract ObjectPut newObjectPut();

    abstract void verifyObjectValid(ObjectGet object);

    abstract void verifyObjectsEquals(ObjectPost expected, ObjectGet actual);

    abstract void verifyObjectUpdated(ObjectPut put, ObjectPost post, ObjectGet get);

    private void deleteAllTestObjects() throws ApiException {
        Api api = newApi(Config.getAdminAuthApiClient());
        List<ObjectGet> objects = api.getAllObjects();
        for (ObjectGet objectGet : objects) {
            if (objectGet.getName().startsWith(getTestObjectsNamePrefix()))
                api.deleteObject(objectGet.getId());
        }
    }

    private ObjectGet createTestObject(Api api) throws ApiException {
        ObjectPost objectPost = newObjectPost();
        objectPost.setMinimalAttributes();
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
        UserGet user = Config.createTestUser();
        userAuthApi = newApi(Config.getAuthApiClient(user.getUsername(), "pass"));
        noAuthApi = newApi(Config.getNoAuthApiClient());
    }

    @After
    public void tearDown() throws Exception {
        deleteAllTestObjects();
        Config.deleteAllTestUsers();
    }

    @Test
    public void createObjectBench() throws ApiException, InterruptedException {

        // Maximum number of concurrent requests
        int MAX_CONCURRENT_REQUESTS = 1;

        // Maximum number of threads to use
        int MAX_THREADS = 1;

        // Maximum duration of the benchmark (in ms)
        long MAX_DURATION = 5000;

        // Initialize metrics
        final MetricRegistry metricsRegistry = new MetricRegistry();
        final Meter rate = metricsRegistry.meter("rate");
        final Slf4jReporter reporter = Slf4jReporter.forRegistry(metricsRegistry)
                .convertRatesTo(TimeUnit.SECONDS)
                .convertDurationsTo(TimeUnit.MILLISECONDS)
                .build();

        // Start reporting metrics every second
        reporter.start(1, TimeUnit.SECONDS);

        // Configure concurrency
        ApiClient apiClient = Config.getAdminAuthApiClient();
        Api benchApi = newApi(apiClient);
        apiClient.getHttpClient().dispatcher().setMaxRequestsPerHost(MAX_CONCURRENT_REQUESTS);
        apiClient.getHttpClient().dispatcher().setMaxRequests(MAX_CONCURRENT_REQUESTS);
        ExecutorService executor = new ThreadPoolExecutor(
                MAX_THREADS, MAX_THREADS,
                1000L, TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<>(MAX_THREADS),
                new ThreadPoolExecutor.CallerRunsPolicy());

        // Start benchmark
        long startTime = System.currentTimeMillis();
        while (System.currentTimeMillis() - startTime < MAX_DURATION) {

            // Effectively create the test object using the executor
            if (MAX_THREADS == 1) {
                createTestObject(benchApi);
                rate.mark();
            } else {
                executor.execute(() -> {
                    try {
                        createTestObject(benchApi);
                        Thread.sleep(1);
                        rate.mark();
                    }
                    catch (InterruptedException | ApiException e) {
                        logger.error("Cannot create test object", e);
                    }
                });
            }
        }

        // Wait for all threads to end
        executor.shutdown();
        while (!executor.isTerminated()) {
            Thread.sleep(100);
        }

        // Stop reporting metrics every second
        reporter.stop();

        // Report metrics
        reporter.report();
    }

    @Test
    public void createObjectTest() throws ApiException {

        // Try to create an object with no credentials
        try {
            noAuthApi.createObject(newObjectPost());
            fail("Should not be able to create an object with no credentials");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to create an object without minimal attributes
        ObjectPost objectPost = newObjectPost();
        try {
            adminAuthApi.createObject(objectPost);
            fail("Should not be able to create an object without minimal attributes");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Create and verify an object with minimal attributes
        ObjectGet objectGet = adminAuthApi.createObject(objectPost.setMinimalAttributes());
        verifyObjectValid(objectGet);

        // Create and verify a new object with full attributes
        objectPost = newObjectPost();
        objectGet = adminAuthApi.createObject(objectPost.setFullAttributes());
        verifyObjectValid(objectGet);
        verifyObjectsEquals(objectPost, objectGet);
    }

    @Test
    public void deleteObjectTest() throws ApiException {

        // Create an object to delete
        ObjectGet objectGet = createTestObject();

        // Delete the object with admin credentials
        adminAuthApi.deleteObject(objectGet.getId());

        // Try to delete an object with no credentials
        try {
            noAuthApi.deleteObject(objectGet.getId());
            fail("Should not be able to delete an object with no credentials");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to delete a non existing object
        try {
            adminAuthApi.deleteObject(Config.randomUUID());
            fail("Should not be able to delete a non existing object");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }

    @Test
    public void getAllObjectsTest() throws ApiException {

        // Create an object to get
        ObjectGet objectGet = createTestObject();

        // Get all objects with admin credentials and check that the object is within the results
        List<ObjectGet> objects = adminAuthApi.getAllObjects();
        assertTrue(objects.contains(objectGet));

        // Delete the object, get all objects and check that the object is no longer within the results
        objectGet = adminAuthApi.deleteObject(objectGet.getId());
        objects = adminAuthApi.getAllObjects();
        assertFalse(objects.contains(objectGet));

        // Try to get all objects with no credentials
        try {
            noAuthApi.getAllObjects();
            fail("Should not be able to get all objects with no credentials");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }
    }

    @Test
    public void getObjectByIdTest() throws ApiException {

        // Create an object to get
        ObjectPost objectPost = newObjectPost();
        ObjectGet objectGet = adminAuthApi.createObject(objectPost.setFullAttributes());
        verifyObjectValid(objectGet);

        // Get and verify an object with admin credentials
        objectGet = adminAuthApi.getObjectById(objectGet.getId());
        verifyObjectValid(objectGet);
        verifyObjectsEquals(objectPost, objectGet);

        // Try to get an object with no credentials
        try {
            noAuthApi.getObjectById(objectGet.getId());
            fail("Should not be able to get an object with no credentials");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to get an object with user credentials
        try {
            userAuthApi.getObjectById(objectGet.getId());
            fail("Should not be able to get an object with user credentials");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to get a non existing object
        try {
            adminAuthApi.getObjectById(Config.randomUUID());
            fail("Should not be able to get a non existing object");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }

    @Test
    public void updateObjectTest() throws ApiException {

        // Create an object to update
        ObjectPost objectPost = newObjectPost();
        ObjectGet objectGet = adminAuthApi.createObject(objectPost.setFullAttributes());
        verifyObjectValid(objectGet);

        // Update and verify an object with admin credentials
        ObjectPut objectPut = newObjectPut();
        objectPut.update();
        objectGet = adminAuthApi.updateObject(objectGet.getId(), objectPut);
        verifyObjectValid(objectGet);
        verifyObjectUpdated(objectPut, objectPost, objectGet);
        objectGet = adminAuthApi.getObjectById(objectGet.getId());
        verifyObjectValid(objectGet);
        verifyObjectUpdated(objectPut, objectPost, objectGet);

        // Try to update an object with no credentials
        try {
            noAuthApi.updateObject(objectGet.getId(), objectPut);
            fail("Should not be able to get an object with no credentials");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to update an object with user credentials
        try {
            userAuthApi.updateObject(objectGet.getId(), objectPut);
            fail("Should not be able to get an object with user credentials");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to update a non existing object
        try {
            adminAuthApi.updateObject(Config.randomUUID(), objectPut);
            fail("Should not be able to get a non existing object");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }
}
