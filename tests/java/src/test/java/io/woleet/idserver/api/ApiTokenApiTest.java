package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.APITokenGet;
import io.woleet.idserver.api.model.APITokenPost;
import io.woleet.idserver.api.model.APITokenPut;
import io.woleet.idserver.api.model.UserGet;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;


public class ApiTokenApiTest {

    private UserGet user;
    private APITokenPost apiTokenPost;
    private ApiTokenApi userApiTokenApi;

    @Before
    public void setUp() throws Exception {

        // Start form a clean state
        tearDown();

        // Create a user and his API token
        user = Config.createTestUser();
        apiTokenPost = new APITokenPost();
        apiTokenPost.setName(Config.randomName());
        apiTokenPost.setUserId(user.getId());
        userApiTokenApi = new ApiTokenApi(Config.getAuthApiClient(user.getUsername(), "pass"));
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();
    }

    @Test
    public void userCreateAPITokenTest() throws ApiException {

        // Create a user token with user rights
        APITokenGet apiToken = userApiTokenApi.createAPIToken(apiTokenPost);
        assertNotNull(apiToken.getId());
        assertEquals(apiTokenPost.getName(), apiToken.getName());

        // Try to create an admin token with user rights
        try {
            APITokenPost adminApiTokenPost = new APITokenPost();
            adminApiTokenPost.setName(Config.randomName());
            userApiTokenApi.createAPIToken(adminApiTokenPost);
            fail("Should not be able to create an admin token with user rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to create a token for another user with user rights
        try {
            UserGet userTest = Config.createTestUser();
            APITokenPost userTestApiTokenPost = new APITokenPost();
            userTestApiTokenPost.setName(Config.randomName());
            userTestApiTokenPost.setUserId(userTest.getId());
            userApiTokenApi.createAPIToken(userTestApiTokenPost);
            fail("Should not be able to create a token for another user with user rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void userDeleteAPITokenTest() throws ApiException {

        // Delete a user token with user rights
        APITokenGet apiToken = userApiTokenApi.createAPIToken(apiTokenPost);
        apiToken = userApiTokenApi.deleteAPIToken(apiToken.getId());
        assertNotNull(apiToken.getId());
        assertEquals(apiTokenPost.getName(), apiToken.getName());

        // Try to delete admin token with user rights
        ApiTokenApi adminApiTokenApi = new ApiTokenApi(Config.getAdminAuthApiClient());
        APITokenPost adminApiTokenPost = new APITokenPost();
        adminApiTokenPost.setName(Config.randomName());
        APITokenGet adminApiTokenGet = adminApiTokenApi.createAPIToken(adminApiTokenPost);
        try {
            userApiTokenApi.deleteAPIToken(adminApiTokenGet.getId());
            fail("Should not be able to delete admin token with user rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }
        adminApiTokenApi.deleteAPIToken(adminApiTokenGet.getId());

        // Try to delete a token for another user with user rights
        try {
            UserGet userTest = Config.createTestUser();
            APITokenPost userTestApiTokenPost = new APITokenPost();
            userTestApiTokenPost.setName(Config.randomName());
            userTestApiTokenPost.setUserId(userTest.getId());
            APITokenGet userTestApiTokenGet = adminApiTokenApi.createAPIToken(userTestApiTokenPost);
            userApiTokenApi.deleteAPIToken(userTestApiTokenGet.getId());
            fail("Should not be able to delete a token for another user with user rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void userGetAPITokenByIdTest() throws ApiException {

        // Get a user token with user rights
        APITokenGet apiToken = userApiTokenApi.createAPIToken(apiTokenPost);
        APITokenGet apiTokenGet = userApiTokenApi.getAPITokenById(apiToken.getId());
        assertEquals(apiToken.getId(), apiTokenGet.getId());
        assertEquals(apiToken.getName(), apiTokenGet.getName());

        // Try to get an admin token with user rights
        ApiTokenApi adminApiTokenApi = new ApiTokenApi(Config.getAdminAuthApiClient());
        APITokenPost adminApiTokenPost = new APITokenPost();
        adminApiTokenPost.setName(Config.randomName());
        APITokenGet adminApiTokenGet = adminApiTokenApi.createAPIToken(adminApiTokenPost);
        try {
            userApiTokenApi.getAPITokenById(adminApiTokenGet.getId());
            fail("Should not be able to get an admin token with user rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }
        adminApiTokenApi.deleteAPIToken(adminApiTokenGet.getId());

        // Try to get another user token with user rights
        try {
            UserGet userTest = Config.createTestUser();
            APITokenPost userTestApiTokenPost = new APITokenPost();
            userTestApiTokenPost.setName(Config.randomName());
            userTestApiTokenPost.setUserId(userTest.getId());
            APITokenGet userTestApiTokenGet = adminApiTokenApi.createAPIToken(userTestApiTokenPost);
            userApiTokenApi.getAPITokenById(userTestApiTokenGet.getId());
            fail("Should not be able to get another user token with user rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void userUpdateAPITokenTest() throws ApiException {

        // Update a user token with user rights
        APITokenGet apiToken = userApiTokenApi.createAPIToken(apiTokenPost);
        APITokenPut apiTokenPut = new APITokenPut();
        apiTokenPut.setName(Config.randomName());
        APITokenGet apiTokenGet = userApiTokenApi.updateAPIToken(apiToken.getId(), apiTokenPut);
        assertEquals(apiTokenPut.getName(), apiTokenGet.getName());

        // Try to update an admin token with user rights
        ApiTokenApi adminApiTokenApi = new ApiTokenApi(Config.getAdminAuthApiClient());
        APITokenPost adminApiTokenPost = new APITokenPost();
        adminApiTokenPost.setName(Config.randomName());
        APITokenGet adminApiTokenGet = adminApiTokenApi.createAPIToken(adminApiTokenPost);
        try {
            userApiTokenApi.updateAPIToken(adminApiTokenGet.getId(), apiTokenPut);
            fail("Should not be able to update an admin token with user rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }
        adminApiTokenApi.deleteAPIToken(adminApiTokenGet.getId());

        // Try to update another user token with user rights
        try {
            UserGet userTest = Config.createTestUser();
            APITokenPost userTestApiTokenPost = new APITokenPost();
            userTestApiTokenPost.setName(Config.randomName());
            userTestApiTokenPost.setUserId(userTest.getId());
            APITokenGet userTestApiTokenGet = adminApiTokenApi.createAPIToken(userTestApiTokenPost);
            userApiTokenApi.updateAPIToken(userTestApiTokenGet.getId(), apiTokenPut);
            fail("Should not be able to update another user token with user rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void getAPITokensTest() throws ApiException {

        // Create 2 user tokens with user rights
        userApiTokenApi.createAPIToken(apiTokenPost);
        userApiTokenApi.createAPIToken(apiTokenPost);

        // Create a token owned by the admin
        ApiTokenApi adminApiTokenApi = new ApiTokenApi(Config.getAdminAuthApiClient());
        APITokenGet adminApiTokenGet = adminApiTokenApi.createAPIToken(new APITokenPost().name(Config.randomName()));

        // Check that only the user tokens are returned
        List<APITokenGet> apiTokenGetList = userApiTokenApi.getAPITokens();
        for (APITokenGet apiTokenGet : apiTokenGetList)
            assertEquals("Should only get the user's tokens", user.getId(), apiTokenGet.getUserId());
        adminApiTokenApi.deleteAPIToken(adminApiTokenGet.getId());
    }
}
