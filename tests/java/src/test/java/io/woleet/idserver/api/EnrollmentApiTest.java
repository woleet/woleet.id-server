package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.EnrollmentGet;
import io.woleet.idserver.api.model.EnrollmentPost;
import io.woleet.idserver.api.model.UserGet;
import io.woleet.idserver.api.model.UserModeEnum;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class EnrollmentApiTest {

    private UserGet userESign, userSeal;
    private EnrollmentPost enrollmentPost;

    @Before
    public void setUp() throws Exception {

        // Start form a clean state
        tearDown();

        // Create 2 users
        userESign = Config.createTestUser(UserModeEnum.ESIGN);
        userSeal = Config.createTestUser(UserModeEnum.SEAL);

        // Prepare an enrollment
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



        // Check that we cannot create an already expired enrollment
        try {
            enrollmentPost.setName(Config.randomName());
            enrollmentPost.setExpiration(System.currentTimeMillis() - 1000);
            enrollmentPost.setUserId(userESign.getId());
            enrollmentApi.createEnrollment(enrollmentPost);
            fail("Should not be able to create an already expired enrollment");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }
    }

    @Test
    public void userCreateEnrollmentTest() throws ApiException {
        UserGet user = Config.createTestUser();
        EnrollmentApi userAuthApi = new EnrollmentApi(Config.getAuthApiClient(user.getUsername(), "pass"));

        // Try to create an enrollment with user credentials
        try {
            enrollmentPost.setName(Config.randomName());
            enrollmentPost.setUserId(userESign.getId());
            userAuthApi.createEnrollment(enrollmentPost);
            fail("Should not be able to create an enrollment object with user credentials");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void userDeleteEnrollmentTest() throws ApiException {
        UserGet user = Config.createTestUser();
        EnrollmentApi userAuthApi = new EnrollmentApi(Config.getAuthApiClient(user.getUsername(), "pass"));
        EnrollmentApi enrollmentApi = new EnrollmentApi(Config.getAdminAuthApiClient());

        // Try to delete an enrollment with user credentials
        try {
            enrollmentPost.setName(Config.randomName());
            enrollmentPost.setUserId(userESign.getId());
            EnrollmentGet enrollmentGet = enrollmentApi.createEnrollment(enrollmentPost);
            userAuthApi.deleteEnrollment(enrollmentGet.getId());
            fail("Should not be able to delete an enrollment object with user credentials");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void userGetAllEnrollmentTest() throws ApiException {
        UserGet user = Config.createTestUser();
        EnrollmentApi userAuthApi = new EnrollmentApi(Config.getAuthApiClient(user.getUsername(), "pass"));

        // Try to get all enrollments with user credentials
        try {
            userAuthApi.getAllEnrollments();
            fail("Should not be able to get all enrollments object with user credentials");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void createSealEnrollmentTest() throws ApiException {
        EnrollmentApi enrollmentApi = new EnrollmentApi(Config.getAdminAuthApiClient());

        // Check that we cannot create an enrollment for a seal user
        try {
            enrollmentPost.setName(Config.randomName());
            enrollmentPost.setUserId(userSeal.getId());
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

        // Try to create an enrollment with user credentials
        try {
            enrollmentPost.setName(Config.randomName());
            enrollmentPost.setUserId(userESign.getId());
            enrollmentPost.setKeyExpiration(System.currentTimeMillis() - 1000);
            enrollmentApi.createEnrollment(enrollmentPost);
            fail("Should not be able to create an enrollment with an already expired key");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_BAD_REQUEST, e.getCode());
        }
    }
}
