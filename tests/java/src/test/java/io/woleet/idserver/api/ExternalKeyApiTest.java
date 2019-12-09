package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.ExternalKeyPost;
import io.woleet.idserver.api.model.UserGet;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class ExternalKeyApiTest {

    @Before
    public void setUp() throws Exception {

        // Start form a clean state
        tearDown();
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();
    }

    @Test
    public void createSealExternalKeyTest() throws ApiException {
        UserGet user = Config.createTestUser();

        ExternalKeyPost externalKeyPost = new ExternalKeyPost();
        externalKeyPost.setName(Config.randomName());
        externalKeyPost.setPublicKey(Config.randomAddress());
        KeyApi keyApi = new KeyApi(Config.getAdminAuthApiClient());

        try {
            keyApi.createExternalKey(user.getId(), externalKeyPost);
            fail("Should not be able to assign a external key to a user in seal mode");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }
    }
}
