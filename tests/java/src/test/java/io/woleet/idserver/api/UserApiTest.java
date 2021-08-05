package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class UserApiTest {

    private UserApi userApi;

    @Before
    public void setUp() throws Exception {

        // Start form a clean state
        tearDown();

        // Create user API
        userApi = new UserApi(Config.getAdminAuthApiClient());
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();
    }

    @Test
    public void createUserTest() {

        // Create an esign user without an email
        UserPost userESign;
        userESign = new UserPost();
        userESign.setMode(UserModeEnum.ESIGN);
        String COMMON_NAME = Config.randomCommonName();
        FullIdentity fullIdentity = new FullIdentity();
        fullIdentity.commonName(COMMON_NAME);
        userESign.setIdentity(fullIdentity);

        // Try to create a user with user credentials
        try {
            UserGet user = Config.createTestUser();
            UserApi userAuthApi = new UserApi(Config.getAuthApiClient(user.getUsername(), "pass"));
            userAuthApi.createUser(userESign);
            fail("Should not be able to create an user object with user credentials");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Check that we cannot create an esign user without an email
        try {
            userApi.createUser(userESign);
            fail("Should not be able to create an esign user without an email");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Create a seal user without an organization
        UserPost userSeal;
        userSeal = new UserPost();
        userSeal.setIdentity(fullIdentity);

        // Check that we cannot create a seal user (default mode) without an organization
        try {
            userApi.createUser(userSeal);
            fail("Should not be able to create a seal user without an organization");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Check that we cannot create a seal user (explicit mode) without an organization
        try {
            userSeal.setMode(UserModeEnum.SEAL);
            userApi.createUser(userSeal);
            fail("Should not be able to create a seal user without an organization");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }
    }

    @Test
    public void deleteUserTest() throws ApiException {
        UserGet user = Config.createTestUser();
        UserApi userAuthApi = new UserApi(Config.getAuthApiClient(user.getUsername(), "pass"));

        // Try to delete a user with user credentials
        try {
            UserGet userGet = Config.createTestUser();
            userAuthApi.deleteUser(userGet.getId());
            fail("Should not be able to delete a user object with user credentials");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void getAllUsersTest() throws ApiException {

        // Create a test user
        UserGet user = Config.createTestUser();

        // Try to get all users with user credentials
        try {
            UserApi userAuthUserApi = new UserApi(Config.getAuthApiClient(user.getUsername(), "pass"));
            userAuthUserApi.getAllUsers(null, null, null, null, null, null, null, null, null, null, null, null, null,
                    null, null);
            fail("Should not be able to get all users object with user credentials");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Get the admin user only by his username
        List<UserGet> users = userApi.getAllUsers(null, null,
                UserModeEnum.ESIGN.getValue(), UserRoleEnum.ADMIN.getValue(), null, "admin", null, null, null, null,
                null, null, null, null, null);
        assertEquals(1, users.size());
        assertEquals("admin", users.get(0).getUsername());
        UserGet adminUser = users.get(0);

        // Get the admin user only by his email
        users = userApi.getAllUsers(null, null, null, null, adminUser.getEmail(), null, null, null, null, null, null,
                null, null, null, null);
        assertEquals(1, users.size());
        assertEquals(adminUser.getEmail(), users.get(0).getEmail());

        // Get the test user only
        users = userApi.getAllUsers(null, null,
                UserModeEnum.SEAL.getValue(), UserRoleEnum.USER.getValue(), null, user.getUsername(), null, null, null,
                null, null, null, null, null, null);
        assertEquals(1, users.size());
        assertEquals(user.getUsername(), users.get(0).getUsername());

        // Get all users with a limit of 2
        users = userApi.getAllUsers(0, 2, null, null, null, null, null, null, null, null, null, null, null, null,
                null);
        assertEquals(2, users.size());
        UserGet secondUser = users.get(1);

        // Get all users with an offset of 1 and a limit of 2
        users = userApi.getAllUsers(1, 1, null, null, null, null, null, null, null, null, null, null, null, null,
                null);
        assertEquals(1, users.size());
        assertEquals(secondUser, users.get(0));
    }
}
