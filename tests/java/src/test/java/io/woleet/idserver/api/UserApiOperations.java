package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.UserGet;
import io.woleet.idserver.api.model.UserModeEnum;
import io.woleet.idserver.api.model.UserPut;
import io.woleet.idserver.api.model.UserRoleEnum;
import org.apache.http.HttpStatus;

import static org.junit.Assert.assertNotNull;

public class UserApiOperations {

    public static abstract class UserApiOperation extends SecurityTest.Operation<UserApi> {
        @Override
        UserApi getApi(ApiClient apiClient) {
            return new UserApi(apiClient);
        }
    }

    static class CreateUser extends UserApiOperation {
        void run() throws ApiException {
            Config.createTestUser(api, UserRoleEnum.USER, UserModeEnum.ESIGN);
        }
    }

    static class CreateManager extends UserApiOperation {
        void run() throws ApiException {
            Config.createTestUser(api, UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
        }
    }

    static class CreateAdmin extends UserApiOperation {
        void run() throws ApiException {
            Config.createTestUser(api, UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
        }

        @Override
        void runAndCheck() {
            switch (authentication) {
                case COOKIE_AUTH_ADMIN:
                case TOKEN_AUTH_ADMIN:
                case TOKEN_AUTH:
                    runAndCheckSuccess();
                    break;
                case NO_AUTH:
                    runAndCheckFailure(HttpStatus.SC_UNAUTHORIZED);
                    break;
                default:
                    runAndCheckFailure(HttpStatus.SC_FORBIDDEN);
            }
        }
    }

    static class GetUser extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            api.getUserById(userGet.getId());
        }
    }

    static class GetManager extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            api.getUserById(userGet.getId());
        }
    }

    static class GetAdmin extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            api.getUserById(userGet.getId());
        }
    }

    static class UpdateUser extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            String USERNAME = Config.randomUsername();
            String EMAIL = USERNAME + "@woleet.com";
            UserPut userPut = new UserPut().username(USERNAME).email(EMAIL);
            api.updateUser(userGet.getId(), userPut);
        }
    }

    static class UpdateManager extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            String USERNAME = Config.randomUsername();
            String EMAIL = USERNAME + "@woleet.com";
            UserPut userPut = new UserPut().username(USERNAME).email(EMAIL);
            api.updateUser(userGet.getId(), userPut);
        }
    }

    static class UpdateAdmin extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            String USERNAME = Config.randomUsername();
            String EMAIL = USERNAME + "@woleet.com";
            UserPut userPut = new UserPut().username(USERNAME).email(EMAIL);
            api.updateUser(userGet.getId(), userPut);
        }

        @Override
        void runAndCheck() {
            switch (authentication) {
                case COOKIE_AUTH_ADMIN:
                case TOKEN_AUTH_ADMIN:
                case TOKEN_AUTH:
                    runAndCheckSuccess();
                    break;
                case NO_AUTH:
                    runAndCheckFailure(HttpStatus.SC_UNAUTHORIZED);
                    break;
                default:
                    runAndCheckFailure(HttpStatus.SC_FORBIDDEN);
            }
        }
    }

    static class DeleteUser extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            api.deleteUser(userGet.getId());
        }
    }

    static class DeleteManager extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            api.deleteUser(userGet.getId());
        }
    }

    static class DeleteAdmin extends UserApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            api.deleteUser(userGet.getId());
        }

        @Override
        void runAndCheck() {
            switch (authentication) {
                case COOKIE_AUTH_ADMIN:
                case TOKEN_AUTH_ADMIN:
                case TOKEN_AUTH:
                    runAndCheckSuccess();
                    break;
                case NO_AUTH:
                    runAndCheckFailure(HttpStatus.SC_UNAUTHORIZED);
                    break;
                default:
                    runAndCheckFailure(HttpStatus.SC_FORBIDDEN);
            }
        }
    }

    static class ListUsers extends UserApiOperation {
        void run() throws ApiException {
            assertNotNull(api.getUsers(null, null, null, null, null, null, null, null, null, null, null, null, null,
                    null, null, null));
        }
    }
}
