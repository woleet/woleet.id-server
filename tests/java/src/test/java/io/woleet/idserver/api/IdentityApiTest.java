package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.concurrent.TimeUnit;

import static org.junit.Assert.*;

public class IdentityApiTest {

    private static String WOLEET_ID_SERVER_IDENTITY_BASEPATH = System.getenv("WOLEET_ID_SERVER_IDENTITY_BASEPATH");
    private static String WOLEET_ID_SERVER_SIGNATURE_BASEPATH = System.getenv("WOLEET_ID_SERVER_SIGNATURE_BASEPATH");

    static {
        if (WOLEET_ID_SERVER_IDENTITY_BASEPATH == null)
            WOLEET_ID_SERVER_IDENTITY_BASEPATH = "https://localhost:3001";

        if (WOLEET_ID_SERVER_SIGNATURE_BASEPATH == null)
            WOLEET_ID_SERVER_SIGNATURE_BASEPATH = "https://localhost:3002";
    }

    private UserGet userSeal, userESign;

    private SignatureApi tokenAuthUserESignApi;

    private UserApi userApi;

    @Before
    public void setUp() throws Exception {

        // Start from a clean state
        tearDown();

        // Create test users
        userSeal = Config.createTestUser(UserModeEnum.SEAL);
        userESign = Config.createTestUser(UserModeEnum.ESIGN);

        // Create a helper API with user rights using token authentication
        ApiClient apiClientUserESign = Config.getNoAuthApiClient().setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH);
        apiClientUserESign.addDefaultHeader("Authorization",
                "Bearer " + Config.createTestApiToken(userESign.getId()).getValue());
        tokenAuthUserESignApi = new SignatureApi(apiClientUserESign);

