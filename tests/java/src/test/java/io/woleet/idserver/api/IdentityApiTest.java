package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;
import org.junit.Test;

import static org.junit.Assert.*;

public class IdentityApiTest {

    private static String WOLEET_ID_SERVER_IDENTITY_BASEPATH = System.getenv("WOLEET_ID_SERVER_IDENTITY_BASEPATH");

    static {
        if (WOLEET_ID_SERVER_IDENTITY_BASEPATH == null)
            WOLEET_ID_SERVER_IDENTITY_BASEPATH = "https://localhost:3000";
    }

    private UserGet user;

    {
        try {
            user = Config.createTestUser();
        } catch (ApiException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void getIdentityTest() throws ApiException {

        IdentityApi identityApi = new IdentityApi(Config.getNoAuthApiClient()
                .setBasePath(WOLEET_ID_SERVER_IDENTITY_BASEPATH));

        KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());

        try {
            identityApi.getIdentity("invalid pubKey", Config.randomString(32));
            fail("Should not be able to get an identity with an invalid key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        try {
            identityApi.getIdentity("1iBDiJNw1moBD37mqjCVQNxGbEeqXtWnUG", Config.randomString(32));
            fail("Should not be able to get an identity with an non existing key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Check that server's default key and identity URL are set
        ServerConfig serverConfig = new ServerConfigApi(Config.getAdminAuthApiClient()).getServerConfig();
        assertTrue(serverConfig.getFallbackOnDefaultKey());
        assertNotNull(serverConfig.getIdentityURL());
        assertNotNull(serverConfig.getDefaultKeyId());

        String leftData = Config.randomString(32);

        // Create expired key
        KeyPost keyPost = new KeyPost();
        keyPost.setName(Config.randomName());
        keyPost.setExpiration(Config.randomTimestamp()/10);
        KeyGet expiredKey = keyApi.createKey(user.getId(), keyPost);

        // Test if the created expired key status is expired
        IdentityResult expiredIdentity = identityApi.getIdentity(expiredKey.getPubKey(), leftData);
        assertEquals(expiredIdentity.getKey().getStatus(),Key.StatusEnum.EXPIRED);

        // Get server's default public key
        String pubKey = keyApi.getKeyById(serverConfig.getDefaultKeyId())
                .getPubKey();
        assertNotNull(pubKey);

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

        // Create External key
        ExternalKeyPost externalKeyPost = new ExternalKeyPost();
        externalKeyPost.setName(Config.randomName());
        externalKeyPost.setPublicKey(Config.randomAddress());
        KeyGet externalIdentityKey = keyApi.createExternalKey(user.getId(), externalKeyPost);


        // Test the external key
        IdentityResult externalIdentity = identityApi.getIdentity(externalIdentityKey.getPubKey(), null);
        assertNull(externalIdentity.getSignature());
        assertNotNull(externalIdentity.getKey().getStatus());
        assertNotNull(externalIdentity.getKey());
        assertNotNull(externalIdentity.getIdentity());
        assertNotNull(externalIdentity.getIdentity().getCommonName());
        assertEquals(externalIdentity.getKey().getPubKey(), externalKeyPost.getPublicKey());

        keyApi.deleteKey(expiredKey.getId());
        keyApi.deleteKey(externalIdentityKey.getId());
    }
}
