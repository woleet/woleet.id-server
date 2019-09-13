package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class KeyApiTest {

    private UserGet userSeal;

    @Before
    public void setUp() throws Exception {
        // Start form a clean state
        tearDown();

        userSeal = Config.createTestUser(UserModeEnum.SEAL);
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();
    }

    @Test
    public void createExpiredKeyTest() throws ApiException {

        KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());

        // Check that we cannot create an already expired key
        try {
            KeyPost keyPost = new KeyPost();
            keyPost.setName(Config.randomName());
            keyPost.setExpiration(System.currentTimeMillis() - 1000);
            keyApi.createKey(userSeal.getId(), keyPost);
            fail("Should not be able to create an already expired key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }
    }

    @Test
    public void keyRevocationTest() throws ApiException {

        KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());

        // Revoke SEAL user's default key
        KeyPut keyPut = new KeyPut();
        keyPut.setStatus(KeyStatusEnum.REVOKED);
        KeyGet keyGet = keyApi.updateKey(userSeal.getDefaultKeyId(), keyPut);
        assertEquals(KeyStatusEnum.REVOKED, keyGet.getStatus());

        // Check that we cannot update a revoked key
        try {
            keyApi.updateKey(userSeal.getDefaultKeyId(), keyPut);
            fail("Should not be able to update a revoked key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Check that we cannot delete a revoked key
        try {
            keyApi.deleteKey(userSeal.getDefaultKeyId());
            fail("Should not be able to delete a revoked key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }
}
