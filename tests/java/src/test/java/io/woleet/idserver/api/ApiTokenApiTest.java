package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.Assert.*;

public class ApiTokenApiTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private ApiTokenApi adminAuthApiTokenApi, userAuthApiTokenApi, noAuthApiTokenApi;

    private APITokenPost generateNewRandomAPIToken() {

        APITokenPost apiToken = new APITokenPost();

        // Set status and name
        apiToken.setStatus(APITokenStatusEnum.ACTIVE);
        String NAME = Config.randomName();
        apiToken.setName(NAME);

        // Return user
        return apiToken;
    }

    private void verifyAPIToken(APIToken apiToken) {
        assertNotNull(apiToken.getId());
        assertNotNull(apiToken.getCreatedAt());
        assertTrue(apiToken.getCreatedAt() <= apiToken.getUpdatedAt());
        assertNull(apiToken.getDeletedAt());
        assertEquals(apiToken.getStatus(), APITokenStatusEnum.ACTIVE);
    }

    private void verifyAPITokensEquals(APITokenPost expected, APIToken actual) {
        assertEquals(expected.getStatus(), actual.getStatus());
        assertEquals(expected.getName(), actual.getName());
    }

    @Before
    public void setUp() throws Exception {

        // Start form a clean state
        tearDown();

        // Create 3 helper API token APIs: one with admin rights, one with user rights, one not authenticated
        adminAuthApiTokenApi = new ApiTokenApi(Config.getAdminAuthApiClient());
        User user = Config.createTestUser();
        userAuthApiTokenApi = new ApiTokenApi(Config.getAuthApiClient(user.getUsername(), "pass"));
        noAuthApiTokenApi = new ApiTokenApi(Config.getNoAuthApiClient());
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestAPITokens();
        Config.deleteAllTestUsers();
    }

    @Test
    public void createAPITokenBench() throws ApiException {
        long start = System.currentTimeMillis();
        for (int i = 0; i < 10; i++)
            Config.createTestAPIToken(adminAuthApiTokenApi);
        logger.info("100 API tokens created in " + (System.currentTimeMillis() - start) + " ms");
    }

    @Test
    public void createAPITokenTest() throws ApiException {

        // Try to create an API token with no credentials
        try {
            noAuthApiTokenApi.createAPIToken(new APITokenPost());
            fail("Should not be able to create an API token with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to create an API token with user credentials
        try {
            userAuthApiTokenApi.createAPIToken(new APITokenPost());
            fail("Should not be able to create an API token with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to create an API token without minimal attributes
        APITokenPost APITokenPost = new APITokenPost();
        try {
            adminAuthApiTokenApi.createAPIToken(APITokenPost);
            fail("Should not be able to create an API token without name");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Create and verify an API token with minimal attributes
        APIToken apiToken = adminAuthApiTokenApi.createAPIToken((APITokenPost) APITokenPost.name(Config.randomName()));
        verifyAPIToken(apiToken);

        // Create and verify a new API token with full attributes
        APITokenPost = generateNewRandomAPIToken();
        apiToken = adminAuthApiTokenApi.createAPIToken(APITokenPost);
        verifyAPIToken(apiToken);
        verifyAPITokensEquals(APITokenPost, apiToken);

        // TODO: test limits (bad values for API token name
    }

    @Test
    public void deleteAPITokenTest() throws ApiException {

        // Create an API token to delete
        APIToken apiToken = Config.createTestAPIToken();

        // Delete the API token with admin credentials
        adminAuthApiTokenApi.deleteAPIToken(apiToken.getId());

        // Try to delete an API token with no credentials
        try {
            noAuthApiTokenApi.deleteAPIToken(apiToken.getId());
            fail("Should not be able to delete an API token with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to delete an API token with user credentials
        try {
            userAuthApiTokenApi.deleteAPIToken(apiToken.getId());
            fail("Should not be able to delete an API token with API token credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to delete an non existing API token
        try {
            adminAuthApiTokenApi.deleteAPIToken(Config.randomUUID());
            fail("Should not be able to delete a non existing API token");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }

    @Test
    public void getAllAPITokensTest() throws ApiException {

        // Create an API token to get
        APIToken apiToken = Config.createTestAPIToken();

        // Get all API tokens with admin credentials
        // and check that the API tokens is within the results
        APITokenArray apiTokens = adminAuthApiTokenApi.getAllAPITokens(false);
        assertTrue(apiTokens.contains(apiToken));

        // Delete the API token, get all API tokens (including deleted ons)
        // and check that the API token is still within the results
        adminAuthApiTokenApi.deleteAPIToken(apiToken.getId());
        apiTokens = adminAuthApiTokenApi.getAllAPITokens(true);
        assertTrue(apiTokens.contains(apiToken));

        // Try to get all API tokens with no credentials
        try {
            noAuthApiTokenApi.getAllAPITokens(false);
            fail("Should not be able to get all API tokens with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to get all API tokens with user credentials
        try {
            userAuthApiTokenApi.getAllAPITokens(false);
            fail("Should not be able to get all API tokens with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void getAPITokenByIdTest() throws ApiException {

        // Create an API token to get
        APITokenPost APITokenPost = generateNewRandomAPIToken();
        APIToken apiToken = adminAuthApiTokenApi.createAPIToken(APITokenPost);

        // Get and verify an API token with admin credentials
        APIToken apiTokenGet = adminAuthApiTokenApi.getAPITokenById(apiToken.getId());
        verifyAPIToken(apiTokenGet);
        verifyAPITokensEquals(APITokenPost, apiTokenGet);

        // Try to get an API token with no credentials
        try {
            noAuthApiTokenApi.getAPITokenById(apiToken.getId());
            fail("Should not be able to get an API token with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to get an API token with user credentials
        try {
            userAuthApiTokenApi.getAPITokenById(apiToken.getId());
            fail("Should not be able to get an API token with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to get a non existing API token
        try {
            adminAuthApiTokenApi.getAPITokenById(Config.randomUUID());
            fail("Should not be able to get a non existing API Token");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }

    @Test
    public void updateAPITokenTest() throws ApiException {

        // Create an API token to update
        APITokenPost APITokenPost = generateNewRandomAPIToken();
        APIToken apiToken = adminAuthApiTokenApi.createAPIToken(APITokenPost);

        // Update and verify an API token with admin credentials
        APITokenPut apiTokenPut = new APITokenPut();
        String NAME = Config.randomName();
        apiTokenPut.name(NAME);
        apiToken = adminAuthApiTokenApi.updateAPIToken(apiToken.getId(), apiTokenPut);
        verifyAPIToken(apiToken);
        APITokenPost.name(NAME);
        verifyAPITokensEquals(APITokenPost, apiToken);

        // Try to update an API token with no credentials
        try {
            noAuthApiTokenApi.updateAPIToken(apiToken.getId(), apiTokenPut);
            fail("Should not be able to get an API token with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to update an API token with user credentials
        try {
            userAuthApiTokenApi.updateAPIToken(apiToken.getId(), apiTokenPut);
            fail("Should not be able to get an API token with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to update a non existing user
        try {
            adminAuthApiTokenApi.updateAPIToken(Config.randomUUID(), apiTokenPut);
            fail("Should not be able to get a non existing API token");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }
}
