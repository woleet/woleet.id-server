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

    private KeyApi managerKeyApi;
    private EnrollmentApi managerEnrollmentApi;
    private UserApi managerUserApi;
    private ServerConfigApi managerServerConfigApi;

    @Before
    public void setUp() throws Exception {

        // Start from a clean state
        tearDown();

        // Create test user
        manager = Config.createTestUser(UserRoleEnum.MANAGER);
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();
    }

    @Test
    public void managerRoleUserTest() throws ApiException {

        managerUserApi = new UserApi(Config.getAuthApiClient(manager.getUsername(), "pass"));

        // Try user role creation with manager right
        UserGet userTest = Config.createTestUser(managerUserApi, UserRoleEnum.USER);
        assertEquals("Role Should be user", UserRoleEnum.USER, userTest.getRole());

        // Try manager role creation with manager right
        UserGet managerTest = Config.createTestUser(managerUserApi, UserRoleEnum.MANAGER);
        assertEquals("Role Should be manager", UserRoleEnum.MANAGER, managerTest.getRole());

        // Try admin role creation with manager right
        try {
            Config.createTestUser(managerUserApi, UserRoleEnum.ADMIN);
            fail("Should not be able to create a admin user with manager right");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        UserPut userPut = new UserPut();
        userPut.username("test");

        // Try to modify user with manager right
        userTest = managerUserApi.updateUser(userTest.getId(), userPut);
        assertEquals("Username Should be equal", userPut.getUsername(), userTest.getUsername());

        userPut.setRole(UserRoleEnum.USER);

        // Try to modify role manager right
        try {
            managerUserApi.updateUser(userTest.getId(), userPut);
            fail("Should not be able to modify role with manager right");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        UserGet adminTest = Config.createTestUser(UserRoleEnum.ADMIN);

        // Try to modify admin role with manager right
        try {
            managerUserApi.updateUser(adminTest.getId(), userPut);
            fail("Should not be able to modify admin role with manager right");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }
    }

    @Test
    public void managerRoleKeyTest() throws ApiException {

        managerKeyApi = new KeyApi(Config.getAuthApiClient(manager.getUsername(), "pass"));

        UserGet userTest = Config.createTestUser(UserRoleEnum.USER);

        KeyPost keyPost = new KeyPost();
        keyPost.setName(Config.randomName());

        // Try to create a key to a normal user
        KeyGet keyGetUser = managerKeyApi.createKey(userTest.getId(), keyPost);
        assertEquals("Name should be equal", keyPost.getName(), keyGetUser.getName());

        UserGet managerTest = Config.createTestUser(UserRoleEnum.MANAGER);

        // Try to create a key to a manager user
        KeyGet keyGetManager = managerKeyApi.createKey(userTest.getId(), keyPost);
        assertEquals("Name should be equal", keyPost.getName(), keyGetManager.getName());

        UserGet adminTest = Config.createTestUser(UserRoleEnum.ADMIN);

        // Try to create a key to a admin user
        KeyGet keyGetAdmin = managerKeyApi.createKey(userTest.getId(), keyPost);
        assertEquals("Name should be equal", keyPost.getName(), keyGetAdmin.getName());

        // Try to modify a key
        KeyPut keyPut = new KeyPut();
        keyPut.setName("test");

        keyGetUser = managerKeyApi.updateKey(keyGetUser.getId(), keyPut);
        assertEquals("Name should be equal", keyPut.getName(), keyGetUser.getName());

        // Try to delete a key
        managerKeyApi.deleteKey(keyGetUser.getId());
    }

    @Test
    public void managerRoleServerConfigTest() throws ApiException {
        managerServerConfigApi = new ServerConfigApi(Config.getAuthApiClient(manager.getUsername(), "pass"));

        ServerConfig serverConfig = new ServerConfig();
        serverConfig.setIdentityURL("https://localhost:3000/identity");

        // Try to modify server configuration with manager right
        try {
            managerServerConfigApi.updateServerConfig(serverConfig);
            fail("Should not be able to modify server configuration with manager right");
        } catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void managerRoleEnrollmentTest() throws ApiException {

        managerEnrollmentApi = new EnrollmentApi(Config.getAuthApiClient(manager.getUsername(), "pass"));

        UserGet userTest = Config.createTestUser(UserRoleEnum.USER);

        EnrollmentPost enrollmentPost = new EnrollmentPost();
        enrollmentPost.setName(Config.randomName());
        enrollmentPost.setUserId(userTest.getId());
        enrollmentPost.setTest(true);

        // Try to create a key to a normal user
        EnrollmentGet enrollmentGetUser = managerEnrollmentApi.createEnrollment(enrollmentPost);
        assertEquals("Name should be equal", enrollmentPost.getName(), enrollmentGetUser.getName());

        UserGet managerTest = Config.createTestUser(UserRoleEnum.MANAGER);
        enrollmentPost.setUserId(managerTest.getId());

        // Try to create a key to a manager user
        EnrollmentGet enrollmentGetManager = managerEnrollmentApi.createEnrollment(enrollmentPost);
        assertEquals("Name should be equal", enrollmentPost.getName(), enrollmentGetManager.getName());

        UserGet adminTest = Config.createTestUser(UserRoleEnum.ADMIN);
        enrollmentPost.setUserId(adminTest.getId());

        // Try to create a key to a admin user
        EnrollmentGet enrollmentGetAdmin = managerEnrollmentApi.createEnrollment(enrollmentPost);
        assertEquals("Name should be equal", enrollmentPost.getName(), enrollmentGetAdmin.getName());

        // Try to modify a key
        EnrollmentPut enrollmentPut = new EnrollmentPut();
        enrollmentPut.setName("test");

        enrollmentGetUser = managerEnrollmentApi.updateEnrollment(enrollmentGetUser.getId(), enrollmentPut);
        assertEquals("Name should be equal", enrollmentPut.getName(), enrollmentGetUser.getName());

        // Try to delete a key
        managerEnrollmentApi.deleteEnrollment(enrollmentGetUser.getId());
        managerEnrollmentApi.deleteEnrollment(enrollmentGetManager.getId());
        managerEnrollmentApi.deleteEnrollment(enrollmentGetAdmin.getId());

    }
}
