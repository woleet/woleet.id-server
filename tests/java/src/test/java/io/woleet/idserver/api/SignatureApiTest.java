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

    private static String WOLEET_ID_SERVER_SIGNATURE_BASEPATH = System.getenv("WOLEET_ID_SERVER_SIGNATURE_BASEPATH");

    static {
        if (WOLEET_ID_SERVER_SIGNATURE_BASEPATH == null)
            WOLEET_ID_SERVER_SIGNATURE_BASEPATH = "https://localhost:3000";
    }

    private UserGet user, user2;

    private SignatureApi adminAuthApi, userAuthApi, noAuthApi, tokenAuthNoUserApi, tokenAuthUserApi;

    private ApiTokenApi apiTokenApi;
    private APITokenGet apiTokenNoUserGet, apiTokenUserGet;

    private void verifySignatureValid(String hashToSign, SignatureResult signatureResult) throws ApiException {
        assertNotNull(signatureResult.getIdentityURL());
        ServerConfigApi serverConfigApi = new ServerConfigApi(Config.getAdminAuthApiClient());
        ServerConfig serverConfig = serverConfigApi.getServerConfig();
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
        adminAuthApi = new SignatureApi(Config.getAdminAuthApiClient()
                .setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH));
        user = Config.createTestUser();
        user2 = Config.createTestUser();
        userAuthApi = new SignatureApi(Config.getAuthApiClient(user.getUsername(), "pass")
                .setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH));
        noAuthApi = new SignatureApi(Config.getNoAuthApiClient()
                .setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH));

        // Create an helper API with API token authentication
        apiTokenApi = new ApiTokenApi(Config.getAdminAuthApiClient());
        apiTokenNoUserGet = apiTokenApi.createAPIToken((APITokenPost) new APITokenPost().name("test"));
        APITokenPost apiTokenUser= new APITokenPost();
        apiTokenUser.setName("test-user");
        apiTokenUser.setUserId(user.getId());
        apiTokenUserGet = apiTokenApi.createAPIToken(apiTokenUser);
        ApiClient apiClientNoUser = Config.getNoAuthApiClient();
        ApiClient apiClientUser = Config.getNoAuthApiClient();
        apiClientNoUser.addDefaultHeader("Authorization", "Bearer " + apiTokenNoUserGet.getValue());
        tokenAuthNoUserApi = new SignatureApi(apiClientNoUser);
        apiClientUser.addDefaultHeader("Authorization", "Bearer " + apiTokenUserGet.getValue());
        tokenAuthUserApi = new SignatureApi(apiClientUser);
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();

        // This code is called before setUp() is called, so API token can be null
        if (apiTokenNoUserGet != null)
            apiTokenApi.deleteAPIToken(apiTokenNoUserGet.getId());
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
            tokenAuthNoUserApi.getSignature("invalid hash", null, null, null);
            fail("Should not be able to sign an invalid hash");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Try to sign using an invalid key
        try {
            String hashToSign = Config.randomHash();
            tokenAuthNoUserApi.getSignature(hashToSign, null, null, "invalid pubKey");
            fail("Should not be able to sign using an invalid key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Try to sign using a non existing user (userId)
        try {
            String hashToSign = Config.randomHash();
            tokenAuthNoUserApi.getSignature(hashToSign, Config.randomUUID(), null, null);
            fail("Should not be able to sign using a non existing user");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non existing user (customUserId)
        try {
            String hashToSign = Config.randomHash();
            tokenAuthNoUserApi.getSignature(hashToSign, null, "non existing customUserId", null);
            fail("Should not be able to sign using a non existing user");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non existing key
        try {
            String hashToSign = Config.randomHash();
            tokenAuthNoUserApi.getSignature(hashToSign, null, null, "1iBDiJNw1moBD37mqjCVQNxGbEeqXtWnUG");
            fail("Should not be able to sign using a non existing key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign with as a different user
        try {
            KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
            String hashToSign = Config.randomHash();
            KeyGet keyGet = keyApi.getKeyById(user.getDefaultKeyId());
            String pubKey = keyGet.getPubKey();
            tokenAuthUserApi.getSignature(hashToSign, user2.getId(), null, pubKey);
            fail("Should not be able to sign as a different user");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign with a non owned key
        try {
            KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
            String hashToSign = Config.randomHash();
            KeyGet keyGet = keyApi.getKeyById(user2.getDefaultKeyId());
            String pubKey = keyGet.getPubKey();
            tokenAuthUserApi.getSignature(hashToSign, null, null, pubKey);
            fail("Should not be able to find a non owned key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Sign using the server's default key
        String hashToSign = Config.randomHash();
        SignatureResult signatureResult = tokenAuthNoUserApi.getSignature(hashToSign, null, null, null);
        assertNotNull(signatureResult.getIdentityURL());
        assertTrue(Config.isValidPubKey(signatureResult.getPubKey()));
        assertEquals(hashToSign, signatureResult.getSignedHash());
        verifySignatureValid(signatureResult.getSignedHash(), signatureResult);

        // Sign using the user's default key with an assigned token
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthUserApi.getSignature(hashToSign, null, null, null);
        assertNotNull(signatureResult.getIdentityURL());
        assertTrue(Config.isValidPubKey(signatureResult.getPubKey()));
        assertEquals(hashToSign, signatureResult.getSignedHash());
        verifySignatureValid(signatureResult.getSignedHash(), signatureResult);

        // FIXME: WOLEET-1141: Since we just used the API token to sign, its last used should be close to current time
//        apiTokenNoUserGet = apiTokenApi.getAPITokenById(apiTokenNoUserGet.getId());
//        assertTrue(apiTokenNoUserGet.getLastUsed() < System.currentTimeMillis() + 60L * 1000L
//                && apiTokenNoUserGet.getLastUsed() > System.currentTimeMillis() - 60L * 1000L);

        // Change server config not to fallback on default key
        ServerConfigApi serverConfigApi = new ServerConfigApi(Config.getAdminAuthApiClient());
        ServerConfig serverConfig = serverConfigApi.getServerConfig();
        serverConfigApi.updateServerConfig(new ServerConfig().fallbackOnDefaultKey(false));

        // Try to sign using a non existing server's default key
        try {
            tokenAuthNoUserApi.getSignature(hashToSign, null, null, null);
            fail("Should not be able to sign using a non existing server's default key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Reset server config
        serverConfigApi.updateServerConfig(serverConfig);

        // Sign using user's default key (userId)
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthNoUserApi.getSignature(hashToSign, user.getId(), null, null);
        verifySignatureValid(hashToSign, signatureResult);

        // Sign using user's default key (userId) with an assigned token
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthUserApi.getSignature(hashToSign, user.getId(), null, null);
        verifySignatureValid(hashToSign, signatureResult);

        // Sign using user's default key (customUserId)
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthNoUserApi.getSignature(hashToSign, null, user.getIdentity().getUserId(), null);
        verifySignatureValid(hashToSign, signatureResult);

        // Sign using user's default key (customUserId) with an assigned token
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthUserApi.getSignature(hashToSign, null, user.getIdentity().getUserId(), null);
        verifySignatureValid(hashToSign, signatureResult);

        // Sign using user's default key (pubKey)
        KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
        hashToSign = Config.randomHash();
        KeyGet keyGet = keyApi.getKeyById(user.getDefaultKeyId());
        String pubKey = keyGet.getPubKey();
        signatureResult = tokenAuthNoUserApi.getSignature(hashToSign, null, null, pubKey);
        verifySignatureValid(hashToSign, signatureResult);

        // Sign using user's default key (pubKey) with an assigned token
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthUserApi.getSignature(hashToSign, null, null, pubKey);
        verifySignatureValid(hashToSign, signatureResult);

        // FIXME: WOLEET-1141: Since we just used the key to sign, its last used should be close to current time
//        keyGet = keyApi.getKeyById(user.getDefaultKeyId());
//        assertTrue(keyGet.getLastUsed() < System.currentTimeMillis() + 60L * 1000L
//                && keyGet.getLastUsed() > System.currentTimeMillis() - 60L * 1000L);

        // Try to sign with a blocked key
        try {
            KeyPut keyPut = new KeyPut();
            keyPut.setStatus(KeyStatusEnum.BLOCKED);
            KeyGet blockedKey = keyApi.updateKey(keyGet.getId(), keyPut);
            pubKey = blockedKey.getPubKey();
            tokenAuthNoUserApi.getSignature(hashToSign, null, null, pubKey);
            fail("Should not be able to sign as a different user");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Delete user's default key
        keyApi.deleteKey(keyGet.getId());

        // Verify that the user's default key is unset after deletion
        assertNull(new UserApi(Config.getAdminAuthApiClient()).getUserById(user.getId()).getDefaultKeyId());

        // Try to sign using a non existing user's default key
        try {
            tokenAuthNoUserApi.getSignature(hashToSign, user.getId(), null, null);
            fail("Should not be able to sign using a non existing user's default key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to sign using a non existing user's default key with an assigned token
        try {
            tokenAuthUserApi.getSignature(hashToSign, user.getId(), null, null);
            fail("Should not be able to sign using a non existing user's default key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to sign using a non existing user's default key
        try {
            tokenAuthNoUserApi.getSignature(hashToSign, null, null, pubKey);
            fail("Should not be able to sign using a non existing user's default key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non existing user's default key with an assigned token
        try {
            tokenAuthUserApi.getSignature(hashToSign, null, null, pubKey);
            fail("Should not be able to sign using a non existing user's default key");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }
}
