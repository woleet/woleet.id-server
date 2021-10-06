package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;

import static org.junit.Assert.assertNotNull;

public class UserApiOperations {

    public static abstract class UserApiOperation extends SecurityTest.Operation {

        UserApi userApi = null;
        APITokenGet adminAPITokenGet = null;

        void init(SecurityTest.Authentication authentication) throws ApiException {
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
                                                    .userId(userGet.getId())).getValue()
                            )
                    );
                    break;

                case TOKEN_AUTH:
                    adminAPITokenGet = new ApiTokenApi(Config.getAdminAuthApiClient())
                            .createAPIToken(new APITokenPost().name("test-" + authentication.name()));
                    userApi = new UserApi(
                            Config.getNoAuthApiClient().addDefaultHeader(
                                    "Authorization", "Bearer " + adminAPITokenGet.getValue()
                            )
                    );
                    break;
            }
        }

        void cleanup(SecurityTest.Authentication authentication) throws ApiException {
            switch (authentication) {
                case TOKEN_AUTH:
                    new ApiTokenApi(Config.getAdminAuthApiClient())
                            .deleteAPIToken(adminAPITokenGet.getId());
                    break;
            }
        }

        /**
         * By default, users cannot do any operation, while admins and managers can do all operations.
         * Otherwise, this method must be overloaded.
         */
        @Override
        void check() {
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

    static class CreateUser extends UserApiOperation {
        void run() throws ApiException {
            Config.createTestUser(userApi, UserRoleEnum.USER, UserModeEnum.ESIGN);
        }
    }

    static class CreateManager extends UserApiOperation {
        void run() throws ApiException {
            Config.createTestUser(userApi, UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
        }
    }

    static class CreateAdmin extends UserApiOperation {
        void run() throws ApiException {
            Config.createTestUser(userApi, UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
        }

        @Override
        void check() {
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

    static class GetUser extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            userApi.getUserById(userGet.getId());
        }
    }

    static class GetManager extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            userApi.getUserById(userGet.getId());
        }
    }

    static class GetAdmin extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            userApi.getUserById(userGet.getId());
        }
    }

    static class UpdateUser extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            String USERNAME = Config.randomUsername();
            String EMAIL = USERNAME + "@woleet.com";
            UserPut userPut = new UserPut().username(USERNAME).email(EMAIL);
            userApi.updateUser(userGet.getId(), userPut);
        }
    }

    static class UpdateManager extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            String USERNAME = Config.randomUsername();
            String EMAIL = USERNAME + "@woleet.com";
            UserPut userPut = new UserPut().username(USERNAME).email(EMAIL);
            userApi.updateUser(userGet.getId(), userPut);
        }
    }

    static class UpdateAdmin extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            String USERNAME = Config.randomUsername();
            String EMAIL = USERNAME + "@woleet.com";
            UserPut userPut = new UserPut().username(USERNAME).email(EMAIL);
            userApi.updateUser(userGet.getId(), userPut);
        }

        @Override
        void check() {
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

    static class DeleteUser extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            userApi.deleteUser(userGet.getId());
        }
    }

    static class DeleteManager extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            userApi.deleteUser(userGet.getId());
        }
    }

    static class DeleteAdmin extends UserApiOperation {

        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            userApi.deleteUser(userGet.getId());
        }

        @Override
        void check() {
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

    static class ListUsers extends UserApiOperation {
        void run() throws ApiException {
            assertNotNull(userApi.getUsers(null, null, null, null, null, null, null, null, null, null, null, null, null,
                    null, null, null));
        }
    }
}
