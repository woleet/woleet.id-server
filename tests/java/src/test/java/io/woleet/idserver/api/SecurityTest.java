package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.APITokenPost;
import io.woleet.idserver.api.model.UserGet;
import io.woleet.idserver.api.model.UserModeEnum;
import io.woleet.idserver.api.model.UserRoleEnum;
import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class SecurityTest {

    private static final Logger logger = LoggerFactory.getLogger(SecurityTest.class);

    @Before
    public void setUp() throws Exception {

        // Start from a clean state
        tearDown();
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();
    }

    enum Authentication {
        NO_AUTH,

        COOKIE_AUTH_USER,
        COOKIE_AUTH_MANAGER,
        COOKIE_AUTH_ADMIN,

        TOKEN_AUTH_USER,
        TOKEN_AUTH_MANAGER,
        TOKEN_AUTH_ADMIN,

        TOKEN_AUTH
    }

    abstract static class Operation {
        abstract void init(Authentication authentication) throws ApiException;

        abstract void run();
    }

    static abstract class UserApiOperation extends Operation {

        Authentication authentication;
        UserApi userApi = null;

        void init(Authentication authentication) throws ApiException {
            this.authentication = authentication;
            UserGet userGet = null;
            switch (authentication) {
                case NO_AUTH:
                    userApi = new UserApi(Config.getNoAuthApiClient());
                    break;

                case COOKIE_AUTH_USER:
                    userGet = Config.createTestUser(UserRoleEnum.USER);
                case COOKIE_AUTH_MANAGER:
                    if (userGet == null)
                        userGet = Config.createTestUser(UserRoleEnum.MANAGER);
                case COOKIE_AUTH_ADMIN:
                    if (userGet == null)
                        userGet = Config.createTestUser(UserRoleEnum.ADMIN);
                    userApi = new UserApi(Config.getAuthApiClient(userGet.getUsername(), "pass"));
                    break;

                case TOKEN_AUTH_USER:
                    userGet = Config.createTestUser(UserRoleEnum.USER);
                case TOKEN_AUTH_MANAGER:
                    if (userGet == null)
                        userGet = Config.createTestUser(UserRoleEnum.MANAGER);
                case TOKEN_AUTH_ADMIN:
                    if (userGet == null)
                        userGet = Config.createTestUser(UserRoleEnum.ADMIN);
                    userApi = new UserApi(
                            Config.getNoAuthApiClient().addDefaultHeader(
                                    "Authorization",
                                    "Bearer " + new ApiTokenApi(Config.getAuthApiClient(userGet.getUsername(), "pass"))
                                            .createAPIToken(new APITokenPost()
                                                    .name("test-" + authentication.name())
                                                    .userId(userGet.getId())
                                            )
                                            .getValue()
                            )
                    );
                    break;

                case TOKEN_AUTH:
                    userApi = new UserApi(
                            Config.getNoAuthApiClient().addDefaultHeader(
                                    "Authorization",
                                    "Bearer " + new ApiTokenApi(Config.getAdminAuthApiClient())
                                            .createAPIToken(new APITokenPost().name("test-" + authentication.name()))
                                            .getValue()
                            )
                    );
                    break;
            }
        }

        abstract void operation() throws ApiException;

        void shouldSucceed() {
            try {
                operation();
            }
            catch (ApiException e) {
                fail("Should be able to " + this.getClass().getSimpleName()
                     + " with authentication " + authentication);
            }
        }

        void shouldFailWith(int httpStatus) {
            try {
                operation();
                fail("Should not be able to " + this.getClass().getSimpleName()
                     + " with authentication " + authentication);
            }
            catch (ApiException e) {
                assertEquals("Return code should be " + httpStatus, httpStatus, e.getCode());
            }
        }
    }

    static class CreateUser extends UserApiOperation {

        void operation() throws ApiException {
            Config.createTestUser(userApi, UserRoleEnum.USER, UserModeEnum.ESIGN);
        }

        @Override
        void run() {
            switch (authentication) {
                case COOKIE_AUTH_MANAGER:
                case COOKIE_AUTH_ADMIN:
                case TOKEN_AUTH_MANAGER:
                case TOKEN_AUTH_ADMIN:
                case TOKEN_AUTH:
                    shouldSucceed();
                    break;
                case NO_AUTH:
                    shouldFailWith(HttpStatus.SC_UNAUTHORIZED);
                    break;
                default:
                    shouldFailWith(HttpStatus.SC_FORBIDDEN);
            }
        }
    }

    static class CreateManager extends UserApiOperation {

        void operation() throws ApiException {
            Config.createTestUser(userApi, UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
        }

        @Override
        void run() {
            switch (authentication) {
                case COOKIE_AUTH_MANAGER:
                case COOKIE_AUTH_ADMIN:
                case TOKEN_AUTH_MANAGER:
                case TOKEN_AUTH_ADMIN:
                case TOKEN_AUTH:
                    shouldSucceed();
                    break;
                case NO_AUTH:
                    shouldFailWith(HttpStatus.SC_UNAUTHORIZED);
                    break;
                default:
                    shouldFailWith(HttpStatus.SC_FORBIDDEN);
            }
        }
    }

    static class CreateAdmin extends UserApiOperation {

        void operation() throws ApiException {
            Config.createTestUser(userApi, UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
        }

        @Override
        void run() {
            switch (authentication) {
                case COOKIE_AUTH_ADMIN:
                case TOKEN_AUTH_ADMIN:
                case TOKEN_AUTH:
                    shouldSucceed();
                    break;
                case NO_AUTH:
                    shouldFailWith(HttpStatus.SC_UNAUTHORIZED);
                    break;
                default:
                    shouldFailWith(HttpStatus.SC_FORBIDDEN);
            }
        }
    }

    @Test
    public void securityTest() throws ApiException {

        Operation[] operations = {
                new CreateAdmin(),
                new CreateManager(),
                new CreateUser(),
        };

        for (Operation operation : operations) {
            for (Authentication authentication : Authentication.values()) {
                logger.info("Testing {} operation with {} authentication", operation.getClass().getSimpleName(),
                        authentication);
                operation.init(authentication);
                operation.run();
            }
        }
    }
}
