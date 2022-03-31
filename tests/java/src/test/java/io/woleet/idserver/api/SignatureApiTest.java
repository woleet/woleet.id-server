package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.*;

public class SignatureApiTest {

    private static String WOLEET_ID_SERVER_SIGNATURE_BASEPATH = System.getenv("WOLEET_ID_SERVER_SIGNATURE_BASEPATH");

    static {
        if (WOLEET_ID_SERVER_SIGNATURE_BASEPATH == null)
            WOLEET_ID_SERVER_SIGNATURE_BASEPATH = "https://localhost:3002";
    }

    private UserGet sealUser, eSignUser;

    private SignatureApi adminAuthSignatureApi, sealAuthSignatureApi, noAuthSignatureApi,
            adminTokenAuthSignatureApi, sealTokenAuthSignatureApi, eSignTokenAuthSignatureApi;

    private ApiTokenApi adminAuthApiTokenApi;
    private APITokenGet adminApiToken, sealApiToken, eSignApiToken;

    private ServerConfigApi serverConfigApi;
    private Boolean preventIdentityExposure;
    private Boolean fallbackOnDefaultKey;
    private UUID defaultKeyId;

    /**
     * Verify that the result of a signature not including a signed identity is valid.
     */
    private void verifyRegularSignatureValid(String hashToSign, String messageToSign, SignatureResult signatureResult)
            throws ApiException {

        // Check provided properties
        assertNotNull(signatureResult.getIdentityURL());
        ServerConfig serverConfig = serverConfigApi.getServerConfig();
        assertEquals(serverConfig.getIdentityURL(), signatureResult.getIdentityURL());
        assertTrue(Config.isValidPubKey(signatureResult.getPubKey()));
        assertEquals(hashToSign, signatureResult.getSignedHash());
        assertEquals(messageToSign, signatureResult.getSignedMessage());
        assertNull(signatureResult.getSignedIdentity());
        assertNull(signatureResult.getSignedIssuerDomain());

        // Verify the signature
        assertTrue(Config.isValidSignature(signatureResult.getPubKey(), signatureResult.getSignature(),
                signatureResult.getSignedMessage() != null ?
                        signatureResult.getSignedMessage() : signatureResult.getSignedHash()));
    }

    /**
     * Verify that the result of a signature including a signed identity is valid.
     */
    private void verifyIdentifiedSignatureValid(
            String hashToSign, String messageToSign, SignatureResult signatureResult, UserGet user
    ) throws ApiException, MalformedURLException {

        // Check provided properties
        assertNotNull(signatureResult.getIdentityURL());
        ServerConfig serverConfig = serverConfigApi.getServerConfig();
        assertEquals(serverConfig.getIdentityURL(), signatureResult.getIdentityURL());
        assertTrue(Config.isValidPubKey(signatureResult.getPubKey()));
        assertEquals(hashToSign, signatureResult.getSignedHash());
        assertEquals(messageToSign, signatureResult.getSignedMessage());
        assertNotNull(signatureResult.getSignedIdentity());
        assertNotNull(signatureResult.getSignedIssuerDomain());

        // Prepare the identity supposed to be signed from server information
        String signedIdentity = "";
        String signedIssuerDomain = "";
        if (signatureResult.getSignedIdentity() != null) {

            // Recreate the signed identity from server information
            String escapingRegex = "([=\",;+])";
            String remplacementRegex = "\\\\$1";
            if (signatureResult.getSignedIdentity().contains("CN=")) {
                signedIdentity +=
                        "CN=" + user.getIdentity().getCommonName().replaceAll(escapingRegex, remplacementRegex);
            }
            if (signatureResult.getSignedIdentity().contains(",O=")) {
                if (!signedIdentity.equals("")) {
                    signedIdentity += ",";
                }
                signedIdentity +=
                        "O=" + user.getIdentity().getOrganization().replaceAll(escapingRegex, remplacementRegex);
            }
            if (signatureResult.getSignedIdentity().contains(",OU=")) {
                if (!signedIdentity.equals("")) {
                    signedIdentity += ",";
                }
                signedIdentity +=
                        "OU=" + user.getIdentity().getOrganizationalUnit().replaceAll(escapingRegex, remplacementRegex);
            }
            if (signatureResult.getSignedIdentity().contains(",L=")) {
                if (!signedIdentity.equals("")) {
                    signedIdentity += ",";
                }
                signedIdentity +=
                        "L=" + user.getIdentity().getLocality().replaceAll(escapingRegex, remplacementRegex);
            }
            if (signatureResult.getSignedIdentity().contains(",C=")) {
                if (!signedIdentity.equals("")) {
                    signedIdentity += ",";
                }
                signedIdentity +=
                        "C=" + user.getIdentity().getCountry().replaceAll(escapingRegex, remplacementRegex);
            }
            if (signatureResult.getSignedIdentity().contains(",EMAILADDRESS=")) {
                if (!signedIdentity.equals("")) {
                    signedIdentity += ",";
                }
                signedIdentity +=
                        "EMAILADDRESS=" + user.getEmail().replaceAll(escapingRegex, remplacementRegex);
            }
            assertEquals(signatureResult.getSignedIdentity(), signedIdentity);

            // Recreating issuerDomain from information available on server
            assert signatureResult.getIdentityURL() != null;
            URL parsedIdentityURL = new URL(signatureResult.getIdentityURL());
            String[] sub = parsedIdentityURL.getHost().split("\\.");
            switch (sub.length) {
                case 0:
                    break;
                case 1:
                    signedIssuerDomain = sub[0];
                    break;
                default:
                    signedIssuerDomain = sub[sub.length - 2] + '.' + sub[sub.length - 1];
            }
            assertEquals(signatureResult.getSignedIssuerDomain(), signedIssuerDomain);
        }

        // Prepare the data supposed to be signed (ie. including the identity and issuer domain to sign)
        String signedData = Config.sha256(((hashToSign != null) ? hashToSign : messageToSign)
                                          + signedIdentity + signedIssuerDomain);

        // Verify the signature
        assertTrue(Config.isValidSignature(signatureResult.getPubKey(), signatureResult.getSignature(), signedData));
    }

