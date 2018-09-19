package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.*;

public class SignatureApiTest {

    private UserGet user;

    private SignatureApi adminAuthApi, userAuthApi, noAuthApi, tokenAuthApi;

    private ApiTokenApi apiTokenApi;
    private APITokenGet apiTokenGet;

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
            fail("Should not be able to get a signature with user credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to sign with admin attributes
        try {
            adminAuthApi.getSignature(Config.randomHash(), null, null, null);
            fail("Should not be able to get a signature with admin credentials");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Sign using the server's default key
        String hashToSign = Config.randomHash();
        SignatureResult signatureResult = tokenAuthApi.getSignature(hashToSign, null, null, null);
        assertNotNull(signatureResult.getIdentityURL());
        assertNotNull(signatureResult.getPubKey());
        assertNotNull(signatureResult.getSignature());
        assertEquals(hashToSign, signatureResult.getSignedHash());

        // Sign using user's default key
        hashToSign = Config.randomHash();
        signatureResult = tokenAuthApi.getSignature(hashToSign, user.getId(), null, null);
        assertNotNull(signatureResult.getIdentityURL());
        assertNotNull(signatureResult.getPubKey());
        assertNotNull(signatureResult.getSignature());
        assertEquals(hashToSign, signatureResult.getSignedHash());

//        // FIXME: this cannot work because attributes cannot be unset
//        // Unset user's default key
//        UserApi userApi = new UserApi(Config.getAdminAuthApiClient());
//        UserGet userGet = userApi.updateUser(user.getId(), (UserPut) new UserPut().defaultKeyId(null));
//        assertNull(userGet.getDefaultKeyId());

        // Delete user's default key
        KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());
        keyApi.deleteKey(user.getDefaultKeyId());

        // Try to sign using a non existing user's default key
        try {
            tokenAuthApi.getSignature(hashToSign, user.getId(), null, null);
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_NOT_FOUND, e.getCode());
        }
    }
}
