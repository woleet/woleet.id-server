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

public class UserApiTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private UserApi adminAuthUserApi, userAuthUserApi, noAuthUserApi;

    private UserPost generateNewRandomUser() {

        UserPost user = new UserPost();

        // Set status and role
        user.setStatus(UserStatusEnum.ACTIVE);
        user.setRole(UserRoleEnum.USER);

        // Set login information
        String USERNAME = Config.randomUsername();
        String EMAIL = USERNAME + "@woleet.com";
        user.email(EMAIL).username(USERNAME);
        String PASSWORD = Config.randomHash();
        user.password(PASSWORD);

        // Set identity information
        String COMMON_NAME = Config.randomCommonName();
        String ORGANIZATION = "Woleet SAS";
        String ORGANIZATIONAL_UNIT = "Dev";
        String LOCALITY = "Rennes";
        String COUNTRY = "FR";
        String USER_ID = Config.randomUUID().toString();
        FullIdentity fullIdentity = new FullIdentity();
        fullIdentity
                .userId(USER_ID)
                .commonName(COMMON_NAME)
                .organizationalUnit(ORGANIZATIONAL_UNIT)
                .locality(LOCALITY)
                .organization(ORGANIZATION)
                .country(COUNTRY);
        user.identity(fullIdentity);

        // Return user
        return user;
    }

    private void verifyUser(User user) {
        assertNotNull(user.getId());
        assertNotNull(user.getCreatedAt());
        assertTrue(user.getCreatedAt() <= user.getUpdatedAt());
        assertNull(user.getLastLogin());
        assertNull(user.getDeletedAt());
        assertNotNull(user.getDefaultKeyId());
        assertEquals(user.getStatus(), UserStatusEnum.ACTIVE);
        assertEquals(user.getRole(), UserRoleEnum.USER);
    }

    private void verifyUsersEquals(UserPost expected, User actual) {
        assertEquals(expected.getStatus(), actual.getStatus());
        assertEquals(expected.getRole(), actual.getRole());
        assertEquals(expected.getUsername(), actual.getUsername());
        assertEquals(expected.getEmail(), actual.getEmail());
        assertEquals(expected.getIdentity(), actual.getIdentity());
    }

    @Before
    public void setUp() throws Exception {

        // Start form a clean state
        tearDown();

        // Create 3 helper user APIs: one with admin rights, one with user rights, one not authenticated
        adminAuthUserApi = new UserApi(Config.getAdminAuthApiClient());
        User user = Config.createTestUser();
        userAuthUserApi = new UserApi(Config.getAuthApiClient(user.getUsername(), "pass"));
        noAuthUserApi = new UserApi(Config.getNoAuthApiClient());
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();
    }

    @Test
    public void createUserBench() throws ApiException {
        long start = System.currentTimeMillis();
        for (int i = 0; i < 10; i++)
            Config.createTestUser(adminAuthUserApi);
        logger.info("100 users created in " + (System.currentTimeMillis() - start) + " ms");
    }

    @Test
    public void createUserTest() throws ApiException {

        // Try to create a user with no credentials
        try {
            noAuthUserApi.createUser(new UserPost());
            fail("Should not be able to create a user with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to create a user with user credentials
        try {
            userAuthUserApi.createUser(new UserPost());
            fail("Should not be able to create a user with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to create a user without minimal attributes
        UserPost userPost = new UserPost();
        try {
            adminAuthUserApi.createUser(userPost);
            fail("Should not be able to create a user without common name");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Create and verify a user with minimal attributes
        FullIdentity fullIdentity = new FullIdentity();
        fullIdentity.commonName(Config.randomCommonName());
        User user = adminAuthUserApi.createUser((UserPost) userPost.identity(fullIdentity));
        verifyUser(user);

        // Create and verify a new user with full attributes
        userPost = generateNewRandomUser();
        user = adminAuthUserApi.createUser(userPost);
        verifyUser(user);
        verifyUsersEquals(userPost, user);

        // TODO: test limits (bad values for username / email / password / and X500 attributes
    }

    @Test
    public void deleteUserTest() throws ApiException {

        // Create a user to delete
        User user = Config.createTestUser();

        // Delete the user with admin credentials
        adminAuthUserApi.deleteUser(user.getId());

        // Try to delete a user with no credentials
        try {
            noAuthUserApi.deleteUser(user.getId());
            fail("Should not be able to delete a user with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to delete a user with user credentials
        try {
            userAuthUserApi.deleteUser(user.getId());
            fail("Should not be able to delete a user with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to delete a non existing user
        try {
            adminAuthUserApi.deleteUser(Config.randomUUID());
            fail("Should not be able to delete a non existing user");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }

    @Test
    public void getAllUsersTest() throws ApiException {

        // Create a user to get
        User user = Config.createTestUser();

        // Get all users with admin credentials
        // and check that the user is within the results
        UserArray users = adminAuthUserApi.getAllUsers(false);
        assertTrue(users.contains(user));

        // Delete the user, get all users (including deleted ons)
        // and check that the user is still within the results
        user = adminAuthUserApi.deleteUser(user.getId());
        users = adminAuthUserApi.getAllUsers(true);
        assertTrue(users.contains(user));

        // Try to get all users with no credentials
        try {
            noAuthUserApi.getAllUsers(false);
            fail("Should not be able to get all users with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to get all users with user credentials
        try {
            userAuthUserApi.getAllUsers(false);
            fail("Should not be able to get all users with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void getUserByIdTest() throws ApiException {

        // Create a user to get
        UserPost userPost = generateNewRandomUser();
        User user = adminAuthUserApi.createUser(userPost);

        // Get and verify a user with admin credentials
        User userGet = adminAuthUserApi.getUserById(user.getId());
        verifyUser(userGet);
        verifyUsersEquals(userPost, userGet);

        // Try to get a user with no credentials
        try {
            noAuthUserApi.getUserById(user.getId());
            fail("Should not be able to get a user with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to get a user with user credentials
        try {
            userAuthUserApi.getUserById(user.getId());
            fail("Should not be able to get a user with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to get a non existing user
        try {
            adminAuthUserApi.getUserById(Config.randomUUID());
            fail("Should not be able to get a non existing user");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }

    @Test
    public void updateUserTest() throws ApiException {

        // Create a user to updateSomething
        UserPost userPost = generateNewRandomUser();
        User user = adminAuthUserApi.createUser(userPost);

        // Update and verify a user with admin credentials
        UserPut userPut = new UserPut();
        String PASSWORD = Config.randomHash();
        userPut.password(PASSWORD);
        user = adminAuthUserApi.updateUser(user.getId(), userPut);
        verifyUser(user);
        userPost.password(PASSWORD);
        verifyUsersEquals(userPost, user);

        // Try to updateSomething a user with no credentials
        try {
            noAuthUserApi.updateUser(user.getId(), userPut);
            fail("Should not be able to get a user with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to updateSomething a user with user credentials
        try {
            userAuthUserApi.updateUser(user.getId(), userPut);
            fail("Should not be able to get a user with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to updateSomething a non existing user
        try {
            adminAuthUserApi.updateUser(Config.randomUUID(), userPut);
            fail("Should not be able to get a non existing user");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }
}
