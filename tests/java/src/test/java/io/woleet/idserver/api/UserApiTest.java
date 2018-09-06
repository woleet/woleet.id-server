package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idsever.api.model.*;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;

import static org.junit.Assert.*;

/**
 * API tests for UserApi
 */
public class UserApiTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final UserApi api = new UserApi();

    @Before
    public void setUp() throws Exception {
        tearDown();
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();
    }

    @Test
    public void createUserBench() throws ApiException {
        UserApi userApi = new UserApi(Config.getAdminAuthApiClient());
        long start = System.currentTimeMillis();
        for (int i = 0; i < 100; i++)
            Config.createTestUser(userApi);
        logger.info("100 users created in " + (System.currentTimeMillis() - start) + " ms");
    }

    @Test
    public void createUserTest() throws ApiException {

        // Try to create a user with no credentials
        try {
            UserApi userApi = new UserApi(Config.getNoAuthApiClient());
            userApi.createUser(new UserPost());
            fail("Should not be able to create a user with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to create a user with user credentials
        try {
            UserApi userApi = new UserApi(Config.getTesterAuthApiClient());
            userApi.createUser(new UserPost());
            fail("Should not be able to create a user with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        UserApi userApi = new UserApi(Config.getAdminAuthApiClient());
        UserPost userPost = new UserPost();
        FullIdentity fullIdentity = new FullIdentity();
        User user;

        // Try to create a user without minimal attributes
        try {
            userApi.createUser((UserPost) userPost.identity(fullIdentity));
            fail("Should not be able to create a user without common name");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Create a user with minimal attributes
        fullIdentity.commonName(Config.TEST_USERS_COMMONNAME_PREFIX + Config.randomUUID());
        user = userApi.createUser((UserPost) userPost.identity(fullIdentity));
        assertNotNull(user.getId());
        assertNotNull(user.getCreatedAt());
        assertTrue(user.getCreatedAt() <= user.getUpdatedAt());
        assertNull(user.getLastLogin());
        assertNull(user.getDeletedAt());
        assertNotNull(user.getDefaultKeyId());
        assertEquals(user.getStatus(), UserStatusEnum.ACTIVE);
        assertNull(user.getEmail());

        // Create a user with full attributes
        String USERNAME = Config.TEST_USERS_USERNAME_PREFIX + Config.randomHash().substring(0, 9);
        String EMAIL = USERNAME + "@woleet.com";
        String PASSWORD = Config.randomHash();
        userPost.password(PASSWORD).email(EMAIL).username(USERNAME);
        String COMMON_NAME = Config.TEST_USERS_COMMONNAME_PREFIX + USERNAME;
        String ORGANIZATION = "Woleet SAS";
        String ORGANIZATIONAL_UNIT = "Dev";
        String LOCALITY = "Rennes";
        String COUNTRY = "FR";
        String USER_ID = Config.randomUUID();
        fullIdentity
            .userId(USER_ID)
            .commonName(COMMON_NAME)
            .organizationalUnit(ORGANIZATIONAL_UNIT)
            .locality(LOCALITY)
            .organization(ORGANIZATION)
            .country(COUNTRY);
        user = userApi.createUser((UserPost) userPost.identity(fullIdentity));
        assertNotNull(user.getCreatedAt());
        assertTrue(user.getCreatedAt() <= user.getUpdatedAt());
        assertNull(user.getLastLogin());
        assertNull(user.getDeletedAt());
        assertNotNull(user.getDefaultKeyId());
        assertEquals(user.getStatus(), UserStatusEnum.ACTIVE);
        assertEquals(EMAIL, user.getEmail());
        assertEquals(USERNAME, user.getUsername());
        assertEquals(USER_ID, user.getIdentity().getUserId());
        assertEquals(COMMON_NAME, user.getIdentity().getCommonName());
        assertEquals(ORGANIZATION, user.getIdentity().getOrganization());
        assertEquals(ORGANIZATIONAL_UNIT, user.getIdentity().getOrganizationalUnit());
        assertEquals(LOCALITY, user.getIdentity().getLocality());
        assertEquals(COUNTRY, user.getIdentity().getCountry());

        // TODO: test limits (bad values for username / email / password / and X500 attributes
    }

    @Test
    @Ignore
    public void deleteUserTest() throws ApiException {
        UUID userId = null;
        User response = api.deleteUser(userId);

        // TODO: test validations
    }

    @Test
    @Ignore
    public void getAllUsersTest() throws ApiException {
        UUID userId = null;
        Boolean full = null;
        UserArray response = api.getAllUsers(true);

        // TODO: test validations
    }

    @Test
    @Ignore
    public void getUserByIdTest() throws ApiException {
        UUID userId = null;
        User response = api.getUserById(userId);

        // TODO: test validations
    }

    @Test
    @Ignore
    public void updateUserTest() throws ApiException {
        UUID userId = null;
        UserPut userPut = null;
        User response = api.updateUser(userId, userPut);

        // TODO: test validations
    }
}
