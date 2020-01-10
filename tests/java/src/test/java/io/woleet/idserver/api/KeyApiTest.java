package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

public class KeyApiTest {

    private UserGet userSeal;
    private KeyApi userAuthKeyApi, adminAuthKeyApi;

    @Before
    public void setUp() throws Exception {

        // Start form a clean state
        tearDown();

        userSeal = Config.createTestUser(UserModeEnum.SEAL);
        adminAuthKeyApi = new KeyApi(Config.getAdminAuthApiClient());
        userAuthKeyApi = new KeyApi(Config.getAuthApiClient(userSeal.getUsername(), "pass"));
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();
    }

    @Test
    public void userCreateKeyTest() {

        // Try to create a key with user credentials
        try {
            KeyPost keyPost = new KeyPost();
            keyPost.setName(Config.randomName());
            userAuthKeyApi.createKey(userSeal.getId(), keyPost);
            fail("Should not be able to create a key object with user credentials");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void userDeleteKeyTest() {

        // Try to delete a key with user credentials
        try {
            userAuthKeyApi.deleteKey(userSeal.getDefaultKeyId());
            fail("Should not be able to delete a key with user credentials");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void userGetAllKeyTest() {

        // Try to get all keys with user credentials
        try {
            userAuthKeyApi.getAllUserKeys(userSeal.getId());
            fail("Should not be able to get all keys with user credentials");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void keyExpirationTest() throws ApiException {

        // Check that we cannot create an already expired key
        try {
            KeyPost keyPost = new KeyPost();
            keyPost.setName(Config.randomName());
            keyPost.setExpiration(System.currentTimeMillis() - 1000L);
            adminAuthKeyApi.createKey(userSeal.getId(), keyPost);
            fail("Should not be able to create an already expired key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Expire a key and check that the expiration status and date is valid
        adminAuthKeyApi.updateKey(userSeal.getDefaultKeyId(), new KeyPut().expiration(System.currentTimeMillis()));
        KeyGet keyGet = adminAuthKeyApi.getKeyById(userSeal.getDefaultKeyId());
        assertTrue(keyGet.getExpired());
        assertTrue(keyGet.getExpiration() < System.currentTimeMillis()
                   && keyGet.getExpiration() > System.currentTimeMillis() - 1000L);

        // TODO: check that we cannot use an expired key to sign
    }

    @Test
    public void keyRevocationTest() throws ApiException {

        // Revoke a key and check that revocation status and date are valid
        adminAuthKeyApi.updateKey(userSeal.getDefaultKeyId(), new KeyPut().status(KeyStatusEnum.REVOKED));
        KeyGet keyGet = adminAuthKeyApi.getKeyById(userSeal.getDefaultKeyId());
        assertEquals(KeyStatusEnum.REVOKED, keyGet.getStatus());
        assertTrue(keyGet.getRevokedAt() < System.currentTimeMillis()
                   && keyGet.getRevokedAt() > System.currentTimeMillis() - 1000L);

        // Check that we cannot update a revoked key
        try {
            adminAuthKeyApi.updateKey(userSeal.getDefaultKeyId(), new KeyPut().status(KeyStatusEnum.REVOKED));
            fail("Should not be able to update a revoked key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Check that we cannot delete a revoked key
        try {
            adminAuthKeyApi.deleteKey(userSeal.getDefaultKeyId());
            fail("Should not be able to delete a revoked key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // TODO: check that we cannot use a revoked key to sign
    }
}
