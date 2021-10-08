package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
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

        SecurityTest.Authentication authentication;

        abstract void init(Authentication authentication) throws ApiException;

        abstract void cleanup() throws ApiException;

        /**
         * By default, users cannot do any operation, while admins and managers can do all operations.
         * Otherwise, this method must be overloaded.
         */
        void check() {
            switch (authentication) {
                case COOKIE_AUTH_MANAGER:
                case COOKIE_AUTH_ADMIN:
                case TOKEN_AUTH_MANAGER:
                case TOKEN_AUTH_ADMIN:
                case TOKEN_AUTH:
                    shouldSucceed();
                    break;
                case COOKIE_AUTH_USER:
                case TOKEN_AUTH_USER:
                    shouldFailWith(HttpStatus.SC_FORBIDDEN);
                    break;
                case NO_AUTH:
                    shouldFailWith(HttpStatus.SC_UNAUTHORIZED);
                    break;
                default:
                    fail("Unexpected authentication");
            }
        }

        abstract void run() throws ApiException;

        void shouldSucceed() {
            try {
                run();
            }
            catch (ApiException e) {
                fail("Should be able to " + this.getClass().getSimpleName()
                     + " with authentication " + authentication);
            }
        }

        void shouldFailWith(int httpStatus) {
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

        for (Operation operation : operations) {
            for (Authentication authentication : Authentication.values()) {
                logger.info("Testing {} operation with {} authentication", operation.getClass().getSimpleName(),
                        authentication);
                operation.init(authentication);
                try {
                    operation.check();
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