    @Before
    public void setUp() throws Exception {

        // Start form a clean state
        tearDown();

        // Create one seal user and one esign user
        sealUser = Config.createTestUser();
        eSignUser = Config.createTestUser(UserModeEnum.ESIGN);

        // Create 3 helper APIs: one with admin rights, one with user rights, one not authenticated
        adminAuthSignatureApi = new SignatureApi(Config.getAdminAuthApiClient()
                .setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH));
        sealAuthSignatureApi = new SignatureApi(Config.getAuthApiClient(sealUser.getUsername(), "pass")
                .setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH));
        noAuthSignatureApi = new SignatureApi(Config.getNoAuthApiClient()
                .setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH));

        // Create a token API with admin rights
        adminAuthApiTokenApi = new ApiTokenApi(Config.getAdminAuthApiClient());

        // Create a helper API with admin rights using token authentication
        adminApiToken = Config.createTestApiToken(null);
        ApiClient adminApiClient = Config.getNoAuthApiClient().setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH);
        adminApiClient.addDefaultHeader("Authorization", "Bearer " + adminApiToken.getValue());
        adminTokenAuthSignatureApi = new SignatureApi(adminApiClient);

        // Create a helper API with seal user rights using token authentication
        sealApiToken = Config.createTestApiToken(sealUser.getId());
        ApiClient sealApiClient = Config.getNoAuthApiClient().setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH);
        sealApiClient.addDefaultHeader("Authorization", "Bearer " + sealApiToken.getValue());
        sealTokenAuthSignatureApi = new SignatureApi(sealApiClient);

        // Create a helper API with esign user rights using token authentication
        eSignApiToken = Config.createTestApiToken(eSignUser.getId());
        ApiClient eSignApiClient = Config.getNoAuthApiClient().setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH);
        eSignApiClient.addDefaultHeader("Authorization", "Bearer " + eSignApiToken.getValue());
        eSignTokenAuthSignatureApi = new SignatureApi(eSignApiClient);

        // Create a server config API with admin rights
        serverConfigApi = new ServerConfigApi(Config.getAdminAuthApiClient());

        // Remember server's state
        ServerConfig serverConfig = serverConfigApi.getServerConfig();
        preventIdentityExposure = serverConfig.getPreventIdentityExposure();
        fallbackOnDefaultKey = serverConfig.getFallbackOnDefaultKey();
        defaultKeyId = serverConfig.getDefaultKeyId();

        // If no default key is set
        if (defaultKeyId == null) {

            // Create a new key for the seal user
            KeyGet defaultKey = Config.createTestKey(sealUser.getId());

            // Set the new key as default key
            serverConfigApi.updateServerConfig(new ServerConfig().defaultKeyId(defaultKey.getId()));
        }
    }

    @After
    public void tearDown() throws Exception {

        // Restore server's state
        if (serverConfigApi != null) {
            serverConfigApi.updateServerConfig(new ServerConfig()
                    .preventIdentityExposure(preventIdentityExposure)
                    .fallbackOnDefaultKey(fallbackOnDefaultKey)
                    .defaultKeyId(defaultKeyId));
        }

        Config.deleteAllTestUsers();
        Config.deleteAllTestAPITokens();
    }

    @Test
    public void getLegacySignatureTest() throws ApiException, InterruptedException {

        String hashToSign = Config.randomHash();

        // Switch the server in relaxed mode (don't prevent identity exposure)
        serverConfigApi.updateServerConfig(new ServerConfig().preventIdentityExposure(false));

        // Switch the server to fallback on default key
        serverConfigApi.updateServerConfig(new ServerConfig().fallbackOnDefaultKey(true));
        TimeUnit.MILLISECONDS.sleep(1000L);

        // Try to sign with no credentials
        try {
            noAuthSignatureApi.getSignature(Config.randomHash(), null, null, null, null, null, null);
            fail("Should not be able to get a signature with no credentials");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign with user rights (cookie authentication)
        try {
            sealAuthSignatureApi.getSignature(Config.randomHash(), null, null, null, null, null, null);
            fail("Should not be able to sign with user rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign with admin rights (cookie authentication)
        try {
            adminAuthSignatureApi.getSignature(Config.randomHash(), null, null, null, null, null, null);
            fail("Should not be able to sign with admin rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign an invalid hash
        try {
            adminTokenAuthSignatureApi.getSignature("invalid hash", null, null, null, null, null, null);
            fail("Should not be able to sign an invalid hash");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Try to sign using an invalid key
        try {
            adminTokenAuthSignatureApi.getSignature(hashToSign, null, null, null, "invalid pubKey", null, null);
            fail("Should not be able to sign using an invalid key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Try to sign using a non-existing key
        try {
            adminTokenAuthSignatureApi.getSignature(hashToSign, null, null, null, "1iBDiJNw1moBD37mqjCVQNxGbEeqXtWnUG",
                    null,
                    null);
            fail("Should not be able to sign using a non-existing key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non-existing user (userId)
        try {
            adminTokenAuthSignatureApi.getSignature(hashToSign, null, Config.randomUUID(), null, null, null, null);
            fail("Should not be able to sign using a non-existing user");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non-existing user (customUserId)
        try {
            adminTokenAuthSignatureApi.getSignature(hashToSign, null, null, "non-existing customUserId", null, null,
                    null);
            fail("Should not be able to sign using a non-existing user");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non-existing key
        try {
            adminTokenAuthSignatureApi.getSignature(hashToSign, null, null, null, "1iBDiJNw1moBD37mqjCVQNxGbEeqXtWnUG",
                    null,
                    null);
            fail("Should not be able to sign using a non-existing key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign as a different user
        try {
            sealTokenAuthSignatureApi.getSignature(hashToSign, null, eSignUser.getId(), null, null, null, null);
            fail("Should not be able to sign as a different user");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign with a non-owned key
        try {
            KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
            KeyGet keyGet = keyApi.getKeyById(eSignUser.getDefaultKeyId());
            String pubKey = keyGet.getPubKey();
            sealTokenAuthSignatureApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
            fail("Should not be able to sign with a non owned key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using an esign user key with an admin token
        try {
            KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
            KeyGet keyGet = keyApi.getKeyById(eSignUser.getDefaultKeyId());
            String pubKey = keyGet.getPubKey();
            adminTokenAuthSignatureApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
            fail("Should not be able to sign using an esign user key with an admin token");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign as an esign user with an admin token
        try {
            adminTokenAuthSignatureApi.getSignature(hashToSign, null, eSignUser.getId(), null, null, null, null);
            fail("Should not be able to sign as an esign user with an admin token");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Switch the server not to fallback on default key
        serverConfigApi.updateServerConfig(new ServerConfig().fallbackOnDefaultKey(false));
        TimeUnit.MILLISECONDS.sleep(1000L);

        // Try to sign using a non-existing server's default key
        try {
            adminTokenAuthSignatureApi.getSignature(hashToSign, null, null, null, null, null, null);
            fail("Should not be able to sign using a non-existing server's default key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Switch back the server config to fallback on default key
        serverConfigApi.updateServerConfig(new ServerConfig().fallbackOnDefaultKey(true));
        TimeUnit.MILLISECONDS.sleep(1000L);

        // Sign a random hash using the server's default key
        SignatureResult signatureResult = adminTokenAuthSignatureApi.getSignature(hashToSign, null, null, null, null,
                null,
                null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Check that admin API token's last used time is close to current time
        adminApiToken = adminAuthApiTokenApi.getAPITokenById(adminApiToken.getId());
        assertTrue(adminApiToken.getLastUsed() < System.currentTimeMillis() + 60L * 1000L
                   && adminApiToken.getLastUsed() > System.currentTimeMillis() - 60L * 1000L);

        // Sign a random message using the user's default key
        String messageToSign = Config.randomString(32);
        signatureResult = sealTokenAuthSignatureApi.getSignature(null, messageToSign, null, null, null, null, null);
        verifyRegularSignatureValid(null, messageToSign, signatureResult);

        // Check that user API token's last used time is close to current time
        sealApiToken = adminAuthApiTokenApi.getAPITokenById(sealApiToken.getId());
        assertTrue(sealApiToken.getLastUsed() < System.currentTimeMillis() + 60L * 1000L
                   && sealApiToken.getLastUsed() > System.currentTimeMillis() - 60L * 1000L);

        // Sign using the server's default key and derivation path
        signatureResult = adminTokenAuthSignatureApi.getSignature(hashToSign, null, null, null, null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using the server's default key and derivation path (force it)
        SignatureResult signatureResult4400 = adminTokenAuthSignatureApi.getSignature(hashToSign, null, null, null,
                null,
                "m/44'/0'/0'", null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult4400);
        assertEquals(signatureResult.getPubKey(), signatureResult4400.getPubKey());
        assertEquals(signatureResult.getSignature(), signatureResult4400.getSignature());

        // Sign using the server's default key and specific derivation path
        SignatureResult signatureResult4401 = adminTokenAuthSignatureApi.getSignature(hashToSign, null, null, null,
                null, "m/44'/0'/1'", null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult4401);
        assertNotEquals(signatureResult.getPubKey(), signatureResult4401.getPubKey());
        assertNotEquals(signatureResult.getSignature(), signatureResult4401.getSignature());

        // Get seal user's default key
        KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
        KeyGet keyGet = keyApi.getKeyById(sealUser.getDefaultKeyId());
        String pubKey = keyGet.getPubKey();

        // Sign using seal user's default key (pubKey) with an admin token
        signatureResult = adminTokenAuthSignatureApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using seal user's default key (userId) with an admin token
        signatureResult = adminTokenAuthSignatureApi.getSignature(hashToSign, null, sealUser.getId(), null, null, null,
                null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using seal user's default key (customUserId) with an admin token
        signatureResult = adminTokenAuthSignatureApi.getSignature(hashToSign, null, null,
                sealUser.getIdentity().getUserId(), null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using seal user's default key with a user token
        signatureResult = sealTokenAuthSignatureApi.getSignature(hashToSign, null, null, null, null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using seal user's default key (userId) with a user token
        signatureResult = sealTokenAuthSignatureApi.getSignature(hashToSign, null, sealUser.getId(), null, null, null,
                null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using seal user's default key (customUserId) with a user token
        signatureResult = sealTokenAuthSignatureApi.getSignature(hashToSign, null, null,
                sealUser.getIdentity().getUserId(), null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using seal user's default key (pubKey) with a user token
        signatureResult = sealTokenAuthSignatureApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Get esign user's default key
        keyGet = keyApi.getKeyById(eSignUser.getDefaultKeyId());
        pubKey = keyGet.getPubKey();

        // Sign using esign user's default key with a user token
        signatureResult = eSignTokenAuthSignatureApi.getSignature(hashToSign, null, null, null, null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using esign user's default key (userId) with a user token
        signatureResult = eSignTokenAuthSignatureApi.getSignature(hashToSign, null, eSignUser.getId(), null, null, null,
                null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using esign user's default key (customUserId) with a user token
        signatureResult = eSignTokenAuthSignatureApi.getSignature(hashToSign, null, null,
                eSignUser.getIdentity().getUserId(), null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using esign user's default key (pubKey) with a user token
        signatureResult = eSignTokenAuthSignatureApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Get seal user's default key
        keyGet = keyApi.getKeyById(sealUser.getDefaultKeyId());
        pubKey = keyGet.getPubKey();

        // Check that default key's last used time is close to current time
        assertTrue(keyGet.getLastUsed() < System.currentTimeMillis() + 60L * 1000L
                   && keyGet.getLastUsed() > System.currentTimeMillis() - 60L * 1000L);

        // Check that API token's last used time is close to current time
        sealApiToken = adminAuthApiTokenApi.getAPITokenById(sealApiToken.getId());
        assertTrue(sealApiToken.getLastUsed() < System.currentTimeMillis() + 60L * 1000L
                   && sealApiToken.getLastUsed() > System.currentTimeMillis() - 60L * 1000L);

        // Check that API token's last used time is close to current time
        eSignApiToken = adminAuthApiTokenApi.getAPITokenById(eSignApiToken.getId());
        assertTrue(eSignApiToken.getLastUsed() < System.currentTimeMillis() + 60L * 1000L
                   && eSignApiToken.getLastUsed() > System.currentTimeMillis() - 60L * 1000L);

        // Try to sign with a blocked key
        try {
            KeyPut keyPut = new KeyPut();
            keyPut.setStatus(KeyStatusEnum.BLOCKED);
            keyApi.updateKey(keyGet.getId(), keyPut);
            adminTokenAuthSignatureApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
            fail("Should not be able to sign with a blocked key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Delete user's default key
        keyApi.deleteKey(keyGet.getId());

        // Check that the user's default key is unset after deletion
        assertNull(new UserApi(Config.getAdminAuthApiClient()).getUserById(sealUser.getId()).getDefaultKeyId());

        // Try to sign with a user which doesn't have a default key
        try {
            adminTokenAuthSignatureApi.getSignature(hashToSign, null, sealUser.getId(), null, null, null, null);
            fail("Should not be able to sign with a user which doesn't have a default key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to sign using as a user which doesn't have a default key
        try {
            sealTokenAuthSignatureApi.getSignature(hashToSign, null, sealUser.getId(), null, null, null, null);
            fail("Should not be able to sign with as user which doesn't have a default key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to sign as admin using a non-existing key
        try {
            adminTokenAuthSignatureApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
            fail("Should not be able to sign using a non-existing key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign as user using a non-existing key
        try {
            sealTokenAuthSignatureApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
            fail("Should not be able to sign using a non-existing key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }

    @Test
    public void getIdentifiedSignatureTest() throws ApiException, MalformedURLException {

        // Switch the server in strict mode (prevent identity exposure)
        serverConfigApi.updateServerConfig(new ServerConfig().preventIdentityExposure(true));

        // Prepare some random data to be signed
        String hashToSign = Config.randomHash();
        String messageToSign = Config.randomString(32);
        String problematicString = "@&é\"'(§è!çà)-^$ù`,;:=#°_¨*%£?./+";

        // Create a test user with a full identity
        FullIdentity testFullIdentity = new FullIdentity();
        testFullIdentity.setCommonName(Config.TEST_NAME_PREFIX + problematicString);
        testFullIdentity.setOrganization("O" + problematicString);
        testFullIdentity.setOrganizationalUnit("OU" + problematicString);
        testFullIdentity.setLocality("L" + problematicString);
        testFullIdentity.setCountry("FR");
        UserPut userPut = new UserPut();
        userPut.identity(testFullIdentity);
        UserApi adminUserApi = new UserApi(Config.getAdminAuthApiClient());
        sealUser = adminUserApi.updateUser(sealUser.getId(), userPut);
        eSignUser = adminUserApi.updateUser(eSignUser.getId(), userPut);

        // Sign random data using various identity layouts
        SignatureResult testSignatureHashSealALL = sealTokenAuthSignatureApi
                .getSignature(hashToSign, null, null, null, null, null, "ALL");
        SignatureResult testSignatureHashSealCN = sealTokenAuthSignatureApi
                .getSignature(hashToSign, null, null, null, null, null, "CN");
        SignatureResult testSignatureHashSealCNOOULCE = sealTokenAuthSignatureApi
                .getSignature(hashToSign, null, null, null, null, null, "CN,O,OU,L,C,EMAILADDRESS");
        SignatureResult testSignatureMessageSealALL = sealTokenAuthSignatureApi
                .getSignature(null, messageToSign, null, null, null, null, "ALL");
        SignatureResult testSignatureMessageSealCN = sealTokenAuthSignatureApi
                .getSignature(null, messageToSign, null, null, null, null, "CN");
        SignatureResult testSignatureMessageSealCNOOULCE = sealTokenAuthSignatureApi
                .getSignature(null, messageToSign, null, null, null, null, "CN,O,OU,L,C,EMAILADDRESS");

        // Check that "ALL" sends the same result as "CN,O,OU,L,C,EMAILADDRESS"
        assertEquals(testSignatureHashSealCNOOULCE, testSignatureHashSealALL);
        assertEquals(testSignatureMessageSealCNOOULCE, testSignatureMessageSealALL);

        // Check that signatures are valid
        verifyIdentifiedSignatureValid(hashToSign, null, testSignatureHashSealALL, sealUser);
        verifyIdentifiedSignatureValid(hashToSign, null, testSignatureHashSealCN, sealUser);
        verifyIdentifiedSignatureValid(hashToSign, null, testSignatureHashSealCNOOULCE, sealUser);
        verifyIdentifiedSignatureValid(null, messageToSign, testSignatureMessageSealALL, sealUser);
        verifyIdentifiedSignatureValid(null, messageToSign, testSignatureMessageSealCN, sealUser);
        verifyIdentifiedSignatureValid(null, messageToSign, testSignatureMessageSealCNOOULCE, sealUser);

        // Sign random data using various identity layouts
        SignatureResult testSignatureHashESignALL = eSignTokenAuthSignatureApi
                .getSignature(hashToSign, null, null, null, null, null, "ALL");
        SignatureResult testSignatureHashESignCN = eSignTokenAuthSignatureApi
                .getSignature(hashToSign, null, null, null, null, null, "CN");
        SignatureResult testSignatureHashESignCNOOULCE = eSignTokenAuthSignatureApi
                .getSignature(hashToSign, null, null, null, null, null, "CN,O,OU,L,C,EMAILADDRESS");
        SignatureResult testSignatureMessageESignALL = eSignTokenAuthSignatureApi
                .getSignature(null, messageToSign, null, null, null, null, "ALL");
        SignatureResult testSignatureMessageESignCN = eSignTokenAuthSignatureApi
                .getSignature(null, messageToSign, null, null, null, null, "CN");
        SignatureResult testSignatureMessageESignCNOOULCE = eSignTokenAuthSignatureApi
                .getSignature(null, messageToSign, null, null, null, null, "CN,O,OU,L,C,EMAILADDRESS");

        // Check if "ALL" sends the same result as "CN,O,OU,L,C,EMAILADDRESS"
        assertEquals(testSignatureHashESignCNOOULCE, testSignatureHashESignALL);
        assertEquals(testSignatureMessageESignCNOOULCE, testSignatureMessageESignALL);
        verifyIdentifiedSignatureValid(hashToSign, null, testSignatureHashESignALL, eSignUser);
        verifyIdentifiedSignatureValid(hashToSign, null, testSignatureHashESignCN, eSignUser);
        verifyIdentifiedSignatureValid(hashToSign, null, testSignatureHashESignCNOOULCE, eSignUser);
        verifyIdentifiedSignatureValid(null, messageToSign, testSignatureMessageESignALL, eSignUser);
        verifyIdentifiedSignatureValid(null, messageToSign, testSignatureMessageESignCN, eSignUser);
        verifyIdentifiedSignatureValid(null, messageToSign, testSignatureMessageESignCNOOULCE, eSignUser);
    }
}
