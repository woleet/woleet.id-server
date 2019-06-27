package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.IdentityResult;
import io.woleet.idserver.api.model.ServerConfig;
import org.apache.http.HttpStatus;
import org.junit.Test;

import static org.junit.Assert.*;

public class IdentityApiTest {

    private static String WOLEET_ID_SERVER_IDENTITY_BASEPATH = System.getenv("WOLEET_ID_SERVER_IDENTITY_BASEPATH");

    static {
        if (WOLEET_ID_SERVER_IDENTITY_BASEPATH == null)
            WOLEET_ID_SERVER_IDENTITY_BASEPATH = "https://localhost:3001";
    }

    @Test
    public void getIdentityTest() throws ApiException {

        IdentityApi identityApi = new IdentityApi(Config.getNoAuthApiClient()
                .setBasePath(WOLEET_ID_SERVER_IDENTITY_BASEPATH));

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

        // Get server's default public key
        String pubKey = new KeyApi(Config.getAdminAuthApiClient()).getKeyById(serverConfig.getDefaultKeyId())
                .getPubKey();
        assertNotNull(pubKey);

        // Get and verify server's default identity
        String leftData = Config.randomString(32);
        IdentityResult identityResult = identityApi.getIdentity(pubKey, leftData);
        assertNotNull(identityResult.getIdentity());
        assertNotNull(identityResult.getIdentity().getCommonName());
        assertNotNull(identityResult.getRightData());
        assertNotNull(identityResult.getSignature());
        // TODO: verify getExpiration() getExpired() and getKey()
        assertTrue(
                "Expected " + identityResult.getRightData()
                        + "to start with \"" + serverConfig.getIdentityURL()
                        + "\" but got \"" + identityResult.getRightData() + "\"",
                identityResult.getRightData().startsWith(serverConfig.getIdentityURL())
        );
        assertTrue(Config.isValidSignature(pubKey, identityResult.getSignature(), leftData + identityResult.getRightData()));

        // TODO: verify identity related to external keys
    }
}