        // Create a user API with admin rights using cookie authentication
        userApi = new UserApi(Config.getAdminAuthApiClient());
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();
    }

    @Test
    public void getIdentityTest() throws ApiException, InterruptedException {

        // Switch the server in relaxed mode (don't prevent identity exposure)
        ServerConfigApi serverConfigApi = new ServerConfigApi(Config.getAdminAuthApiClient());
        ServerConfig serverConfig = serverConfigApi.getServerConfig();
        serverConfig.setPreventIdentityExposure(false);
        serverConfigApi.updateServerConfig(serverConfig);

        // Prepare test data
        IdentityApi identityApi = new IdentityApi(Config.getNoAuthApiClient()
                .setBasePath(WOLEET_ID_SERVER_IDENTITY_BASEPATH));
        KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
        String leftData = Config.randomString(32);

        // Check that we cannot get an identity from an invalid public key
        try {
            identityApi.getIdentity("invalid pubKey", null, null);
            fail("Should not be able to get an identity with an invalid key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Check that we cannot get an identity from a public key that does not exist
        try {
            identityApi.getIdentity("1iBDiJNw1moBD37mqjCVQNxGbEeqXtWnUG", null, null);
            fail("Should not be able to get an identity with an non-existing key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Check that server's default key and identity URL are set
        assertTrue(serverConfig.getFallbackOnDefaultKey());
        assertNotNull(serverConfig.getIdentityURL());
        assertNotNull(serverConfig.getDefaultKeyId());

        // Create a key that expired in 500ms
        KeyPost keyPost = new KeyPost();
        keyPost.setName(Config.randomName());
        Long expiration = Config.currentTimestamp() + 500L;
        keyPost.setExpiration(expiration);
        KeyGet expiredKey = keyApi.createKey(userSeal.getId(), keyPost);
        TimeUnit.MILLISECONDS.sleep(1000L);

        // Test expired key identity
        IdentityResult expiredIdentity = identityApi.getIdentity(expiredKey.getPubKey(), null, leftData);
        assertNotNull(expiredIdentity.getSignature());
        assertNotNull(expiredIdentity.getRightData());
        assertNotNull(expiredIdentity.getIdentity());
        assertEquals(userSeal.getIdentity().getCommonName(), expiredIdentity.getIdentity().getCommonName());
        assertNotNull(expiredIdentity.getKey());
        assertEquals(keyPost.getName(), expiredIdentity.getKey().getName());
        assertNotNull(expiredIdentity.getKey().getPubKey());
        assertEquals(expiration, expiredIdentity.getKey().getExpiration());
        assertEquals(Key.StatusEnum.EXPIRED, expiredIdentity.getKey().getStatus());
        assertTrue(expiredIdentity.getRightData().startsWith(serverConfig.getIdentityURL()));
        assertTrue(Config.isValidSignature(expiredKey.getPubKey(), expiredIdentity.getSignature(),
                leftData + expiredIdentity.getRightData()));

        // Create a blocked key
        keyPost = new KeyPost();
        keyPost.setName(Config.randomName());
        keyPost.setStatus(KeyStatusEnum.BLOCKED);
        KeyGet blockedKey = keyApi.createKey(userSeal.getId(), keyPost);

        // Test blocked key identity
        IdentityResult blockedIdentity = identityApi.getIdentity(blockedKey.getPubKey(), null, leftData);
        assertNotNull(blockedIdentity.getSignature());
        assertNotNull(blockedIdentity.getRightData());
        assertNotNull(blockedIdentity.getIdentity());
        assertEquals(userSeal.getIdentity().getCommonName(), blockedIdentity.getIdentity().getCommonName());
        assertNotNull(blockedIdentity.getKey());
        assertEquals(keyPost.getName(), blockedIdentity.getKey().getName());
        assertNotNull(blockedIdentity.getKey().getPubKey());
        assertNull(blockedIdentity.getKey().getExpiration());
        assertEquals(Key.StatusEnum.VALID, blockedIdentity.getKey().getStatus());
        assertTrue(blockedIdentity.getRightData().startsWith(serverConfig.getIdentityURL()));
        assertTrue(Config.isValidSignature(blockedKey.getPubKey(), blockedIdentity.getSignature(),
                leftData + blockedIdentity.getRightData()));

        // Delete blocked key
        keyApi.deleteKey(blockedKey.getId());

        // Create a revoked key
        keyPost = new KeyPost();
        keyPost.setName(Config.randomName());
        KeyGet keyToRevoke = keyApi.createKey(userSeal.getId(), keyPost);
        KeyPut keyPut = new KeyPut();
        keyPut.setStatus(KeyStatusEnum.REVOKED);
        KeyGet revokedKey = keyApi.updateKey(keyToRevoke.getId(), keyPut);

        // Test revoked key identity
        IdentityResult revokedIdentity = identityApi.getIdentity(revokedKey.getPubKey(), null, leftData);
        assertNotNull(revokedIdentity.getSignature());
        assertNotNull(revokedIdentity.getRightData());
        assertNotNull(revokedIdentity.getIdentity());
        assertEquals(userSeal.getIdentity().getCommonName(), revokedIdentity.getIdentity().getCommonName());
        assertNotNull(revokedIdentity.getKey());
        assertEquals(keyPost.getName(), revokedIdentity.getKey().getName());
        assertNotNull(revokedIdentity.getKey().getPubKey());
        assertNotNull(revokedIdentity.getKey().getRevokedAt());
        assertEquals(Key.StatusEnum.REVOKED, revokedIdentity.getKey().getStatus());
        assertTrue(revokedIdentity.getRightData().startsWith(serverConfig.getIdentityURL()));
        assertTrue(Config.isValidSignature(revokedKey.getPubKey(), revokedIdentity.getSignature(),
                leftData + revokedIdentity.getRightData()));

        // Create an external key
        ExternalKeyPost externalKeyPost = new ExternalKeyPost();
        externalKeyPost.setName(Config.randomName());
        externalKeyPost.setPublicKey(Config.randomAddress());
        KeyGet externalKey = keyApi.createExternalKey(userESign.getId(), externalKeyPost);

        // Test external key identity
        IdentityResult externalIdentity = identityApi.getIdentity(externalKey.getPubKey(), null, null);
        assertNull(externalIdentity.getSignature());
        assertNull(externalIdentity.getRightData());
        assertNotNull(externalIdentity.getIdentity());
        assertNotNull(externalIdentity.getIdentity().getCommonName());
        assertNotNull(externalIdentity.getKey());
        assertEquals(externalKeyPost.getName(), externalIdentity.getKey().getName());
        assertEquals(externalKeyPost.getPublicKey(), externalIdentity.getKey().getPubKey());
        assertNull(externalIdentity.getKey().getExpiration());
        assertEquals(Key.StatusEnum.VALID, externalIdentity.getKey().getStatus());

        // Delete external key
        keyApi.deleteKey(externalKey.getId());

        // Delete expired key
        keyApi.deleteKey(expiredKey.getId());

        // Get server's default public key
        String serverDefaultPubKey = keyApi.getKeyById(serverConfig.getDefaultKeyId()).getPubKey();
        assertNotNull(serverDefaultPubKey);

        // Get esign user's default public key
        String esignDefaultPubKey = keyApi.getKeyById(userESign.getDefaultKeyId()).getPubKey();

        // Test esign user identity from its default key
        IdentityResult eSignatureIdentity = identityApi.getIdentity(esignDefaultPubKey, null, null);
        assertNull(eSignatureIdentity.getSignature());
        assertNull(eSignatureIdentity.getRightData());
        assertNotNull(eSignatureIdentity.getIdentity());
        assertNotNull(eSignatureIdentity.getIdentity().getCommonName());
        assertNotNull(eSignatureIdentity.getKey());
        assertEquals(userESign.getIdentity().getCommonName(), eSignatureIdentity.getIdentity().getCommonName());
        assertNotNull(eSignatureIdentity.getKey());
        assertNotNull(eSignatureIdentity.getKey().getPubKey());
        assertNull(eSignatureIdentity.getKey().getExpiration());
        assertEquals(Key.StatusEnum.VALID, eSignatureIdentity.getKey().getStatus());

        // Test server identity from its default key
        IdentityResult defaultIdentity = identityApi.getIdentity(serverDefaultPubKey, null, leftData);
        assertNotNull(defaultIdentity.getSignature());
        assertNotNull(defaultIdentity.getIdentity());
        assertNotNull(defaultIdentity.getIdentity().getCommonName());
        assertNotNull(defaultIdentity.getKey());
        assertNotNull(defaultIdentity.getKey().getName());
        assertEquals(defaultIdentity.getKey().getPubKey(), serverDefaultPubKey);
        assertEquals(Key.StatusEnum.VALID, defaultIdentity.getKey().getStatus());
        assertTrue(defaultIdentity.getRightData().startsWith(serverConfig.getIdentityURL()));
        assertTrue(Config.isValidSignature(serverDefaultPubKey, defaultIdentity.getSignature(),
                leftData + defaultIdentity.getRightData()));

        // Switch the server in strict mode (prevent identity exposure)
        serverConfig.setPreventIdentityExposure(true);
        serverConfigApi.updateServerConfig(serverConfig);

        // Create signature to test the identity endpoint in strict mode
        String hashToSign = Config.randomHash();
        tokenAuthUserESignApi.getSignature(null, hashToSign, userESign.getId(), null, esignDefaultPubKey, null,
                "CN,EMAILADDRESS");

        // Check that we cannot get an identity from a mismatching signed identity (add a field)
        String signedIdentity =
                "CN=" + userESign.getIdentity().getCommonName() + ",EMAILADDRESS=" + userESign.getEmail()
                + ",C=" + userESign.getIdentity().getCountry();
        try {
            identityApi.getIdentity(esignDefaultPubKey, signedIdentity, null);
            fail("Should not be able to get an identity with a signed identity mismatching the one which signed");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Check that we cannot get an identity from a mismatching signed identity (change a field)
        String NEW_USERNAME = Config.randomUsername();
        String NEW_EMAIL = NEW_USERNAME + "@woleet.com";
        signedIdentity = "CN=" + userESign.getIdentity().getCommonName() + ",EMAILADDRESS=" + NEW_EMAIL;
        try {
            identityApi.getIdentity(esignDefaultPubKey, signedIdentity, null);
            fail("Should not be able to get an identity with a signed identity mismatching the one which signed");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Check that we cannot get an identity from a mismatching public key
        signedIdentity = "CN=" + userESign.getIdentity().getCommonName() + ",EMAILADDRESS=" + userESign.getEmail();
        try {
            identityApi.getIdentity(serverDefaultPubKey, signedIdentity, null);
            fail("Should not be able to get an identity with a public key mismatching the one which signed");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Check that we cannot get an identity without providing a signed identity
        try {
            identityApi.getIdentity(serverDefaultPubKey, null, null);
            fail("Should not be able to get an identity without the signed identity");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Test the identity returned before changing the user identity
        IdentityResult identityBefore = identityApi.getIdentity(esignDefaultPubKey, signedIdentity, null);
        assertNull(identityBefore.getSignature());
        assertNull(identityBefore.getRightData());
        assertNotNull(identityBefore.getIdentity());
        assertNotNull(identityBefore.getIdentity().getCommonName());
        assertNotNull(identityBefore.getKey());
        assertEquals(userESign.getIdentity().getCommonName(), identityBefore.getIdentity().getCommonName());
        assertEquals(userESign.getEmail(), identityBefore.getIdentity().getEmailAddress());
        assertNull(identityBefore.getIdentity().getCountry());
        assertNotNull(identityBefore.getKey());
        assertNotNull(identityBefore.getKey().getPubKey());
        assertNull(identityBefore.getKey().getExpiration());
        assertEquals(Key.StatusEnum.VALID, identityBefore.getKey().getStatus());

        // Change the user identity (username, email, common name and country)
        UserPut userPut = new UserPut().username(NEW_USERNAME).email(NEW_EMAIL);
        userPut.identity(new FullIdentity().commonName(Config.randomName()).country("EN"));
        userESign = userApi.updateUser(userESign.getId(), userPut);

        // Test the identity returned after changing the user identity
        // (it should be the same if the signed identity is the same)
        IdentityResult identityAfter = identityApi.getIdentity(esignDefaultPubKey, signedIdentity, null);
        assertEquals(identityBefore, identityAfter);

        // Sign using the new identity
        hashToSign = Config.randomHash();
        tokenAuthUserESignApi.getSignature(null, hashToSign, userESign.getId(), null, esignDefaultPubKey, null,
                "CN,EMAILADDRESS");

        // Test the identity returned after changing the user identity
        // (it should be the new identity if the signed identity is updated)
        signedIdentity = "CN=" + userESign.getIdentity().getCommonName() + ",EMAILADDRESS=" + userESign.getEmail();
        IdentityResult identityNew = identityApi.getIdentity(esignDefaultPubKey, signedIdentity, leftData);
        assertNull(identityNew.getSignature());
        assertNull(identityNew.getRightData());
        assertNotNull(identityNew.getIdentity());
        assertNotNull(identityNew.getIdentity().getCommonName());
        assertNotNull(identityNew.getKey());
        assertEquals(userESign.getIdentity().getCommonName(), identityNew.getIdentity().getCommonName());
        assertEquals(userESign.getEmail(), identityNew.getIdentity().getEmailAddress());
        assertNull(identityNew.getIdentity().getCountry());
        assertNotNull(identityNew.getKey());
        assertNotNull(identityNew.getKey().getPubKey());
        assertNull(identityNew.getKey().getExpiration());
        assertEquals(Key.StatusEnum.VALID, identityNew.getKey().getStatus());
    }
}
