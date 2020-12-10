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
            WOLEET_ID_SERVER_IDENTITY_BASEPATH = "https://localhost:3000";

        if (WOLEET_ID_SERVER_SIGNATURE_BASEPATH == null)
            WOLEET_ID_SERVER_SIGNATURE_BASEPATH = "https://localhost:3000";
    }

    private UserGet userSeal, userESign;

    private SignatureApi tokenAuthUserESignApi;

    private ApiTokenApi apiTokenApi;
    private APITokenGet apiTokenUserESignGet;

    private ServerConfigApi serverConfigApi;

    @Before
    public void setUp() throws Exception {

        // Start from a clean state
        tearDown();

        // Create test user;
        userSeal = Config.createTestUser(UserModeEnum.SEAL);
        userESign = Config.createTestUser(UserModeEnum.ESIGN);

        // Create one helper API with user rights using token authentication
        apiTokenApi = new ApiTokenApi(Config.getAdminAuthApiClient());
        APITokenPost apiTokenUser = new APITokenPost();
        apiTokenUser.setName("test-user");
        apiTokenUser.setUserId(userESign.getId());
        apiTokenUserESignGet = apiTokenApi.createAPIToken(apiTokenUser);
        ApiClient apiClientUserESign = Config.getNoAuthApiClient().setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH);
        apiClientUserESign.addDefaultHeader("Authorization", "Bearer " + apiTokenUserESignGet.getValue());
        tokenAuthUserESignApi = new SignatureApi(apiClientUserESign);

        //
        serverConfigApi = new ServerConfigApi(Config.getAdminAuthApiClient());
    }

    @After
    public void tearDown() throws Exception {
        if (apiTokenUserESignGet != null) {
            apiTokenApi.deleteAPIToken(apiTokenUserESignGet.getId());
            apiTokenUserESignGet = null;
        }
        Config.deleteAllTestUsers();
    }

    @Test
    public void getIdentityTest() throws ApiException, InterruptedException {

        IdentityApi identityApi = new IdentityApi(Config.getNoAuthApiClient()
            .setBasePath(WOLEET_ID_SERVER_IDENTITY_BASEPATH));

        ServerConfig serverConfig = new ServerConfigApi(Config.getAdminAuthApiClient()).getServerConfig();
        Boolean currentPreventIdentityExpositionConfig = serverConfig.getPreventIdentityExposition();

        serverConfig.setPreventIdentityExposition(false);
        serverConfigApi.updateServerConfig(serverConfig);

        KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());

        String leftData = Config.randomString(32);

        // Check that we cannot get an identity from an invalid public key
        try {
            identityApi.getIdentity("invalid pubKey", null, null);
            fail("Should not be able to get an identity with an invalid key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Check that we cannot get an identity from a public key that does not exist
        try {
            identityApi.getIdentity("1iBDiJNw1moBD37mqjCVQNxGbEeqXtWnUG", null, null);
            fail("Should not be able to get an identity with an non existing key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
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
        IdentityResult expiredIdentity = identityApi.getIdentity(expiredKey.getPubKey(), leftData, null);
        assertNotNull(expiredIdentity.getSignature());
        assertNotNull(expiredIdentity.getRightData());
        assertNotNull(expiredIdentity.getIdentity());
        assertEquals(userSeal.getIdentity().getCommonName(), expiredIdentity.getIdentity().getCommonName());
        assertNotNull(expiredIdentity.getKey());
        assertEquals(keyPost.getName(), expiredIdentity.getKey().getName());
        assertNotNull(expiredIdentity.getKey().getPubKey());
        assertEquals(expiration, expiredIdentity.getKey().getExpiration());
        assertEquals(Key.StatusEnum.EXPIRED, expiredIdentity.getKey().getStatus());

        // Create a blocked key
        keyPost = new KeyPost();
        keyPost.setName(Config.randomName());
        keyPost.setStatus(KeyStatusEnum.BLOCKED);
        KeyGet blockedKey = keyApi.createKey(userSeal.getId(), keyPost);

        // Test the blocked key identity
        IdentityResult blockedIdentity = identityApi.getIdentity(blockedKey.getPubKey(), leftData, null);
        assertNotNull(blockedIdentity.getSignature());
        assertNotNull(blockedIdentity.getRightData());
        assertNotNull(blockedIdentity.getIdentity());
        assertEquals(userSeal.getIdentity().getCommonName(), blockedIdentity.getIdentity().getCommonName());
        assertNotNull(blockedIdentity.getKey());
        assertEquals(keyPost.getName(), blockedIdentity.getKey().getName());
        assertNotNull(blockedIdentity.getKey().getPubKey());
        assertNull(blockedIdentity.getKey().getExpiration());
        assertEquals(Key.StatusEnum.VALID, blockedIdentity.getKey().getStatus());

        // Delete blocked key
        keyApi.deleteKey(blockedKey.getId());

        // Create a revoked key
        keyPost = new KeyPost();
        keyPost.setName(Config.randomName());
        KeyPut keyPut = new KeyPut();
        keyPut.setStatus(KeyStatusEnum.REVOKED);
        KeyGet CreatedRevokedKey = keyApi.createKey(userSeal.getId(), keyPost);
        KeyGet revokedKey = keyApi.updateKey(CreatedRevokedKey.getId(), keyPut);

        // Test the revoked key identity
        IdentityResult revokedIdentity = identityApi.getIdentity(revokedKey.getPubKey(), leftData, null);
        assertNotNull(revokedIdentity.getSignature());
        assertNotNull(revokedIdentity.getRightData());
        assertNotNull(revokedIdentity.getIdentity());
        assertEquals(userSeal.getIdentity().getCommonName(), revokedIdentity.getIdentity().getCommonName());
        assertNotNull(revokedIdentity.getKey());
        assertEquals(keyPost.getName(), revokedIdentity.getKey().getName());
        assertNotNull(revokedIdentity.getKey().getPubKey());
        assertNotNull(revokedIdentity.getKey().getRevokedAt());
        assertEquals(Key.StatusEnum.REVOKED, revokedIdentity.getKey().getStatus());

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

        // Get server's default public key
        String pubKey = keyApi.getKeyById(serverConfig.getDefaultKeyId()).getPubKey();
        assertNotNull(pubKey);

        // Delete expired key
        keyApi.deleteKey(expiredKey.getId());

        // Create E-Signature user and key
        keyPost = new KeyPost();
        keyPost.setName(Config.randomName());
        KeyGet eSignatureKey = keyApi.createKey(userESign.getId(), keyPost);

        // Test E-Signature key
        IdentityResult eSignatureIdentity = identityApi.getIdentity(eSignatureKey.getPubKey(), null, null);
        assertNull(eSignatureIdentity.getSignature());
        assertNull(eSignatureIdentity.getRightData());
        assertNotNull(eSignatureIdentity.getIdentity());
        assertNotNull(eSignatureIdentity.getIdentity().getCommonName());
        assertNotNull(eSignatureIdentity.getKey());
        assertEquals(userESign.getIdentity().getCommonName(), eSignatureIdentity.getIdentity().getCommonName());
        assertNotNull(eSignatureIdentity.getKey());
        assertEquals(keyPost.getName(), eSignatureIdentity.getKey().getName());
        assertNotNull(eSignatureIdentity.getKey().getPubKey());
        assertNull(eSignatureIdentity.getKey().getExpiration());
        assertEquals(Key.StatusEnum.VALID, eSignatureIdentity.getKey().getStatus());

        // Get and verify server's default identity
        IdentityResult identityResult = identityApi.getIdentity(pubKey, leftData, null);
        assertNotNull(identityResult.getSignature());
        assertNotNull(identityResult.getIdentity());
        assertNotNull(identityResult.getIdentity().getCommonName());
        assertNotNull(identityResult.getKey());
        assertNotNull(identityResult.getKey().getName());
        assertEquals(identityResult.getKey().getPubKey(), pubKey);
        assertEquals(Key.StatusEnum.VALID, identityResult.getKey().getStatus());
        assertTrue(
            "Expected " + identityResult.getRightData()
            + "to start with \"" + serverConfig.getIdentityURL()
            + "\" but got \"" + identityResult.getRightData() + "\"",
            identityResult.getRightData().startsWith(serverConfig.getIdentityURL())
        );
        assertTrue(Config.isValidSignature(pubKey, identityResult.getSignature(),
            leftData + identityResult.getRightData()));


        // Create signature to test new identity endpoint
        String signedIdentity =
            "CN=" + userESign.getIdentity().getCommonName() + ",EMAILADDRESS=" + userESign.getEmail();
        String hashToSign = Config.randomHash();
        tokenAuthUserESignApi.getSignature(null, hashToSign, userESign.getId(), null, eSignatureKey.getPubKey(), null, "CN,EMAILADDRESS");

        // Check that we cannot get an identity from an invalid public key
        try {
            IdentityResult SignatureIdentity = identityApi.getIdentity(eSignatureKey.getPubKey(), null, "CN=false");
            fail("Should not be able to get an identity with an invalid signed identity");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Check that we cannot get an identity from an invalid public key
        signedIdentity =
            "CN=" + userESign.getIdentity().getCommonName() + ",EMAILADDRESS=" + userESign.getEmail() + ",C=" + userESign.getIdentity().getCountry();
        try {
            IdentityResult SignatureIdentity = identityApi.getIdentity(eSignatureKey.getPubKey(), null, signedIdentity);
            fail("Should not be able to get an identity with a signed identity mismatching the one which signed");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Check that we cannot get an identity from an invalid public key
        signedIdentity =
            "CN=" + userESign.getIdentity().getCommonName() + ",EMAILADDRESS=" + userESign.getEmail();
        try {
            IdentityResult SignatureIdentity = identityApi.getIdentity(pubKey, null, signedIdentity);
            fail("Should not be able to get an identity with a public key mismatching the one which signed");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        serverConfig.setPreventIdentityExposition(true);
        serverConfigApi.updateServerConfig(serverConfig);
        try {
            IdentityResult SignatureIdentity = identityApi.getIdentity(pubKey, null, null);
            fail("Should not be able to get an identity with without the signed identity field if the server do not "
                 + "expose identity");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }



        // Test signed identity
        IdentityResult SignatureIdentity = identityApi.getIdentity(eSignatureKey.getPubKey(), null, signedIdentity);
        assertNull(SignatureIdentity.getSignature());
        assertNull(SignatureIdentity.getRightData());
        assertNotNull(SignatureIdentity.getIdentity());
        assertNotNull(SignatureIdentity.getIdentity().getCommonName());
        assertNotNull(SignatureIdentity.getKey());
        assertEquals(userESign.getIdentity().getCommonName(), SignatureIdentity.getIdentity().getCommonName());
        assertEquals(userESign.getEmail(), SignatureIdentity.getIdentity().getEmailAddress());
        assertNull(SignatureIdentity.getIdentity().getCountry());
        assertNotNull(SignatureIdentity.getKey());
        assertEquals(keyPost.getName(), SignatureIdentity.getKey().getName());
        assertNotNull(SignatureIdentity.getKey().getPubKey());
        assertNull(SignatureIdentity.getKey().getExpiration());
        assertEquals(Key.StatusEnum.VALID, SignatureIdentity.getKey().getStatus());

        serverConfig.setPreventIdentityExposition(currentPreventIdentityExpositionConfig);
        serverConfigApi.updateServerConfig(serverConfig);
    }
}
