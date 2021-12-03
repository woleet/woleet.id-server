package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

public class DiscoveryApiTest {

    private static String WOLEET_ID_SERVER_SIGNATURE_BASEPATH = System.getenv("WOLEET_ID_SERVER_SIGNATURE_BASEPATH");

    static {
        if (WOLEET_ID_SERVER_SIGNATURE_BASEPATH == null)
            WOLEET_ID_SERVER_SIGNATURE_BASEPATH = "https://localhost:3002";
    }

    private UserGet user;

    private DiscoveryApi discoveryApiAdmin, discoveryApiUser;

    private ApiTokenApi apiTokenApi;
    private APITokenGet apiToken;

    private KeyApi keyApi;

    @Before
    public void setUp() throws Exception {

        // Start from a clean state
        tearDown();

        // Create a test user
        user = Config.createTestUser();

        // Create a key API
        keyApi = new KeyApi(Config.getAdminAuthApiClient());

        // Create a helper API with API token authentication
        apiTokenApi = new ApiTokenApi(Config.getAdminAuthApiClient());
        apiToken = apiTokenApi.createAPIToken(new APITokenPost().name("test"));
        ApiClient apiClientAdmin = Config.getNoAuthApiClient();
        apiClientAdmin.setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH);
        apiClientAdmin.addDefaultHeader("Authorization", "Bearer " + apiToken.getValue());
        discoveryApiAdmin = new DiscoveryApi(apiClientAdmin);
        APITokenPost apiTokenPost = new APITokenPost();
        apiTokenPost.setUserId(user.getId());
        apiTokenPost.setName("testUser");
        APITokenGet apiTokenUser = apiTokenApi.createAPIToken(apiTokenPost);
        ApiClient apiClientUser = Config.getNoAuthApiClient();
        apiClientUser.setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH);
        apiClientUser.addDefaultHeader("Authorization", "Bearer " + apiTokenUser.getValue());
        discoveryApiUser = new DiscoveryApi(apiClientUser);
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();

        // This code is called before setUp() is called, so API token can be null
        if (apiToken != null)
            apiTokenApi.deleteAPIToken(apiToken.getId());
    }

    @Test
    public void discoverUserByPubKeyTest() throws ApiException {

        // Try to discover a user using an invalid key
        try {
            discoveryApiAdmin.discoverUserByPubKey("invalid pubKey");
            fail("Should not be able to discover a user using an invalid key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_BAD_REQUEST, e.getCode());
            return;
        }

        // Try to discover a user using a non-existing key
        try {
            discoveryApiAdmin.discoverUserByPubKey("3Beer3irc1vgs76ENA4coqsEQpGZeM5CTd");
            fail("Should not be able to discover a user using a non-existing key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
            return;
        }

        // Discover test user from his public key
        String key = keyApi.getKeyById(user.getDefaultKeyId()).getPubKey();
        UserDisco user = discoveryApiAdmin.discoverUserByPubKey(key);
        assertEquals(this.user.getId(), user.getId());
    }

    @Test
    public void discoverUserKeysTest() throws ApiException {

        // Try to discover user's keys using a non-existing user identifier
        try {
            discoveryApiAdmin.discoverUserKeys(Config.randomUUID());
            fail("Should not be able to discover user's key using a non-existing user identifier");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
            return;
        }

        // Discover test user's keys
        List<KeyDisco> keyDiscos = discoveryApiAdmin.discoverUserKeys(user.getId());

        // Check that test user's default key is part of his keys
        String pubKey = keyApi.getKeyById(user.getDefaultKeyId()).getPubKey();
        for (KeyDisco key : keyDiscos)
            if (key.getPubKey().equals(pubKey))
                return;
        fail("Test user's public key not found in key list");
    }

    @Test
    public void discoverUsersTest() throws ApiException {

        // Search the test user by his common name
        List<UserDisco> users = discoveryApiUser.discoverUsers(null, null, Config.TEST_NAME_PREFIX);
        assertEquals(1, users.size());
        assertEquals(users.get(0).getId(), user.getId());

        // Remember the test user
        UserDisco testUser = users.get(0);

        // Search the test user by his username
        users = discoveryApiUser.discoverUsers(null, null, Config.TEST_USERNAME_PREFIX);
        assertEquals(1, users.size());
        assertEquals(users.get(0).getId(), user.getId());

        // Get all users and check that the test user is part of the results
        users = discoveryApiUser.discoverUsers(null, null, null);
        assertTrue(users.size() > 1);
        assertTrue(users.contains(testUser));

        // Get all users with a limit of 2
        users = discoveryApiUser.discoverUsers(0, 2, null);
        assertEquals(2, users.size());

        // Remember 2nd user
        UserGet secondUser = users.get(1);

        // Get all users with an offset of 1 and a limit of 2
        users = discoveryApiUser.discoverUsers(1, 1, null);
        assertEquals(1, users.size());

        // Check that 2nd user is now first
        assertEquals(secondUser, users.get(0));
    }

    @Test
    public void discoverUserTest() throws ApiException {

        // Check that an authenticated admin token cannot discover himself
        UserDisco user = discoveryApiAdmin.discoverUser();
        assertNull(user);

        // Check that an authenticated user can discover himself
        user = discoveryApiUser.discoverUser();
        assertEquals(this.user.getId(), user.getId());
        assertNotNull(this.user.getCreatedAt());
        assertNotNull(this.user.getUpdatedAt());
        assertNull(this.user.getLastLogin());
        assertNotNull(this.user.getStatus());
        assertNotNull(this.user.getMode());
        assertNotNull(this.user.getRole());
        assertNotNull(this.user.getIdentity());
        assertNotNull(this.user.getDefaultKeyId());
    }

    @Test
    public void discoverConfigTest() throws ApiException {
        ConfigDisco configDisco = discoveryApiAdmin.discoverConfig();
        assertNotNull(configDisco.getIdentityURL());
    }
}
