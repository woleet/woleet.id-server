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
    public void managerRoleUserTest() throws ApiException {

        UserApi managerUserApi = new UserApi(Config.getAuthApiClient(manager.getUsername(), "pass"));

        // Try user role creation with manager right
        UserGet userTest = Config.createTestUser(managerUserApi, UserRoleEnum.USER, UserModeEnum.SEAL);
        assertEquals("Role should be user", UserRoleEnum.USER, userTest.getRole());

        // Try manager role creation with manager right
        UserGet managerTest = Config.createTestUser(managerUserApi, UserRoleEnum.MANAGER, UserModeEnum.SEAL);
        assertEquals("Role should be manager", UserRoleEnum.MANAGER, managerTest.getRole());

        // Try admin role creation with manager right
        try {
            Config.createTestUser(managerUserApi, UserRoleEnum.ADMIN, UserModeEnum.SEAL);
            fail("Should not be able to create a admin user with manager right");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }

        // Try to modify user with manager right
        UserPut userPut = new UserPut();
        userPut.username("test");
        userTest = managerUserApi.updateUser(userTest.getId(), userPut);
        assertEquals("Username should be equal", userPut.getUsername(), userTest.getUsername());

        // Try to modify user role with manager right
        userPut.setRole(UserRoleEnum.MANAGER);
        userTest = managerUserApi.updateUser(userTest.getId(), userPut);
        assertEquals("Role should be equal", userPut.getRole(), userTest.getRole());

        // Try to modify manager role with manager right
        userPut.setRole(UserRoleEnum.USER);
        userTest = managerUserApi.updateUser(userTest.getId(), userPut);
        assertEquals("Role should be equal", userPut.getRole(), userTest.getRole());

        // Try to modify admin role with manager right
        try {
            UserGet adminTest = Config.createTestUser(UserRoleEnum.ADMIN);
            managerUserApi.updateUser(adminTest.getId(), userPut);
            fail("Should not be able to modify admin role with manager right");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_UNAUTHORIZED, e.getCode());
        }
    }

    @Test
    public void managerRoleKeyTest() throws ApiException {

        KeyApi managerKeyApi = new KeyApi(Config.getAuthApiClient(manager.getUsername(), "pass"));

        // Try to create a key to a normal user
        UserGet userTest = Config.createTestUser(UserRoleEnum.USER);
        KeyPost keyPost = new KeyPost();
        keyPost.setName(Config.randomName());
        KeyGet keyGetUser = managerKeyApi.createKey(userTest.getId(), keyPost);
        assertEquals("Name should be equal", keyPost.getName(), keyGetUser.getName());

        // Try to create a key to a manager user
        KeyGet keyGetManager = managerKeyApi.createKey(userTest.getId(), keyPost);
        assertEquals("Name should be equal", keyPost.getName(), keyGetManager.getName());

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

        ServerConfigApi managerServerConfigApi = new ServerConfigApi(Config
            .getAuthApiClient(manager.getUsername(), "pass"));

        // Try to modify server configuration with manager right
        try {
            ServerConfig serverConfig = new ServerConfig();
            serverConfig.setIdentityURL("https://localhost:3000/identity");
            managerServerConfigApi.updateServerConfig(serverConfig);
            fail("Should not be able to modify server configuration with manager right");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }
    }

    @Test
    public void managerRoleEnrollmentTest() throws ApiException {

        EnrollmentApi managerEnrollmentApi = new EnrollmentApi(Config.getAuthApiClient(manager.getUsername(), "pass"));

        UserGet userTest = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);

        // Try to create a key enrollment to a normal user
        EnrollmentPost enrollmentPost = new EnrollmentPost();
        enrollmentPost.setName(Config.randomName());
        enrollmentPost.setUserId(userTest.getId());
        enrollmentPost.setTest(true);
        EnrollmentGet enrollmentGetUser = managerEnrollmentApi.createEnrollment(enrollmentPost);
        assertEquals("Name should be equal", enrollmentPost.getName(), enrollmentGetUser.getName());

        // Try to create a key enrollment enrollment to a manager user
        UserGet managerTest = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
        enrollmentPost.setUserId(managerTest.getId());
        EnrollmentGet enrollmentGetManager = managerEnrollmentApi.createEnrollment(enrollmentPost);
        assertEquals("Name should be equal", enrollmentPost.getName(), enrollmentGetManager.getName());

        // Try to create a key enrollment to a admin user
        UserGet adminTest = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
        enrollmentPost.setUserId(adminTest.getId());
        EnrollmentGet enrollmentGetAdmin = managerEnrollmentApi.createEnrollment(enrollmentPost);
        assertEquals("Name should be equal", enrollmentPost.getName(), enrollmentGetAdmin.getName());

        // Try to modify a key enrollment
        EnrollmentPut enrollmentPut = new EnrollmentPut();
        enrollmentPut.setName("test");
        enrollmentGetUser = managerEnrollmentApi.updateEnrollment(enrollmentGetUser.getId(), enrollmentPut);
        assertEquals("Name should be equal", enrollmentPut.getName(), enrollmentGetUser.getName());

        // Try to delete a key enrollment
        managerEnrollmentApi.deleteEnrollment(enrollmentGetUser.getId());
        managerEnrollmentApi.deleteEnrollment(enrollmentGetManager.getId());
        managerEnrollmentApi.deleteEnrollment(enrollmentGetAdmin.getId());
    }

    @Test
    public void managerRoleAPITokenTest() throws ApiException {

        ApiTokenApi managerApiTokenApi = new ApiTokenApi(Config.getAuthApiClient(manager.getUsername(), "pass"));

        UserGet userTest = Config.createTestUser(UserRoleEnum.ADMIN);

        APITokenPost apiTokenPost = new APITokenPost();
        apiTokenPost.setName(Config.randomName());

        // Try to create an admin API token as an manager
        try {
            managerApiTokenApi.createAPIToken(apiTokenPost);
            fail("Should not be able to create an admin API token with manager right");
        }
        catch (ApiException e) {
            assertEquals("Invalid return code", HttpStatus.SC_FORBIDDEN, e.getCode());
        }

        // Try to create an user API token as an manager
        apiTokenPost.setUserId(userTest.getId());
        APITokenGet apiTokenGet = managerApiTokenApi.createAPIToken(apiTokenPost);
        assertEquals("User should be equals", apiTokenPost.getUserId(), apiTokenGet.getUserId());

        // Try to modify an API token as an manager
        APITokenPut apiTokenPut = new APITokenPut();
        apiTokenPut.setName("test");
        apiTokenGet = managerApiTokenApi.updateAPIToken(apiTokenGet.getId(), apiTokenPut);
        assertEquals("Name should be equals", apiTokenPut.getName(), apiTokenGet.getName());

        // Try to delete an API token as an manager
        managerApiTokenApi.deleteAPIToken(apiTokenGet.getId());
    }
}
