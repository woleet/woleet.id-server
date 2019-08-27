package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.EnrollmentPost;
import io.woleet.idserver.api.model.KeyPost;
import io.woleet.idserver.api.model.UserGet;
import io.woleet.idserver.api.model.UserModeEnum;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class EnrollmentApiTest {

    UserGet userESign, userSeal;
    EnrollmentPost enrollmentPost;

    @Before
    public void setUp() throws Exception {
        // Start form a clean state
        tearDown();

        userESign = Config.createTestUser(UserModeEnum.ESIGN);
        userSeal = Config.createTestUser(UserModeEnum.SEAL);
        enrollmentPost = new EnrollmentPost();
        enrollmentPost.setTest(true);
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();
    }

    @Test
    public void createExpiredEnrollmentTest() throws ApiException {
        EnrollmentApi enrollmentApi = new EnrollmentApi(Config.getAdminAuthApiClient());

        enrollmentPost.setName(Config.randomName());
        enrollmentPost.setExpiration(System.currentTimeMillis() - 1000);
        enrollmentPost.setUserId(userESign.getId());

        // Check that we cannot create an already expired enrollment
        try {
            enrollmentApi.createEnrollment(enrollmentPost);
            fail("Should not be able to create an already expired enrollment");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }
    }

    @Test
    public void createSealEnrollmentTest() throws ApiException {
        EnrollmentApi enrollmentApi = new EnrollmentApi(Config.getAdminAuthApiClient());

        enrollmentPost.setName(Config.randomName());
        enrollmentPost.setUserId(userSeal.getId());

        // Check that we cannot create an enrollment for a seal user
        try {
            enrollmentApi.createEnrollment(enrollmentPost);
            fail("Should not be able to create an enrollment for a seal user");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }
    }

    @Test
    public void createExpiredKeyEnrollmentTest() throws ApiException {
        EnrollmentApi enrollmentApi = new EnrollmentApi(Config.getAdminAuthApiClient());

        enrollmentPost.setName(Config.randomName());
        enrollmentPost.setUserId(userESign.getId());
        enrollmentPost.setKeyExpiration(System.currentTimeMillis() - 1000);

        // Check that we cannot create an enrollment with an already expired key
        try {
            enrollmentApi.createEnrollment(enrollmentPost);
            fail("Should not be able to create an enrollment with an already expired key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }
    }
}
