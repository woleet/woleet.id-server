package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.APITokenGet;
import io.woleet.idserver.api.model.UserGet;
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

    // True if tests must stop on error
    private static final boolean stopOnError = true;

    @Before
    public void setUp() throws Exception {

        // Start from a clean state
        tearDown();
    }

    @After
    public void tearDown() throws Exception {
        Config.deleteAllTestUsers();
        Config.deleteAllTestAPITokens();
    }

    /**
     * List of all possible authentication methods / user roles
     */
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

    /**
     * Abstract class representing an operation on an API.
     *
     * @param <T> The class of the API
     */
    abstract static class Operation<T> {

        // The tested authentication
        SecurityTest.Authentication authentication;

        // The tested API
        T api = null;

        // The authenticated user (null no NO_AUTH or TOKEN_AUTH)
        UserGet user = null;

        /**
         * Get an instance of the API that need to be tested.
         *
         * @param apiClient The API client to use to initialize the API instance.
         * @return the API
         */
        abstract T getApi(ApiClient apiClient);

        /**
         * Run the operation that need to be tested.
         */
        abstract void run() throws ApiException;

        /**
         * Initialize resources required to run the operation with a given authentication.
         *
         * @param authentication The authentication method / user role to use to run the operation
         */
        void init(Authentication authentication) throws ApiException {
            this.authentication = authentication;
            switch (authentication) {
                case NO_AUTH:
                    api = getApi(Config.getNoAuthApiClient());
                    break;

                case COOKIE_AUTH_USER:
                    user = Config.createTestUser(UserRoleEnum.USER);
                case COOKIE_AUTH_MANAGER:
                    if (user == null)
                        user = Config.createTestUser(UserRoleEnum.MANAGER);
                case COOKIE_AUTH_ADMIN:
                    if (user == null)
                        user = Config.createTestUser(UserRoleEnum.ADMIN);
                    api = getApi(Config.getAuthApiClient(user.getUsername(), "pass"));
                    break;

                case TOKEN_AUTH_USER:
                    user = Config.createTestUser(UserRoleEnum.USER);
                case TOKEN_AUTH_MANAGER:
                    if (user == null)
                        user = Config.createTestUser(UserRoleEnum.MANAGER);
                case TOKEN_AUTH_ADMIN:
                    if (user == null)
                        user = Config.createTestUser(UserRoleEnum.ADMIN);
                    APITokenGet apiTokenGet = Config.createTestApiToken(user.getId());
                    api = getApi(Config.getNoAuthApiClient()
                            .addDefaultHeader("Authorization", "Bearer " + apiTokenGet.getValue()));
                    break;

                case TOKEN_AUTH:
                    apiTokenGet = Config.createTestApiToken(null);
                    api = getApi(Config.getNoAuthApiClient()
                            .addDefaultHeader("Authorization", "Bearer " + apiTokenGet.getValue()));
                    break;

                default:
                    fail("Unexpected authentication");
            }
        }

        /**
         * Cleanup resources required to run the operation.
         */
        void cleanup() {
            user = null;
        }

        /**
         * Run the operation and check that the result of the operation is the one expected.
         * By default, users cannot do any operation, while admins and managers can do all operations.
         * Otherwise, this method must be overloaded.
         */
        void runAndCheck() {
            switch (authentication) {
                case COOKIE_AUTH_MANAGER:
                case COOKIE_AUTH_ADMIN:
                case TOKEN_AUTH_MANAGER:
                case TOKEN_AUTH_ADMIN:
                case TOKEN_AUTH:
                    runAndCheckSuccess();
                    break;
                case COOKIE_AUTH_USER:
                case TOKEN_AUTH_USER:
                    runAndCheckFailure(HttpStatus.SC_FORBIDDEN);
                    break;
                case NO_AUTH:
                    runAndCheckFailure(HttpStatus.SC_UNAUTHORIZED);
                    break;
                default:
                    fail("Unexpected authentication");
            }
        }

        /**
         * Run the operation and check that it succeeded.
         */
        void runAndCheckSuccess() {
            try {
                run();
            }
            catch (ApiException e) {
                fail("Should be able to " + this.getClass().getSimpleName()
                     + " with authentication " + authentication);
            }
        }

        /**
         * Run the operation and check that it failed with a given status
         */
        void runAndCheckFailure(int httpStatus) {
            try {
                run();
                fail("Should not be able to " + this.getClass().getSimpleName()
                     + " with authentication " + authentication);
            }
            catch (ApiException e) {
                assertEquals("Return code should be " + httpStatus, httpStatus, e.getCode());
            }
        }
    }

    @Test
    public void securityTest() throws ApiException {

        // List of all operations to be tested
        Operation[] operations = {
                new UserApiOperations.CreateUser(),
                new UserApiOperations.CreateManager(),
                new UserApiOperations.CreateAdmin(),
                new UserApiOperations.GetUser(),
                new UserApiOperations.GetManager(),
                new UserApiOperations.GetAdmin(),
                new UserApiOperations.UpdateUser(),
                new UserApiOperations.UpdateManager(),
                new UserApiOperations.UpdateAdmin(),
                new UserApiOperations.DeleteUser(),
                new UserApiOperations.DeleteManager(),
                new UserApiOperations.DeleteAdmin(),
                new UserApiOperations.ListUsers(),

                new ApiTokenApiOperations.CreateUserApiToken(),
                new ApiTokenApiOperations.CreateManagerApiToken(),
                new ApiTokenApiOperations.CreateAdminApiToken(),
                new ApiTokenApiOperations.GetUserApiToken(),
                new ApiTokenApiOperations.GetManagerApiToken(),
                new ApiTokenApiOperations.GetAdminApiToken(),
                new ApiTokenApiOperations.UpdateUserApiToken(),
                new ApiTokenApiOperations.UpdateManagerApiToken(),
                new ApiTokenApiOperations.UpdateAdminApiToken(),
                new ApiTokenApiOperations.DeleteUserApiToken(),
                new ApiTokenApiOperations.DeleteManagerApiToken(),
                new ApiTokenApiOperations.DeleteAdminApiToken(),
                new ApiTokenApiOperations.ListApiTokens(),
        };

        // Run all operations with all authentication methods / user roles
        for (Operation operation : operations) {
            for (Authentication authentication : Authentication.values()) {
                logger.info("Testing {} operation with {} authentication", operation.getClass().getSimpleName(),
                        authentication);
                operation.init(authentication);
                try {
                    operation.runAndCheck();
                }
                catch (Throwable t) {
                    if (stopOnError)
                        throw t;
                    else
                        logger.error(t.getMessage());
                }
                operation.cleanup();
            }
        }
    }
}
