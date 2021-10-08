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
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.*;

public class SignatureApiTest {

    private static String WOLEET_ID_SERVER_SIGNATURE_BASEPATH = System.getenv("WOLEET_ID_SERVER_SIGNATURE_BASEPATH");

    static {
        if (WOLEET_ID_SERVER_SIGNATURE_BASEPATH == null)
            WOLEET_ID_SERVER_SIGNATURE_BASEPATH = "https://localhost:3002";
    }

    private UserGet userSeal, userESign;

    private SignatureApi adminAuthApi, userAuthApi, noAuthApi,
            tokenAuthAdminApi, tokenAuthUserSealApi, tokenAuthUserESignApi;

    private ApiTokenApi apiTokenApi;
    private APITokenGet apiTokenAdmin, apiTokenUserSeal, apiTokenUserESign;

    /**
     * Verify that the result of a signature not including a signed identity is valid.
     */
    private void verifyRegularSignatureValid(String hashToSign, String messageToSign, SignatureResult signatureResult)
            throws ApiException {

        // Check provided properties
        assertNotNull(signatureResult.getIdentityURL());
        ServerConfigApi serverConfigApi = new ServerConfigApi(Config.getAdminAuthApiClient());
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
        ServerConfigApi serverConfigApi = new ServerConfigApi(Config.getAdminAuthApiClient());
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
        userSeal = Config.createTestUser();
        userESign = Config.createTestUser(UserModeEnum.ESIGN);

        // Create 3 helper APIs: one with admin rights, one with user rights, one not authenticated
        adminAuthApi = new SignatureApi(Config.getAdminAuthApiClient()
                .setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH));
        userAuthApi = new SignatureApi(Config.getAuthApiClient(userSeal.getUsername(), "pass")
                .setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH));
        noAuthApi = new SignatureApi(Config.getNoAuthApiClient()
                .setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH));

        // Create a token API with admin rights
        apiTokenApi = new ApiTokenApi(Config.getAdminAuthApiClient());

        // Create a helper API with admin rights using token authentication
        apiTokenAdmin = Config.createTestApiToken(null);
        ApiClient apiClientAdmin = Config.getNoAuthApiClient().setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH);
        apiClientAdmin.addDefaultHeader("Authorization", "Bearer " + apiTokenAdmin.getValue());
        tokenAuthAdminApi = new SignatureApi(apiClientAdmin);

        // Create a helper API with seal user rights using token authentication
        apiTokenUserSeal = Config.createTestApiToken(userSeal.getId());
        ApiClient apiClientUserSeal = Config.getNoAuthApiClient().setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH);
        apiClientUserSeal.addDefaultHeader("Authorization", "Bearer " + apiTokenUserSeal.getValue());
        tokenAuthUserSealApi = new SignatureApi(apiClientUserSeal);

        // Create a helper API with esign user rights using token authentication
        apiTokenUserESign = Config.createTestApiToken(userESign.getId());
        ApiClient apiClientUserESign = Config.getNoAuthApiClient().setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH);
        apiClientUserESign.addDefaultHeader("Authorization", "Bearer " + apiTokenUserESign.getValue());
        tokenAuthUserESignApi = new SignatureApi(apiClientUserESign);
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();
        Config.deleteAllTestAPITokens();
    }

    @Test
    public void getLegacySignatureTest() throws ApiException, InterruptedException {

        String hashToSign = Config.randomHash();

        // Switch the server in relaxed mode (don't prevent identity exposure)
        ServerConfigApi serverConfigApi = new ServerConfigApi(Config.getAdminAuthApiClient());
        ServerConfig serverConfig = serverConfigApi.getServerConfig();
        serverConfig.setPreventIdentityExposure(false);
        serverConfigApi.updateServerConfig(serverConfig);

        // Switch the server to fallback on default key
        serverConfigApi.updateServerConfig(new ServerConfig().fallbackOnDefaultKey(true));
        TimeUnit.MILLISECONDS.sleep(1000L);

        // Try to sign with no credentials
        try {
            noAuthApi.getSignature(Config.randomHash(), null, null, null, null, null, null);
            fail("Should not be able to get a signature with no credentials");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign with user rights
        try {
            userAuthApi.getSignature(Config.randomHash(), null, null, null, null, null, null);
            fail("Should not be able to sign with user rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign with admin rights
        try {
            adminAuthApi.getSignature(Config.randomHash(), null, null, null, null, null, null);
            fail("Should not be able to sign with admin rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign an invalid hash
        try {
            tokenAuthAdminApi.getSignature("invalid hash", null, null, null, null, null, null);
            fail("Should not be able to sign an invalid hash");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Try to sign using an invalid key
        try {
            tokenAuthAdminApi.getSignature(hashToSign, null, null, null, "invalid pubKey", null, null);
            fail("Should not be able to sign using an invalid key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Try to sign using a non-existing key
        try {
            tokenAuthAdminApi.getSignature(hashToSign, null, null, null, "1iBDiJNw1moBD37mqjCVQNxGbEeqXtWnUG", null,
                    null);
            fail("Should not be able to sign using a non-existing key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non-existing user (userId)
        try {
            tokenAuthAdminApi.getSignature(hashToSign, null, Config.randomUUID(), null, null, null, null);
            fail("Should not be able to sign using a non-existing user");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non-existing user (customUserId)
        try {
            tokenAuthAdminApi.getSignature(hashToSign, null, null, "non-existing customUserId", null, null, null);
            fail("Should not be able to sign using a non-existing user");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non-existing key
        try {
            tokenAuthAdminApi.getSignature(hashToSign, null, null, null, "1iBDiJNw1moBD37mqjCVQNxGbEeqXtWnUG", null,
                    null);
            fail("Should not be able to sign using a non-existing key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign as a different user
        try {
            tokenAuthUserSealApi.getSignature(hashToSign, null, userESign.getId(), null, null, null, null);
            fail("Should not be able to sign as a different user");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign with a non-owned key
        try {
            KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
            KeyGet keyGet = keyApi.getKeyById(userESign.getDefaultKeyId());
            String pubKey = keyGet.getPubKey();
            tokenAuthUserSealApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
            fail("Should not be able to sign with a non owned key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using an esign user key with an admin token
        try {
            KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
            KeyGet keyGet = keyApi.getKeyById(userESign.getDefaultKeyId());
            String pubKey = keyGet.getPubKey();
            tokenAuthAdminApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
            fail("Should not be able to sign using an esign user key with an admin token");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign as an esign user with an admin token
        try {
            tokenAuthAdminApi.getSignature(hashToSign, null, userESign.getId(), null, null, null, null);
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
            tokenAuthAdminApi.getSignature(hashToSign, null, null, null, null, null, null);
            fail("Should not be able to sign using a non-existing server's default key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Switch back the server config to fallback on default key
        serverConfigApi.updateServerConfig(new ServerConfig().fallbackOnDefaultKey(true));
        TimeUnit.MILLISECONDS.sleep(1000L);

        // Sign a random hash using the server's default key
        SignatureResult signatureResult = tokenAuthAdminApi.getSignature(hashToSign, null, null, null, null, null,
                null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Check that admin API token's last used time is close to current time
        apiTokenAdmin = apiTokenApi.getAPITokenById(apiTokenAdmin.getId());
        assertTrue(apiTokenAdmin.getLastUsed() < System.currentTimeMillis() + 60L * 1000L
                   && apiTokenAdmin.getLastUsed() > System.currentTimeMillis() - 60L * 1000L);

        // Sign a random message using the user's default key
        String messageToSign = Config.randomString(32);
        signatureResult = tokenAuthUserSealApi.getSignature(null, messageToSign, null, null, null, null, null);
        verifyRegularSignatureValid(null, messageToSign, signatureResult);

        // Check that user API token's last used time is close to current time
        apiTokenUserSeal = apiTokenApi.getAPITokenById(apiTokenUserSeal.getId());
        assertTrue(apiTokenUserSeal.getLastUsed() < System.currentTimeMillis() + 60L * 1000L
                   && apiTokenUserSeal.getLastUsed() > System.currentTimeMillis() - 60L * 1000L);

        // Sign using the server's default key and derivation path
        signatureResult = tokenAuthAdminApi.getSignature(hashToSign, null, null, null, null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using the server's default key and derivation path (force it)
        SignatureResult signatureResult4400 = tokenAuthAdminApi
                .getSignature(hashToSign, null, null, null, null, "m/44'/0'/0'", null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult4400);
        assertEquals(signatureResult.getPubKey(), signatureResult4400.getPubKey());
        assertEquals(signatureResult.getSignature(), signatureResult4400.getSignature());

        // Sign using the server's default key and specific derivation path
        SignatureResult signatureResult4401 = tokenAuthAdminApi
                .getSignature(hashToSign, null, null, null, null, "m/44'/0'/1'", null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult4401);
        assertNotEquals(signatureResult.getPubKey(), signatureResult4401.getPubKey());
        assertNotEquals(signatureResult.getSignature(), signatureResult4401.getSignature());

        // Get seal user's default key
        KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
        KeyGet keyGet = keyApi.getKeyById(userSeal.getDefaultKeyId());
        String pubKey = keyGet.getPubKey();

        // Sign using seal user's default key (pubKey) with an admin token
        signatureResult = tokenAuthAdminApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using seal user's default key (userId) with an admin token
        signatureResult = tokenAuthAdminApi.getSignature(hashToSign, null, userSeal.getId(), null, null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using seal user's default key (customUserId) with an admin token
        signatureResult = tokenAuthAdminApi.getSignature(hashToSign, null, null, userSeal.getIdentity().getUserId(),
                null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using seal user's default key with a user token
        signatureResult = tokenAuthUserSealApi.getSignature(hashToSign, null, null, null, null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using seal user's default key (userId) with a user token
        signatureResult = tokenAuthUserSealApi.getSignature(hashToSign, null, userSeal.getId(), null, null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using seal user's default key (customUserId) with a user token
        signatureResult = tokenAuthUserSealApi.getSignature(hashToSign, null, null, userSeal.getIdentity().getUserId(),
                null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using seal user's default key (pubKey) with a user token
        signatureResult = tokenAuthUserSealApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Get esign user's default key
        keyGet = keyApi.getKeyById(userESign.getDefaultKeyId());
        pubKey = keyGet.getPubKey();

        // Sign using esign user's default key with a user token
        signatureResult = tokenAuthUserESignApi.getSignature(hashToSign, null, null, null, null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using esign user's default key (userId) with a user token
        signatureResult = tokenAuthUserESignApi.getSignature(hashToSign, null, userESign.getId(), null, null, null,
                null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using esign user's default key (customUserId) with a user token
        signatureResult = tokenAuthUserESignApi.getSignature(hashToSign, null, null,
                userESign.getIdentity().getUserId(), null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using esign user's default key (pubKey) with a user token
        signatureResult = tokenAuthUserESignApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Get seal user's default key
        keyGet = keyApi.getKeyById(userSeal.getDefaultKeyId());
        pubKey = keyGet.getPubKey();

        // Check that default key's last used time is close to current time
        assertTrue(keyGet.getLastUsed() < System.currentTimeMillis() + 60L * 1000L
                   && keyGet.getLastUsed() > System.currentTimeMillis() - 60L * 1000L);

        // Check that API token's last used time is close to current time
        apiTokenUserSeal = apiTokenApi.getAPITokenById(apiTokenUserSeal.getId());
        assertTrue(apiTokenUserSeal.getLastUsed() < System.currentTimeMillis() + 60L * 1000L
                   && apiTokenUserSeal.getLastUsed() > System.currentTimeMillis() - 60L * 1000L);

        // Check that API token's last used time is close to current time
        apiTokenUserESign = apiTokenApi.getAPITokenById(apiTokenUserESign.getId());
        assertTrue(apiTokenUserESign.getLastUsed() < System.currentTimeMillis() + 60L * 1000L
                   && apiTokenUserESign.getLastUsed() > System.currentTimeMillis() - 60L * 1000L);

        // Try to sign with a blocked key
        try {
            KeyPut keyPut = new KeyPut();
            keyPut.setStatus(KeyStatusEnum.BLOCKED);
            keyApi.updateKey(keyGet.getId(), keyPut);
            tokenAuthAdminApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
            fail("Should not be able to sign with a blocked key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Delete user's default key
        keyApi.deleteKey(keyGet.getId());

        // Check that the user's default key is unset after deletion
        assertNull(new UserApi(Config.getAdminAuthApiClient()).getUserById(userSeal.getId()).getDefaultKeyId());

        // Try to sign with a user which doesn't have a default key
        try {
            tokenAuthAdminApi.getSignature(hashToSign, null, userSeal.getId(), null, null, null, null);
            fail("Should not be able to sign with a user which doesn't have a default key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to sign using as a user which doesn't have a default key
        try {
            tokenAuthUserSealApi.getSignature(hashToSign, null, userSeal.getId(), null, null, null, null);
            fail("Should not be able to sign with as user which doesn't have a default key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to sign as admin using a non-existing key
        try {
            tokenAuthAdminApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
            fail("Should not be able to sign using a non-existing key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign as user using a non-existing key
        try {
            tokenAuthUserSealApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
            fail("Should not be able to sign using a non-existing key");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }

    @Test
    public void getIdentifiedSignatureTest() throws ApiException, MalformedURLException {

        // Switch the server in strict mode (prevent identity exposure)
        ServerConfigApi serverConfigApi = new ServerConfigApi(Config.getAdminAuthApiClient());
        ServerConfig serverConfig = serverConfigApi.getServerConfig();
        serverConfig.setPreventIdentityExposure(true);
        serverConfigApi.updateServerConfig(serverConfig);

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
        userSeal = adminUserApi.updateUser(userSeal.getId(), userPut);
        userESign = adminUserApi.updateUser(userESign.getId(), userPut);

        // Sign random data using various identity layouts
        SignatureResult testSignatureHashSealALL = tokenAuthUserSealApi
                .getSignature(hashToSign, null, null, null, null, null, "ALL");
        SignatureResult testSignatureHashSealCN = tokenAuthUserSealApi
                .getSignature(hashToSign, null, null, null, null, null, "CN");
        SignatureResult testSignatureHashSealCNOOULCE = tokenAuthUserSealApi
                .getSignature(hashToSign, null, null, null, null, null, "CN,O,OU,L,C,EMAILADDRESS");
        SignatureResult testSignatureMessageSealALL = tokenAuthUserSealApi
                .getSignature(null, messageToSign, null, null, null, null, "ALL");
        SignatureResult testSignatureMessageSealCN = tokenAuthUserSealApi
                .getSignature(null, messageToSign, null, null, null, null, "CN");
        SignatureResult testSignatureMessageSealCNOOULCE = tokenAuthUserSealApi
                .getSignature(null, messageToSign, null, null, null, null, "CN,O,OU,L,C,EMAILADDRESS");

        // Check that "ALL" sends the same result as "CN,O,OU,L,C,EMAILADDRESS"
        assertEquals(testSignatureHashSealCNOOULCE, testSignatureHashSealALL);
        assertEquals(testSignatureMessageSealCNOOULCE, testSignatureMessageSealALL);

        // Check that signatures are valid
        verifyIdentifiedSignatureValid(hashToSign, null, testSignatureHashSealALL, userSeal);
        verifyIdentifiedSignatureValid(hashToSign, null, testSignatureHashSealCN, userSeal);
        verifyIdentifiedSignatureValid(hashToSign, null, testSignatureHashSealCNOOULCE, userSeal);
        verifyIdentifiedSignatureValid(null, messageToSign, testSignatureMessageSealALL, userSeal);
        verifyIdentifiedSignatureValid(null, messageToSign, testSignatureMessageSealCN, userSeal);
        verifyIdentifiedSignatureValid(null, messageToSign, testSignatureMessageSealCNOOULCE, userSeal);

        // Sign random data using various identity layouts
        SignatureResult testSignatureHashESignALL = tokenAuthUserESignApi
                .getSignature(hashToSign, null, null, null, null, null, "ALL");
        SignatureResult testSignatureHashESignCN = tokenAuthUserESignApi
                .getSignature(hashToSign, null, null, null, null, null, "CN");
        SignatureResult testSignatureHashESignCNOOULCE = tokenAuthUserESignApi
                .getSignature(hashToSign, null, null, null, null, null, "CN,O,OU,L,C,EMAILADDRESS");
        SignatureResult testSignatureMessageESignALL = tokenAuthUserESignApi
                .getSignature(null, messageToSign, null, null, null, null, "ALL");
        SignatureResult testSignatureMessageESignCN = tokenAuthUserESignApi
                .getSignature(null, messageToSign, null, null, null, null, "CN");
        SignatureResult testSignatureMessageESignCNOOULCE = tokenAuthUserESignApi
                .getSignature(null, messageToSign, null, null, null, null, "CN,O,OU,L,C,EMAILADDRESS");

        // Check if "ALL" sends the same result as "CN,O,OU,L,C,EMAILADDRESS"
        assertEquals(testSignatureHashESignCNOOULCE, testSignatureHashESignALL);
        assertEquals(testSignatureMessageESignCNOOULCE, testSignatureMessageESignALL);
        verifyIdentifiedSignatureValid(hashToSign, null, testSignatureHashESignALL, userESign);
        verifyIdentifiedSignatureValid(hashToSign, null, testSignatureHashESignCN, userESign);
        verifyIdentifiedSignatureValid(hashToSign, null, testSignatureHashESignCNOOULCE, userESign);
        verifyIdentifiedSignatureValid(null, messageToSign, testSignatureMessageESignALL, userESign);
        verifyIdentifiedSignatureValid(null, messageToSign, testSignatureMessageESignCN, userESign);
        verifyIdentifiedSignatureValid(null, messageToSign, testSignatureMessageESignCNOOULCE, userESign);
    }
}
