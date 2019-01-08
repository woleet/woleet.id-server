package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.List;
import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class DiscoveryApiTest {

    private static String WOLEET_ID_SERVER_SIGNATURE_BASEPATH = System.getenv("WOLEET_ID_SERVER_SIGNATURE_BASEPATH");

    static {
        if (WOLEET_ID_SERVER_SIGNATURE_BASEPATH == null)
            WOLEET_ID_SERVER_SIGNATURE_BASEPATH = "https://localhost:3002";
    }

    private UserGet user;

    private DiscoveryApi discoverApi;

    private ApiTokenApi apiTokenApi;
    private APITokenGet apiTokenGet;

    private KeyApi keyApi;

    @Before
    public void setUp() throws Exception {

        // Start from a clean state
        tearDown();

        user = Config.createTestUser();
        keyApi = new KeyApi(Config.getAdminAuthApiClient().setBasePath(Config.WOLEET_ID_SERVER_API_BASEPATH));

        // Create an helper API with API token authentication
        apiTokenApi = new ApiTokenApi(Config.getAdminAuthApiClient());
        apiTokenGet = apiTokenApi.createAPIToken((APITokenPost) new APITokenPost().name("test"));

        ApiClient apiClient = Config.getNoAuthApiClient();
        apiClient.setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH);
        apiClient.addDefaultHeader("Authorization", "Bearer " + apiTokenGet.getValue());
        discoverApi = new DiscoveryApi(apiClient);
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();

        // This code is called before setUp() is called, so API token can be null
        if (apiTokenGet != null)
            apiTokenApi.deleteAPIToken(apiTokenGet.getId());
    }

    /**
     * Get the user associated to a unknown public key.
     * <p>
     * Use this endpoint to get the user owning a given public key.
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void discoverUserByPubKeyTest() throws ApiException {
        String key = keyApi.getKeyById(user.getDefaultKeyId()).getPubKey();
        UserDisco response = discoverApi.discoverUserByPubKey(key);
        assertEquals(user.getId(), response.getId());
    }

    /**
     * Get the user associated to an unknown public key must return 404.
     */
    @Test
    public void discoverUnknownUserByPubKeyTest() {
        try {
            discoverApi.discoverUserByPubKey("3Beer3irc1vgs76ENA4coqsEQpGZeM5CTd");
        } catch (ApiException e) {
            assertEquals("API should throw a 404 exception", 404, e.getCode());
            return;
        }
        fail("API should throw an exception when an unknown user is requested");
    }

    /**
     * Get all public keys of a user.
     * <p>
     * Use this endpoint to get all public keys owned by a given user.
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void discoverUserKeysTest() throws ApiException {
        String pubKey = keyApi.getKeyById(user.getDefaultKeyId()).getPubKey();
        List<KeyDisco> response = discoverApi.discoverUserKeys(user.getId());
        for (KeyDisco key : response)
            if (key.getPubKey().equals(pubKey))
                return;
        fail("Public key not found in key list");
    }

    /**
     * Get all public keys of an unknown user must return 404.
     */
    @Test
    public void discoverUnknownUserKeysTest() {
        try {
            discoverApi.discoverUserKeys(UUID.randomUUID());
        } catch (ApiException e) {
            assertEquals("API should throw a 404 exception", 404, e.getCode());
            return;
        }
        fail("API should throw an exception when an unknown user is requested");
    }

    /**
     * Get all users matching a search string.
     * <p>
     * Use this endpoint to get all users whose &#x60;email&#x60;, &#x60;username&#x60;, &#x60;x500CommonName&#x60;, &#x60;x500Organization&#x60; or &#x60;x500OrganizationalUnit&#x60; contains the search string.
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void discoverUsersTest() throws ApiException {
        String search = "test";
        List<UserDisco> response = discoverApi.discoverUsers(search);
        for (UserDisco u : response)
            if (u.getId().equals(user.getId()))
                return;
        fail("User not found in user list");
    }

    /**
     * Get the user associated with the authorization token.
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void discoverUserTest() throws ApiException {
        // TODO: The APIToken created has a userId to null. This should be addressed in order to test discoverUserTest
        //UserDisco response = discoverApi.discoverUser();
        //assertEquals(user.getId(), response.getId());
    }
}
