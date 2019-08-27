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
    public void creationUserTest() throws ApiException {
        String COMMON_NAME = Config.randomCommonName();
        FullIdentity fullIdentity = new FullIdentity();
        fullIdentity.commonName(COMMON_NAME);



        // Create an e-signature user without an email
        UserPost userESign;
        userESign = new UserPost();
        userESign.setMode(UserModeEnum.ESIGN);
        userESign.setIdentity(fullIdentity);

        UserApi userApi = new UserApi(Config.getAdminAuthApiClient());

        // Check that we cannot create an e-signature user without an email
        try {
            userApi.createUser(userESign);
            fail("Should not be able to create a e-sign user without an email");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        // Create a seal user without an organization
        UserPost userSeal;
        userSeal = new UserPost();
        userSeal.setIdentity(fullIdentity);

        // Check that we cannot create a seal user without an organization
        try {
            userApi.createUser(userSeal);
            fail("Should not be able to create a seal user without an organization");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }

        userSeal.setMode(UserModeEnum.SEAL);

        // Check that we cannot create a seal user without an organization
        try {
            userApi.createUser(userSeal);
            fail("Should not be able to create a seal user without an organization");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }
    }
}
