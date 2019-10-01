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

    private UserGet userSeal, userESign;

    private SignatureApi adminAuthApi, userAuthApi, noAuthApi, tokenAuthAdminApi, tokenAuthUserSealApi, tokenAuthUserESignGet;

    private ApiTokenApi apiTokenApi;
    private APITokenGet apiTokenAdminGet, apiTokenUserSealGet, apiTokenUserESignGet;

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
        userSeal = Config.createTestUser();
        userESign = Config.createTestUser(UserModeEnum.ESIGN);
        userAuthApi = new SignatureApi(Config.getAuthApiClient(userSeal.getUsername(), "pass")
            .setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH));
        noAuthApi = new SignatureApi(Config.getNoAuthApiClient()
            .setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH));

        apiTokenApi = new ApiTokenApi(Config.getAdminAuthApiClient());

        // Create a helper API with API token authentication (with admin right)
        apiTokenAdminGet = apiTokenApi.createAPIToken((APITokenPost) new APITokenPost().name("test-admin"));
        ApiClient apiClientAdmin = Config.getNoAuthApiClient().setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH);
        apiClientAdmin.addDefaultHeader("Authorization", "Bearer " + apiTokenAdminGet.getValue());
        tokenAuthAdminApi = new SignatureApi(apiClientAdmin);

        // Create a helper API with API token authentication (with user rights)
        APITokenPost apiTokenUser = new APITokenPost();
        apiTokenUser.setName("test-user");
        apiTokenUser.setUserId(userSeal.getId());
        apiTokenUserSealGet = apiTokenApi.createAPIToken(apiTokenUser);
        apiTokenUser.setUserId(userESign.getId());
        apiTokenUserESignGet = apiTokenApi.createAPIToken(apiTokenUser);
        ApiClient apiClientUserSeal = Config.getNoAuthApiClient().setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH);
        apiClientUserSeal.addDefaultHeader("Authorization", "Bearer " + apiTokenUserSealGet.getValue());
        tokenAuthUserSealApi = new SignatureApi(apiClientUserSeal);
        ApiClient apiClientUserESign = Config.getNoAuthApiClient().setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH);
        apiClientUserESign.addDefaultHeader("Authorization", "Bearer " + apiTokenUserESignGet.getValue());
        tokenAuthUserESignGet = new SignatureApi(apiClientUserESign);
    }

    @After
    public void tearDown() throws Exception {

        // This code is called before setUp() is called, so API token can be null
        if (apiTokenAdminGet != null) {
            apiTokenApi.deleteAPIToken(apiTokenAdminGet.getId());
            apiTokenAdminGet = null;
        }
        if (apiTokenUserSealGet != null) {
            apiTokenApi.deleteAPIToken(apiTokenUserSealGet.getId());
            apiTokenUserSealGet = null;
        }
        if (apiTokenUserESignGet != null) {
            apiTokenApi.deleteAPIToken(apiTokenUserESignGet.getId());
            apiTokenUserESignGet = null;
        }

        Config.deleteAllTestUsers();
    }

    @Test
    public void getSignatureTest() throws ApiException {

        // Try to sign with no credentials
        try {
            noAuthApi.getSignature(Config.randomHash(), null, null, null);
            fail("Should not be able to get a signature with no credentials");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign with user credentials
        try {
            userAuthApi.getSignature(Config.randomHash(), null, null, null);
            fail("Should not be able to sign with user credentials");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign with admin credentials
        try {
            adminAuthApi.getSignature(Config.randomHash(), null, null, null);
            fail("Should not be able to sign with admin credentials");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign an invalid hash
        try {
            tokenAuthAdminApi.getSignature("invalid hash", null, null, null);
            fail("Should not be able to sign an invalid hash");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Try to sign using an invalid key
        try {
            String hashToSign = Config.randomHash();
            tokenAuthAdminApi.getSignature(hashToSign, null, null, "invalid pubKey");
            fail("Should not be able to sign using an invalid key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Try to sign using a non existing key
        try {
            String hashToSign = Config.randomHash();
            tokenAuthAdminApi.getSignature(hashToSign, null, null, "1iBDiJNw1moBD37mqjCVQNxGbEeqXtWnUG");
            fail("Should not be able to sign using a non existing key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non existing user (userId)
        try {
            String hashToSign = Config.randomHash();
            tokenAuthAdminApi.getSignature(hashToSign, Config.randomUUID(), null, null);
            fail("Should not be able to sign using a non existing user");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non existing user (customUserId)
        try {
            String hashToSign = Config.randomHash();
            tokenAuthAdminApi.getSignature(hashToSign, null, "non existing customUserId", null);
            fail("Should not be able to sign using a non existing user");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non existing key
        try {
            String hashToSign = Config.randomHash();
            tokenAuthAdminApi.getSignature(hashToSign, null, null, "1iBDiJNw1moBD37mqjCVQNxGbEeqXtWnUG");
            fail("Should not be able to sign using a non existing key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign with as a different user
        try {
            KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
            String hashToSign = Config.randomHash();
            KeyGet keyGet = keyApi.getKeyById(userSeal.getDefaultKeyId());
            String pubKey = keyGet.getPubKey();
            tokenAuthUserSealApi.getSignature(hashToSign, userESign.getId(), null, pubKey);
            fail("Should not be able to sign as a different user");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign with a non owned key
        try {
            KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
            String hashToSign = Config.randomHash();
            KeyGet keyGet = keyApi.getKeyById(Config.createTestUser(UserModeEnum.SEAL).getDefaultKeyId());
            String pubKey = keyGet.getPubKey();
            tokenAuthUserSealApi.getSignature(hashToSign, null, null, pubKey);
            fail("Should not be able to find a non owned key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign as an e-signature user with an admin token
        try {
            KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
            String hashToSign = Config.randomHash();
            KeyGet keyGet = keyApi.getKeyById(userESign.getDefaultKeyId());
            String pubKey = keyGet.getPubKey();
            tokenAuthAdminApi.getSignature(hashToSign, null, null, pubKey);
            fail("Should not be able to sign as an e-signature user with an admin token");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign as an e-signature user with an admin token
        try {
            String hashToSign = Config.randomHash();
            tokenAuthAdminApi.getSignature(hashToSign, userESign.getId(), null, null);
            fail("Should not be able to sign as an e-signature user with an admin token");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Sign using the server's default key
        String hashToSign = Config.randomHash();
        SignatureResult signatureResult = tokenAuthAdminApi.getSignature(hashToSign, null, null, null);
        assertNotNull(signatureResult.getIdentityURL());
        assertTrue(Config.isValidPubKey(signatureResult.getPubKey()));
        assertEquals(hashToSign, signatureResult.getSignedHash());
        verifySignatureValid(signatureResult.getSignedHash(), signatureResult);

        // Sign using the user's default key with an assigned token
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthUserSealApi.getSignature(hashToSign, null, null, null);
        assertNotNull(signatureResult.getIdentityURL());
        assertTrue(Config.isValidPubKey(signatureResult.getPubKey()));
        assertEquals(hashToSign, signatureResult.getSignedHash());
        verifySignatureValid(signatureResult.getSignedHash(), signatureResult);

        // FIXME: WOLEET-1141: Since we just used the API token to sign, its last used should be close to current time
//        apiTokenAdminGet = apiTokenApi.getAPITokenById(apiTokenAdminGet.getId());
//        assertTrue(apiTokenAdminGet.getLastUsed() < System.currentTimeMillis() + 60L * 1000L
//                && apiTokenAdminGet.getLastUsed() > System.currentTimeMillis() - 60L * 1000L);

        // Change server config not to fallback on default key
        ServerConfigApi serverConfigApi = new ServerConfigApi(Config.getAdminAuthApiClient());
        ServerConfig serverConfig = serverConfigApi.getServerConfig();
        serverConfigApi.updateServerConfig(new ServerConfig().fallbackOnDefaultKey(false));

        // Try to sign using a non existing server's default key
        try {
            tokenAuthAdminApi.getSignature(hashToSign, null, null, null);
            fail("Should not be able to sign using a non existing server's default key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Reset server config
        serverConfigApi.updateServerConfig(serverConfig);

        // Sign using user's default key (userId)
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthAdminApi.getSignature(hashToSign, userSeal.getId(), null, null);
        verifySignatureValid(hashToSign, signatureResult);

        // Sign using user's default key (userId) with an assigned token
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthUserSealApi.getSignature(hashToSign, userSeal.getId(), null, null);
        verifySignatureValid(hashToSign, signatureResult);

        // Sign using user's default key (customUserId)
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthAdminApi.getSignature(hashToSign, null, userSeal.getIdentity().getUserId(), null);
        verifySignatureValid(hashToSign, signatureResult);

        // Sign using user's default key (customUserId) with an assigned token
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthUserSealApi.getSignature(hashToSign, null, userSeal.getIdentity().getUserId(), null);
        verifySignatureValid(hashToSign, signatureResult);

        // Sign using e-signature user's default key (pubKey) with an assigned token
        KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
        hashToSign = Config.randomHash();
        KeyGet keyGet = keyApi.getKeyById(userESign.getDefaultKeyId());
        String pubKey = keyGet.getPubKey();
        signatureResult = tokenAuthUserESignGet.getSignature(hashToSign, null, null, pubKey);
        verifySignatureValid(hashToSign, signatureResult);

        // Sign using e-signature user's id with an assigned token
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthUserESignGet.getSignature(hashToSign, userESign.getId(), null, null);
        verifySignatureValid(hashToSign, signatureResult);

        // Sign using user's default key (pubKey)
        hashToSign = Config.randomHash();
        keyGet = keyApi.getKeyById(userSeal.getDefaultKeyId());
        pubKey = keyGet.getPubKey();
        signatureResult = tokenAuthAdminApi.getSignature(hashToSign, null, null, pubKey);
        verifySignatureValid(hashToSign, signatureResult);

        // Sign using user's default key (pubKey) with an assigned token
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthUserSealApi.getSignature(hashToSign, null, null, pubKey);
        verifySignatureValid(hashToSign, signatureResult);

        // Check that default key's last used time is close to current time
        keyGet = keyApi.getKeyById(userSeal.getDefaultKeyId());
        assertTrue(keyGet.getLastUsed() < System.currentTimeMillis() + 60L * 1000L
                   && keyGet.getLastUsed() > System.currentTimeMillis() - 60L * 1000L);

        // Check that API token's last used time is close to current time
        apiTokenUserSealGet = apiTokenApi.getAPITokenById(apiTokenUserSealGet.getId());
        assertTrue(apiTokenUserSealGet.getLastUsed() < System.currentTimeMillis() + 60L * 1000L
                   && apiTokenUserSealGet.getLastUsed() > System.currentTimeMillis() - 60L * 1000L);

        // Try to sign with a blocked key
        try {
            KeyPut keyPut = new KeyPut();
            keyPut.setStatus(KeyStatusEnum.BLOCKED);
            KeyGet blockedKey = keyApi.updateKey(keyGet.getId(), keyPut);
            pubKey = blockedKey.getPubKey();
            tokenAuthAdminApi.getSignature(hashToSign, null, null, pubKey);
            fail("Should not be able to sign as a different user");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Delete user's default key
        keyApi.deleteKey(keyGet.getId());

        // Verify that the user's default key is unset after deletion
        assertNull(new UserApi(Config.getAdminAuthApiClient()).getUserById(userSeal.getId()).getDefaultKeyId());

        // Try to sign using a non existing user's default key
        try {
            tokenAuthAdminApi.getSignature(hashToSign, userSeal.getId(), null, null);
            fail("Should not be able to sign using a non existing user's default key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to sign using a non existing user's default key with an assigned token
        try {
            tokenAuthUserSealApi.getSignature(hashToSign, userSeal.getId(), null, null);
            fail("Should not be able to sign using a non existing user's default key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to sign using a non existing user's default key
        try {
            tokenAuthAdminApi.getSignature(hashToSign, null, null, pubKey);
            fail("Should not be able to sign using a non existing user's default key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non existing user's default key with an assigned token
        try {
            tokenAuthUserSealApi.getSignature(hashToSign, null, null, pubKey);
            fail("Should not be able to sign using a non existing user's default key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }
}
