package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;

public class KeyApiOperations {

    public static abstract class KeyApiOperation extends SecurityTest.Operation<KeyApi> {
        @Override
        KeyApi getApi(ApiClient apiClient) {
            return new KeyApi(apiClient);
        }
    }

    static class CreateUserKey extends KeyApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            api.createKey(userGet.getId(), (KeyPost) new KeyPost().name("test-user"));
        }
    }

    static class CreateManagerKey extends KeyApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            api.createKey(userGet.getId(), (KeyPost) new KeyPost().name("test-manager"));
        }
    }

    static class CreateAdminKey extends KeyApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            api.createKey(userGet.getId(), (KeyPost) new KeyPost().name("test-admin"));
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

    static class GetUserKey extends KeyApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            KeyGet KeyGet = Config.createTestKey(userGet.getId());
            api.getKeyById(KeyGet.getId());
        }
    }

    static class GetManagerKey extends KeyApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            KeyGet KeyGet = Config.createTestKey(userGet.getId());
            api.getKeyById(KeyGet.getId());
        }
    }

    static class GetAdminKey extends KeyApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            KeyGet KeyGet = Config.createTestKey(userGet.getId());
            api.getKeyById(KeyGet.getId());
        }
    }

    static class UpdateUserKey extends KeyApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            KeyGet KeyGet = Config.createTestKey(userGet.getId());
            KeyPut KeyPut = new KeyPut();
            KeyPut.name("test-updated");
            api.updateKey(KeyGet.getId(), KeyPut);
        }
    }

    static class UpdateManagerKey extends KeyApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            KeyGet KeyGet = Config.createTestKey(userGet.getId());
            KeyPut KeyPut = new KeyPut();
            KeyPut.name("test-updated");
            api.updateKey(KeyGet.getId(), KeyPut);
        }
    }

    static class UpdateAdminKey extends KeyApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            KeyGet KeyGet = Config.createTestKey(userGet.getId());
            KeyPut KeyPut = new KeyPut();
            KeyPut.name("test-updated");
            api.updateKey(KeyGet.getId(), KeyPut);
        }
    }

    static class DeleteUserKey extends KeyApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            KeyGet KeyGet = Config.createTestKey(userGet.getId());
            api.deleteKey(KeyGet.getId());
        }
    }

    static class DeleteManagerKey extends KeyApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            KeyGet KeyGet = Config.createTestKey(userGet.getId());
            api.deleteKey(KeyGet.getId());
        }
    }

    static class DeleteAdminKey extends KeyApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            KeyGet KeyGet = Config.createTestKey(userGet.getId());
            api.deleteKey(KeyGet.getId());
        }
    }

    static class ListUserKeys extends KeyApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            api.getUserKeys(userGet.getId());
        }
    }

    static class ListManagerKeys extends KeyApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            api.getUserKeys(userGet.getId());
        }
    }

    static class ListAdminKeys extends KeyApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            api.getUserKeys(userGet.getId());
        }
    }
}
