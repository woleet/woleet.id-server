package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.fail;

public class UserApiOperations {

    public static abstract class UserApiOperation extends SecurityTest.Operation {

        UserApi userApi = null;
        UserGet userGet = null;

        void init(SecurityTest.Authentication authentication) throws ApiException {
            this.authentication = authentication;
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
                    APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
                    userApi = new UserApi(Config.getNoAuthApiClient()
                            .addDefaultHeader("Authorization", "Bearer " + apiTokenGet.getValue()));
                    break;

                case TOKEN_AUTH:
                    apiTokenGet = Config.createTestApiToken(null);
                    userApi = new UserApi(Config.getNoAuthApiClient()
                            .addDefaultHeader("Authorization", "Bearer " + apiTokenGet.getValue()));
                    break;

                default:
                    fail("Unexpected authentication");
            }
        }

        void cleanup() {
            userGet = null;
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
