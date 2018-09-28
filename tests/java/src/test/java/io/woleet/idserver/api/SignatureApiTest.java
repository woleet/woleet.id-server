package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

public class SignatureApiTest {

    private UserGet user;

    private SignatureApi adminAuthApi, userAuthApi, noAuthApi, tokenAuthApi;

    private ApiTokenApi apiTokenApi;
    private APITokenGet apiTokenGet;

    private void verifySignatureValid(String hashToSign, SignatureResult signatureResult, ServerConfig serverConfig) {
        assertNotNull(signatureResult.getIdentityURL());
        assertEquals(serverConfig.getIdentityURL(), signatureResult.getIdentityURL());
        assertTrue(Config.isValidPubKey(signatureResult.getPubKey()));
        assertEquals(hashToSign, signatureResult.getSignedHash());
        assertTrue(Config.isValidSignature(signatureResult.getPubKey(), signatureResult.getSignature(),
                signatureResult.getSignedHash()));
    }

    @Before
    public void setUp() throws Exception {

        // Start form a clean state
        tearDown();

        // Create 3 helper APIs: one with admin rights, one with user rights, one not authenticated
        adminAuthApi = new SignatureApi(Config.getAdminAuthApiClient());
        user = Config.createTestUser();
        userAuthApi = new SignatureApi(Config.getAuthApiClient(user.getUsername(), "pass"));
        noAuthApi = new SignatureApi(Config.getNoAuthApiClient());

        // Create an helper API with API token authentication
        apiTokenApi = new ApiTokenApi(Config.getAdminAuthApiClient());
        apiTokenGet = apiTokenApi.createAPIToken((APITokenPost) new APITokenPost().name("test"));
        ApiClient apiClient = Config.getNoAuthApiClient();
        apiClient.addDefaultHeader("Authorization", "Bearer " + apiTokenGet.getValue());
        tokenAuthApi = new SignatureApi(apiClient);
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();

        // This code is called before setUp() is called, so API token can be null
        if (apiTokenGet != null)
            apiTokenApi.deleteAPIToken(apiTokenGet.getId());
    }

    @Test
    public void getSignatureTest() throws ApiException {

        // Try to sign with no credentials
        try {
            noAuthApi.getSignature(Config.randomHash(), null, null, null);
            fail("Should not be able to get a signature with no credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign with user credentials
        try {
            userAuthApi.getSignature(Config.randomHash(), null, null, null);
            fail("Should not be able to sign with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign with admin attributes
        try {
            adminAuthApi.getSignature(Config.randomHash(), null, null, null);
            fail("Should not be able to sign with admin credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign an invalid hash
        try {
            tokenAuthApi.getSignature("invalid hash", null, null, null);
            fail("Should not be able to sign an invalid hash");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Try to sign using an invalid key
        try {
            String hashToSign = Config.randomHash();
            tokenAuthApi.getSignature(hashToSign, null, null, "invalid pubKey");
            fail("Should not be able to sign using an invalid key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Try to sign using a non existing user (userId)
        try {
            String hashToSign = Config.randomHash();
            tokenAuthApi.getSignature(hashToSign, Config.randomUUID(), null, null);
            fail("Should not be able to sign using a non existing user");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non existing user (customUserId)
        try {
            String hashToSign = Config.randomHash();
            tokenAuthApi.getSignature(hashToSign, null, "non existing customUserId", null);
            fail("Should not be able to sign using a non existing user");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non existing key
        try {
            String hashToSign = Config.randomHash();
            tokenAuthApi.getSignature(hashToSign, null, null, "1iBDiJNw1moBD37mqjCVQNxGbEeqXtWnUG");
            fail("Should not be able to sign using a non existing key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Sign using the server's default key
        String hashToSign = Config.randomHash();
        SignatureResult signatureResult = tokenAuthApi.getSignature(hashToSign, null, null, null);
        assertNotNull(signatureResult.getIdentityURL());
        assertTrue(Config.isValidPubKey(signatureResult.getPubKey()));
        assertEquals(hashToSign, signatureResult.getSignedHash());
        assertTrue(Config.isValidSignature(signatureResult.getPubKey(), signatureResult.getSignature(), signatureResult
                .getSignedHash()));

        // Change server config not to fallback on default key
        ServerConfigApi serverConfigApi = new ServerConfigApi(Config.getAdminAuthApiClient());
        ServerConfig serverConfig = serverConfigApi.getServerConfig();
        serverConfigApi.updateServerConfig(new ServerConfig().fallbackOnDefaultKey(false));

        // Try to sign using a non existing server's default key
        try {
            tokenAuthApi.getSignature(hashToSign, null, null, null);
            fail("Should not be able to sign using a non existing server's default key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Reset server config
        serverConfigApi.updateServerConfig(serverConfig);

        // Sign using user's default key (userId)
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthApi.getSignature(hashToSign, user.getId(), null, null);
        verifySignatureValid(hashToSign, signatureResult, serverConfig);

        // Sign using user's default key (customUserId)
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthApi.getSignature(hashToSign, null, user.getIdentity().getUserId(), null);
        verifySignatureValid(hashToSign, signatureResult, serverConfig);

        // Sign using user's default key (pubKey)
        KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
        hashToSign = Config.randomHash();
        KeyGet keyGet = keyApi.getKeyById(user.getDefaultKeyId());
        String pubKey = keyGet.getPubKey();
        signatureResult = tokenAuthApi.getSignature(hashToSign, null, null, pubKey);
        verifySignatureValid(hashToSign, signatureResult, serverConfig);

//        // FIXME: this cannot work because attributes cannot be unset
//        // Unset user's default key
//        UserApi userApi = new UserApi(Config.getAdminAuthApiClient());
//        UserGet userGet = userApi.updateUser(user.getId(), (UserPut) new UserPut().defaultKeyId(null));
//        assertNull(userGet.getDefaultKeyId());

        // Delete user's default key
        keyApi.deleteKey(keyGet.getId());

        // Verify that the user's default key is unset after deletion
        assertNull(new UserApi(Config.getAdminAuthApiClient()).getUserById(user.getId()).getDefaultKeyId());

        // Try to sign using a non existing user's default key
        try {
            tokenAuthApi.getSignature(hashToSign, user.getId(), null, null);
            fail("Should not be able to sign using a non existing user's default key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to sign using a non existing user's default key
        try {
            tokenAuthApi.getSignature(hashToSign, null, null, pubKey);
            fail("Should not be able to sign using a non existing user's default key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }
}
