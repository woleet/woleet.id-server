package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

public class IdentityApiTest {

    private static String WOLEET_ID_SERVER_IDENTITY_BASEPATH = System.getenv("WOLEET_ID_SERVER_IDENTITY_BASEPATH");

    static {
        if (WOLEET_ID_SERVER_IDENTITY_BASEPATH == null)
            WOLEET_ID_SERVER_IDENTITY_BASEPATH = "https://localhost:3000";
    }

    private UserGet user;

    @Before
    public void setUp() throws Exception {

        // Start from a clean state
        tearDown();

        // Create test user
        user = Config.createTestUser();
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();
    }

    @Test
    public void getIdentityTest() throws ApiException {

        IdentityApi identityApi = new IdentityApi(Config.getNoAuthApiClient()
                .setBasePath(WOLEET_ID_SERVER_IDENTITY_BASEPATH));

        KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());

        String leftData = Config.randomString(32);

        // Check that we cannot get an identity from an invalid public key
        try {
            identityApi.getIdentity("invalid pubKey", null);
            fail("Should not be able to get an identity with an invalid key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Check that we cannot get an identity from a public key that does not exist
        try {
            identityApi.getIdentity("1iBDiJNw1moBD37mqjCVQNxGbEeqXtWnUG", null);
            fail("Should not be able to get an identity with an non existing key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Check that server's default key and identity URL are set
        ServerConfig serverConfig = new ServerConfigApi(Config.getAdminAuthApiClient()).getServerConfig();
        assertTrue(serverConfig.getFallbackOnDefaultKey());
        assertNotNull(serverConfig.getIdentityURL());
        assertNotNull(serverConfig.getDefaultKeyId());

        // Create an expired key
        KeyPost keyPost = new KeyPost();
        keyPost.setName(Config.randomName());
        keyPost.setExpiration(Config.randomTimestamp() - (3600L * 1000L));
        KeyGet expiredKey = keyApi.createKey(user.getId(), keyPost);

        // Check that the key is expired
        IdentityResult expiredIdentity = identityApi.getIdentity(expiredKey.getPubKey(), leftData);
        assertNotNull(expiredIdentity.getSignature());
        assertNotNull(expiredIdentity.getIdentity());
        assertEquals(expiredIdentity.getKey().getStatus(), Key.StatusEnum.EXPIRED);

        // Get server's default public key
        String pubKey = keyApi.getKeyById(serverConfig.getDefaultKeyId()).getPubKey();
        assertNotNull(pubKey);

        // Delete expired key
        keyApi.deleteKey(expiredKey.getId());

        // Get and verify server's default identity
        IdentityResult identityResult = identityApi.getIdentity(pubKey, leftData);
        assertNotNull(identityResult.getIdentity());
        assertNotNull(identityResult.getIdentity().getCommonName());
        assertNotNull(identityResult.getRightData());
        assertNotNull(identityResult.getSignature());
        assertNotNull(identityResult.getKey());
        assertEquals(identityResult.getKey().getPubKey(), pubKey);
        assertNotNull(identityResult.getKey().getStatus());
        assertTrue(
                "Expected " + identityResult.getRightData()
                        + "to start with \"" + serverConfig.getIdentityURL()
                        + "\" but got \"" + identityResult.getRightData() + "\"",
                identityResult.getRightData().startsWith(serverConfig.getIdentityURL())
        );
        assertTrue(Config.isValidSignature(pubKey, identityResult.getSignature(), leftData + identityResult.getRightData()));

        // Create an external key
        ExternalKeyPost externalKeyPost = new ExternalKeyPost();
        externalKeyPost.setName(Config.randomName());
        externalKeyPost.setPublicKey(Config.randomAddress());
        KeyGet externalIdentityKey = keyApi.createExternalKey(user.getId(), externalKeyPost);

        // Test external key identity
        IdentityResult externalIdentity = identityApi.getIdentity(externalIdentityKey.getPubKey(), null);
        assertNull(externalIdentity.getSignature());
        assertNotNull(externalIdentity.getKey());
        assertEquals(Key.StatusEnum.VALID, externalIdentity.getKey().getStatus());
        assertEquals(externalKeyPost.getPublicKey(), externalIdentity.getKey().getPubKey());
        assertNotNull(externalIdentity.getIdentity());
        assertNotNull(externalIdentity.getIdentity().getCommonName());

        // Delete external key
        keyApi.deleteKey(externalIdentityKey.getId());
    }
}
