package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

public class DiscoveryApiTest {

    private static String WOLEET_ID_SERVER_SIGNATURE_BASEPATH = System.getenv("WOLEET_ID_SERVER_SIGNATURE_BASEPATH");

    static {
        if (WOLEET_ID_SERVER_SIGNATURE_BASEPATH == null)
            WOLEET_ID_SERVER_SIGNATURE_BASEPATH = "https://localhost:3000";
    }

    private UserGet user;

    private DiscoveryApi discoveryApi;

    private ApiTokenApi apiTokenApi;
    private APITokenGet apiToken;

    private KeyApi keyApi;

    @Before
    public void setUp() throws Exception {

        // Start from a clean state
        tearDown();

        // Create test user
        user = Config.createTestUser();

        // Create kep API
        keyApi = new KeyApi(Config.getAdminAuthApiClient().setBasePath(Config.WOLEET_ID_SERVER_API_BASEPATH));

        // Create an helper API with API token authentication
        apiTokenApi = new ApiTokenApi(Config.getAdminAuthApiClient());
        apiToken = apiTokenApi.createAPIToken((APITokenPost) new APITokenPost().name("test"));
        ApiClient apiClient = Config.getNoAuthApiClient();
        apiClient.setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH);
        apiClient.addDefaultHeader("Authorization", "Bearer " + apiToken.getValue());
        discoveryApi = new DiscoveryApi(apiClient);
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
            discoveryApi.discoverUserByPubKey("invalid pubKey");
            fail("Should not be able to discover a user using an invalid key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", 400, e.getCode());
            return;
        }

        // Try to discover a user using an unknown key
        try {
            discoveryApi.discoverUserByPubKey("3Beer3irc1vgs76ENA4coqsEQpGZeM5CTd");
            fail("Should not be able to discover a user using an unknown key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", 404, e.getCode());
            return;
        }

        // Discover test user from his public key
        String key = keyApi.getKeyById(user.getDefaultKeyId()).getPubKey();
        UserDisco response = discoveryApi.discoverUserByPubKey(key);
        assertEquals(user.getId(), response.getId());
    }

    @Test
    public void discoverUserKeysTest() throws ApiException {

        // Try to discover user's keys using an unknown identifier
        try {
            discoveryApi.discoverUserKeys(Config.randomUUID());
            fail("Should not be able to discover user's key using an unknown identifier");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", 404, e.getCode());
            return;
        }

        // Discover test user's keys
        List<KeyDisco> response = discoveryApi.discoverUserKeys(user.getId());

        // Check that test user's default key is part of his keys
        String pubKey = keyApi.getKeyById(user.getDefaultKeyId()).getPubKey();
        for (KeyDisco key : response)
            if (key.getPubKey().equals(pubKey))
                return;
        fail("Test user's public key not found in key list");
    }

    @Test
    public void discoverUsersTest() throws ApiException {
        List<UserDisco> response = discoveryApi.discoverUsers("test");
        for (UserDisco u : response)
            if (u.getId().equals(user.getId()))
                return;
        fail("Test user not found in user list");
    }

    @Test
    public void discoverUserTest() throws ApiException {
        // TODO: The API token created has a userId set to null, so it is not possible to discover the current user.
    }

    @Test
    public void discoverConfigTest() throws ApiException {
        ConfigDisco response = discoveryApi.discoverConfig();
        assertNotNull(response.getIdentityURL());
    }
}
