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

public class ManagerTest {

    private UserGet manager;

    @Before
    public void setUp() throws Exception {

        // Start from a clean state
        tearDown();

        // Create a test manager
        manager = Config.createTestUser(UserRoleEnum.MANAGER);
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();
    }

    @Test
    public void managerRoleKeyTest() throws ApiException {

        KeyApi managerAuthKeyApi = new KeyApi(Config.getAuthApiClient(manager.getUsername(), "pass"));
        UserApi managerAuthUserApi = new UserApi(Config.getAuthApiClient(manager.getUsername(), "pass"));

        KeyPost keyPost = new KeyPost();
        keyPost.setName(Config.randomName());

        // Try to create a user key with manager rights
        UserGet userTest = Config.createTestUser(UserRoleEnum.USER);
        KeyGet keyGetUser = managerAuthKeyApi.createKey(userTest.getId(), keyPost);
        assertEquals(keyPost.getName(), keyGetUser.getName());

        // Try to create a manager key with manager rights
        UserGet managerTest = Config.createTestUser(managerAuthUserApi, UserRoleEnum.MANAGER, UserModeEnum.SEAL);
        KeyGet keyGetManager = managerAuthKeyApi.createKey(managerTest.getId(), keyPost);
        assertEquals(keyPost.getName(), keyGetManager.getName());

        // Try to create an admin key with manager rights
        try {
            UserGet adminTest = Config.createTestUser(UserRoleEnum.ADMIN);
            managerAuthKeyApi.createKey(adminTest.getId(), keyPost);
            fail("Should not be able to create a key for an admin with manager rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to modify a user key with manager rights
        KeyPut keyPut = new KeyPut();
        keyPut.setName("test");
        keyGetUser = managerAuthKeyApi.updateKey(keyGetUser.getId(), keyPut);
        assertEquals(keyPut.getName(), keyGetUser.getName());

        // Try to modify a manager key with manager rights
        keyGetManager = managerAuthKeyApi.updateKey(keyGetManager.getId(), keyPut);
        assertEquals(keyPut.getName(), keyGetManager.getName());

        // Try to modify an admin key with manager rights
        try {
            UserGet adminTest = Config.createTestUser(UserRoleEnum.ADMIN);
            managerAuthKeyApi.createKey(adminTest.getId(), keyPost);
            fail("Should not be able to create a key for an admin with manager rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }


        // Try to delete a key
        managerAuthKeyApi.deleteKey(keyGetUser.getId());
    }

    @Test
    public void managerRoleServerConfigTest() throws ApiException {

        ServerConfigApi managerAuthServerConfigApi =
                new ServerConfigApi(Config.getAuthApiClient(manager.getUsername(), "pass"));

        // Try to modify server configuration with manager rights
        try {
            ServerConfig serverConfig = new ServerConfig();
            serverConfig.setIdentityURL("https://localhost:3001/identity");
            managerAuthServerConfigApi.updateServerConfig(serverConfig);
            fail("Should not be able to modify server configuration with manager rights");
        }
        catch (ApiException e) {
            assertEquals(HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void managerRoleEnrollmentTest() throws ApiException {

        EnrollmentApi managerAuthEnrollmentApi =
                new EnrollmentApi(Config.getAuthApiClient(manager.getUsername(), "pass"));

        EnrollmentPost enrollmentPost = new EnrollmentPost();
        enrollmentPost.setName(Config.randomName());
        enrollmentPost.setTest(true);

        // Try to create a user key enrollment with manager rights
        UserGet userTest = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
        enrollmentPost.setUserId(userTest.getId());
        EnrollmentGet enrollmentGetUser = managerAuthEnrollmentApi.createEnrollment(enrollmentPost);
        assertEquals(enrollmentPost.getName(), enrollmentGetUser.getName());

        // Try to create a manager key enrollment with manager rights
        UserGet managerTest = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
        enrollmentPost.setUserId(managerTest.getId());
        EnrollmentGet enrollmentGetManager = managerAuthEnrollmentApi.createEnrollment(enrollmentPost);
        assertEquals(enrollmentPost.getName(), enrollmentGetManager.getName());

        // Try to create an admin key enrollment with manager rights
        UserGet adminTest = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
        enrollmentPost.setUserId(adminTest.getId());
        EnrollmentGet enrollmentGetAdmin = managerAuthEnrollmentApi.createEnrollment(enrollmentPost);
        assertEquals(enrollmentPost.getName(), enrollmentGetAdmin.getName());

        // Try to modify a key enrollment with manager rights
        EnrollmentPut enrollmentPut = new EnrollmentPut();
        enrollmentPut.setName("test");
        enrollmentGetUser = managerAuthEnrollmentApi.updateEnrollment(enrollmentGetUser.getId(), enrollmentPut);
        assertEquals(enrollmentPut.getName(), enrollmentGetUser.getName());
        enrollmentGetManager = managerAuthEnrollmentApi.updateEnrollment(enrollmentGetManager.getId(), enrollmentPut);
        assertEquals(enrollmentPut.getName(), enrollmentGetManager.getName());
        enrollmentGetAdmin = managerAuthEnrollmentApi.updateEnrollment(enrollmentGetAdmin.getId(), enrollmentPut);
        assertEquals(enrollmentPut.getName(), enrollmentGetAdmin.getName());

        // Try to delete a key enrollment with manager rights
        managerAuthEnrollmentApi.deleteEnrollment(enrollmentGetUser.getId());
        managerAuthEnrollmentApi.deleteEnrollment(enrollmentGetManager.getId());
        managerAuthEnrollmentApi.deleteEnrollment(enrollmentGetAdmin.getId());
    }
}
