package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.FullIdentity;
import io.woleet.idserver.api.model.UserModeEnum;
import io.woleet.idserver.api.model.UserPost;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class UserApiTest {

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
    public void createUserTest() throws ApiException {

        UserApi userApi = new UserApi(Config.getAdminAuthApiClient());

        // Create an e-signature user without an email
        UserPost userESign;
        userESign = new UserPost();
        userESign.setMode(UserModeEnum.ESIGN);
        String COMMON_NAME = Config.randomCommonName();
        FullIdentity fullIdentity = new FullIdentity();
        fullIdentity.commonName(COMMON_NAME);
        userESign.setIdentity(fullIdentity);

        // Check that we cannot create an e-signature user without an email
        try {
            userApi.createUser(userESign);
            fail("Should not be able to create a e-signature user without an email");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Create a seal user without an organization
        UserPost userSeal;
        userSeal = new UserPost();
        userSeal.setIdentity(fullIdentity);

        // Check that we cannot create a seal user (default mode) without an organization
        try {
            userApi.createUser(userSeal);
            fail("Should not be able to create a seal user without an organization");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Check that we cannot create a seal user (explicit mode) without an organization
        try {
            userSeal.setMode(UserModeEnum.SEAL);
            userApi.createUser(userSeal);
            fail("Should not be able to create a seal user without an organization");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }
    }
}
