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
            WOLEET_ID_SERVER_SIGNATURE_BASEPATH = "https://localhost:3000";
    }

    private UserGet userSeal, userESign;

    private SignatureApi adminAuthApi, userAuthApi, noAuthApi, tokenAuthAdminApi,
        tokenAuthUserSealApi, tokenAuthUserESignApi;

    private ApiTokenApi apiTokenApi;
    private APITokenGet apiTokenAdminGet, apiTokenUserSealGet, apiTokenUserESignGet;

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

        // Create one helper API with admin rights using token authentication
        apiTokenApi = new ApiTokenApi(Config.getAdminAuthApiClient());
        apiTokenAdminGet = apiTokenApi.createAPIToken(new APITokenPost().name("test-admin"));
        ApiClient apiClientAdmin = Config.getNoAuthApiClient().setBasePath(WOLEET_ID_SERVER_SIGNATURE_BASEPATH);
        apiClientAdmin.addDefaultHeader("Authorization", "Bearer " + apiTokenAdminGet.getValue());
        tokenAuthAdminApi = new SignatureApi(apiClientAdmin);

        // Create two helper APIs with user rights using token authentication
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
        tokenAuthUserESignApi = new SignatureApi(apiClientUserESign);
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
    public void getRegularSignatureTest() throws ApiException, InterruptedException {

        // Try to sign with no credentials
        try {
            noAuthApi.getSignature(Config.randomHash(), null, null, null, null, null, null);
            fail("Should not be able to get a signature with no credentials");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign with user credentials
        try {
            userAuthApi.getSignature(Config.randomHash(), null, null, null, null, null, null);
            fail("Should not be able to sign with user credentials");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign with admin credentials
        try {
            adminAuthApi.getSignature(Config.randomHash(), null, null, null, null, null, null);
            fail("Should not be able to sign with admin credentials");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign an invalid hash
        try {
            tokenAuthAdminApi.getSignature("invalid hash", null, null, null, null, null, null);
            fail("Should not be able to sign an invalid hash");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Try to sign using an invalid key
        try {
            String hashToSign = Config.randomHash();
            tokenAuthAdminApi.getSignature(hashToSign, null, null, null, "invalid pubKey", null, null);
            fail("Should not be able to sign using an invalid key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Try to sign using a non existing key
        try {
            String hashToSign = Config.randomHash();
            tokenAuthAdminApi
                .getSignature(hashToSign, null, null, null, "1iBDiJNw1moBD37mqjCVQNxGbEeqXtWnUG", null, null);
            fail("Should not be able to sign using a non existing key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non existing user (userId)
        try {
            String hashToSign = Config.randomHash();
            tokenAuthAdminApi.getSignature(hashToSign, null, Config.randomUUID(), null, null, null, null);
            fail("Should not be able to sign using a non existing user");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non existing user (customUserId)
        try {
            String hashToSign = Config.randomHash();
            tokenAuthAdminApi.getSignature(hashToSign, null, null, "non existing customUserId", null, null, null);
            fail("Should not be able to sign using a non existing user");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign using a non existing key
        try {
            String hashToSign = Config.randomHash();
            tokenAuthAdminApi
                .getSignature(hashToSign, null, null, null, "1iBDiJNw1moBD37mqjCVQNxGbEeqXtWnUG", null, null);
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
            tokenAuthUserSealApi.getSignature(hashToSign, null, userESign.getId(), null, pubKey, null, null);
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
            tokenAuthUserSealApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
            fail("Should not be able to find a non owned key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign as an esign user with an admin token
        try {
            KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
            String hashToSign = Config.randomHash();
            KeyGet keyGet = keyApi.getKeyById(userESign.getDefaultKeyId());
            String pubKey = keyGet.getPubKey();
            tokenAuthAdminApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
            fail("Should not be able to sign as an esign user with an admin token");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign as an esign user with an admin token
        try {
            String hashToSign = Config.randomHash();
            tokenAuthAdminApi.getSignature(hashToSign, null, userESign.getId(), null, null, null, null);
            fail("Should not be able to sign as an esign user with an admin token");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Sign using the server's default key
        String hashToSign = Config.randomHash();
        SignatureResult signatureResult = tokenAuthAdminApi
            .getSignature(hashToSign, null, null, null, null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign a random message using the user's default key
        String messageToSign = Config.randomString(32);
        signatureResult = tokenAuthUserSealApi.getSignature(null, messageToSign, null, null, null, null, null);
        verifyRegularSignatureValid(null, messageToSign, signatureResult);

        // Check that API token's last used time is close to current time
        apiTokenAdminGet = apiTokenApi.getAPITokenById(apiTokenAdminGet.getId());
        assertTrue(apiTokenAdminGet.getLastUsed() < System.currentTimeMillis() + 60L * 1000L
                   && apiTokenAdminGet.getLastUsed() > System.currentTimeMillis() - 60L * 1000L);

        // Change server config not to fallback on default key
        ServerConfigApi serverConfigApi = new ServerConfigApi(Config.getAdminAuthApiClient());
        ServerConfig serverConfig = serverConfigApi.getServerConfig();
        serverConfigApi.updateServerConfig(new ServerConfig().fallbackOnDefaultKey(false));
        TimeUnit.MILLISECONDS.sleep(1000L);

        // Try to sign using a non existing server's default key
        try {
            tokenAuthAdminApi.getSignature(hashToSign, null, null, null, null, null, null);
            fail("Should not be able to sign using a non existing server's default key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Reset server config
        serverConfigApi.updateServerConfig(serverConfig);
        TimeUnit.MILLISECONDS.sleep(1000L);

        // Sign using user's default key (userId)
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthAdminApi.getSignature(hashToSign, null, userSeal.getId(), null, null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using user's default key (userId) with a user token
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthUserSealApi.getSignature(hashToSign, null, userSeal.getId(), null, null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using user's default key (customUserId)
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthAdminApi
            .getSignature(hashToSign, null, null, userSeal.getIdentity().getUserId(), null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using user's default key (customUserId)
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthUserSealApi
            .getSignature(hashToSign, null, null, userSeal.getIdentity().getUserId(), null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using esign user's default key (pubKey)
        KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
        hashToSign = Config.randomHash();
        KeyGet keyGet = keyApi.getKeyById(userESign.getDefaultKeyId());
        String pubKey = keyGet.getPubKey();
        signatureResult = tokenAuthUserESignApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using esign user's id
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthUserESignApi.getSignature
            (hashToSign, null, userESign.getId(), null, null, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using user's default key (pubKey)
        hashToSign = Config.randomHash();
        keyGet = keyApi.getKeyById(userSeal.getDefaultKeyId());
        pubKey = keyGet.getPubKey();
        signatureResult = tokenAuthAdminApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

        // Sign using user's default key (pubKey)
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthUserSealApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
        verifyRegularSignatureValid(hashToSign, null, signatureResult);

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
            tokenAuthAdminApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
            fail("Should not be able to sign with a blocked key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Delete user's default key
        keyApi.deleteKey(keyGet.getId());

        // Verify that the user's default key is unset after deletion
        assertNull(new UserApi(Config.getAdminAuthApiClient()).getUserById(userSeal.getId()).getDefaultKeyId());

        // Try to sign with a user which doesn't have a default key
        try {
            tokenAuthAdminApi.getSignature(hashToSign, null, userSeal.getId(), null, null, null, null);
            fail("Should not be able to sign with a user which doesn't have a default key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to sign using as a user which doesn't have a default key
        try {
            tokenAuthUserSealApi.getSignature(hashToSign, null, userSeal.getId(), null, null, null, null);
            fail("Should not be able to sign with as user which doesn't have a default key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to sign as admin using a non existing key
        try {
            tokenAuthAdminApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
            fail("Should not be able to sign using a non existing key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Try to sign as user using a non existing key
        try {
            tokenAuthUserSealApi.getSignature(hashToSign, null, null, null, pubKey, null, null);
            fail("Should not be able to sign using a non existing key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }

        // Sign using the server's default key and derivation path
        hashToSign = Config.randomHash();
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
    }

    @Test
    public void getIdentifiedSignatureTest() throws ApiException, MalformedURLException {

        // Prepare some random data to be signed
        String hashToSign = Config.randomHash();
        String messageToSign = Config.randomString(32);
        String problematicString = "@&é\"'(§è!çà)-^$ù`,;:=#°_¨*%£?./+";

        // Create a test user with a full identity
        FullIdentity testFullIdentity = new FullIdentity();
        testFullIdentity.setCommonName(Config.TEST_USERS_COMMONNAME_PREFIX + problematicString);
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
