package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.lang.reflect.Field;
import java.util.List;

import static org.junit.Assert.*;

public class UserApiTest {

    private UserGet user;

    private UserApi userApi;

    @Before
    public void setUp() throws Exception {

        // Start form a clean state
        tearDown();

        // Create a test user
        user = Config.createTestUser();

        // Create a user API with admin rights using cookie authentication
        userApi = new UserApi(Config.getAdminAuthApiClient());
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();
    }

    @Test
    public void createUserTest() throws ApiException {

        // Build an esign user without an email
        UserPost userESign;
        userESign = new UserPost();
        userESign.setMode(UserModeEnum.ESIGN);
        String COMMON_NAME = Config.randomCommonName();
        FullIdentity fullIdentity = new FullIdentity();
        fullIdentity.commonName(COMMON_NAME);
        userESign.setIdentity(fullIdentity);

        // Try to create a user with user rights
        try {
            UserApi userAuthApi = new UserApi(Config.getAuthApiClient(user.getUsername(), "pass"));
            userAuthApi.createUser(userESign);
            fail("Should not be able to create an user object with user rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Check that we cannot create an esign user without an email
        try {
            userApi.createUser(userESign);
            fail("Should not be able to create an esign user without an email");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Build a seal user without an organization
        UserPost userSeal;
        userSeal = new UserPost();
        userSeal.setIdentity(fullIdentity);

        // Check that we cannot create a seal user (default mode) without an organization
        try {
            userApi.createUser(userSeal);
            fail("Should not be able to create a seal user without an organization");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Check that we cannot create a seal user (explicit mode) without an organization
        try {
            userSeal.setMode(UserModeEnum.SEAL);
            userApi.createUser(userSeal);
            fail("Should not be able to create a seal user without an organization");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_BAD_REQUEST, e.getCode());
        }
    }

    @Test
    public void getUserByIdTest() throws ApiException, NoSuchFieldException, IllegalAccessException {
        UserApi userAuthApi = new UserApi(Config.getAuthApiClient(user.getUsername(), "pass"));

        // Try to get a user with user rights
        try {
            userAuthApi.getUserById(user.getId());
            fail("Should not be able to get a user object with user rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Get the test user and check that it matches (except temporal properties)
        UserGet testUser = userApi.getUserById(user.getId());
        Field createdAt = UserGet.class.getDeclaredField("createdAt");
        createdAt.setAccessible(true);
        createdAt.set(testUser, null);
        createdAt.set(user, null);
        Field updatedAt = UserGet.class.getDeclaredField("updatedAt");
        updatedAt.setAccessible(true);
        updatedAt.set(testUser, null);
        updatedAt.set(user, null);
        Field lastLogin = UserGet.class.getDeclaredField("lastLogin");
        lastLogin.setAccessible(true);
        lastLogin.set(testUser, null);
        lastLogin.set(user, null);
        assertEquals(user, testUser);
    }

    @Test
    public void deleteUserTest() throws ApiException {
        UserApi userAuthApi = new UserApi(Config.getAuthApiClient(user.getUsername(), "pass"));

        // Try to delete a user with user rights
        try {
            userAuthApi.deleteUser(user.getId());
            fail("Should not be able to delete a user object with user rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void getUsersTest() throws ApiException {

        // Try to get all users with user rights
        try {
            UserApi userAuthUserApi = new UserApi(Config.getAuthApiClient(user.getUsername(), "pass"));
            userAuthUserApi.getUsers(null, null, null, null, null, null, null, null, null, null, null, null, null, null,
                    null, null);
            fail("Should not be able to get all users object with user rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Get the admin user by his role and username
        List<UserGet> users = userApi.getUsers(null, null, null, null, UserRoleEnum.ADMIN.getValue(), null,
                "admin", null, null, null, null, null, null, null, null, null);
        assertEquals(1, users.size());
        assertEquals("admin", users.get(0).getUsername());

        // Remember the admin user
        UserGet adminUser = users.get(0);

        // Get the admin user by his email
        users = userApi.getUsers(null, null, null, null, null, adminUser.getEmail(), null, null, null, null,
                null, null, null, null, null, null);
        assertEquals(1, users.size());
        assertEquals(adminUser.getEmail(), users.get(0).getEmail());

        // Get all users and check that the admin user is part of the results
        users = userApi.getUsers(null, null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, null);
        assertTrue(users.size() > 1);
        assertTrue(users.contains(adminUser));

        // Get the test user by his mode, role and username
        users = userApi.getUsers(null, null, null, UserModeEnum.SEAL.getValue(), UserRoleEnum.USER.getValue(),
                null, user.getUsername(), null, null, null, null, null, null, null, null, null);
        assertEquals(1, users.size());
        assertEquals(user.getUsername(), users.get(0).getUsername());

        // Get all users with a limit of 2
        users = userApi.getUsers(0, 2, null, null, null, null, null, null, null, null, null, null, null, null,
                null, null);
        assertEquals(2, users.size());

        // Remember 2nd user
        UserGet secondUser = users.get(1);

        // Get all users with an offset of 1 and a limit of 2
        users = userApi.getUsers(1, 1, null, null, null, null, null, null, null, null, null, null, null, null,
                null, null);
        assertEquals(1, users.size());

        // Check that 2nd user is now first
        assertEquals(secondUser, users.get(0));

        // Search the test user by his common name (like)
        users = userApi.getUsers(null, null, Config.TEST_NAME_PREFIX, null, null, null, null, null, null, null, null,
                null, null, null, null, null);
        assertEquals(1, users.size());
        assertEquals(users.get(0).getId(), user.getId());

        // Search the test user by his common name (like) and by his mode, role, mode and username (exact match)
        users = userApi.getUsers(0, 2, Config.TEST_NAME_PREFIX, UserModeEnum.SEAL.getValue(),
                UserRoleEnum.USER.getValue(), null, user.getUsername(), null, null, null, null, null, null, null, null,
                null);
        assertEquals(1, users.size());
        assertEquals(users.get(0).getId(), user.getId());
    }
}
