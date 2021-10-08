package io.woleet.idserver.api;

import io.woleet.idserver.ApiClient;
import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class ApiTokenApiOperations {

    public static abstract class ApiTokenApiOperation extends SecurityTest.Operation<ApiTokenApi> {
        @Override
        ApiTokenApi getApi(ApiClient apiClient) {
            return new ApiTokenApi(apiClient);
        }
    }

    static class CreateUserApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            api.createAPIToken(new APITokenPost().name("test-user").userId(userGet.getId()));
        }
    }

    static class CreateManagerApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            api.createAPIToken(new APITokenPost().name("test-manager").userId(userGet.getId()));
        }
    }

    static class CreateAdminApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            api.createAPIToken(new APITokenPost().name("test-admin").userId(userGet.getId()));
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

    static class GetUserApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            api.getAPITokenById(apiTokenGet.getId());
        }
    }

    static class GetManagerApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            api.getAPITokenById(apiTokenGet.getId());
        }
    }

    static class GetAdminApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            api.getAPITokenById(apiTokenGet.getId());
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

    static class UpdateUserApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            APITokenPut apiTokenPut = new APITokenPut();
            apiTokenPut.name("test-updated");
            api.updateAPIToken(apiTokenGet.getId(), apiTokenPut);
        }
    }

    static class UpdateManagerApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            APITokenPut apiTokenPut = new APITokenPut();
            apiTokenPut.name("test-updated");
            api.updateAPIToken(apiTokenGet.getId(), apiTokenPut);
        }
    }

    static class UpdateAdminApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            APITokenPut apiTokenPut = new APITokenPut();
            apiTokenPut.name("test-updated");
            api.updateAPIToken(apiTokenGet.getId(), apiTokenPut);
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

    static class DeleteUserApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            api.deleteAPIToken(apiTokenGet.getId());
        }
    }

    static class DeleteManagerApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            api.deleteAPIToken(apiTokenGet.getId());
        }
    }

    static class DeleteAdminApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            api.deleteAPIToken(apiTokenGet.getId());
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

    static class ListApiTokens extends ApiTokenApiOperation {
        void run() throws ApiException {

            // Create 1 admin token (with no user)
            Config.createTestApiToken(null);

            // Create 2 tokens for the authenticated user
            if (user != null) {
                Config.createTestApiToken(user.getId());
                Config.createTestApiToken(user.getId());
            }

            // Get all tokens
            List<APITokenGet> apiTokens = api.getAPITokens();

            // Count the number of tokens belonging to the admin or the authenticated user
            int nbAdminTokensFound = 0;
            int nbUserTokensFound = 0;
            for (APITokenGet apiToken : apiTokens) {

                // One more admin token found (with no user)
                if (apiToken.getUserId() == null)
                    nbAdminTokensFound++;

                // One more token found for the authenticated user
                if (user != null && user.getId().equals(apiToken.getUserId()))
                    nbUserTokensFound++;
            }

            // For a manager, the list of tokens should not contain admin tokens
            if (authentication == SecurityTest.Authentication.COOKIE_AUTH_MANAGER) {
                assertEquals(2, nbUserTokensFound);
                assertTrue(apiTokens.size() >= 2);
            }
            if (authentication == SecurityTest.Authentication.TOKEN_AUTH_MANAGER) {
                assertEquals(3, nbUserTokensFound);
                assertTrue(apiTokens.size() >= 3);
            }

            // For an admin, the list of tokens should contain all tokens
            if (authentication == SecurityTest.Authentication.COOKIE_AUTH_ADMIN) {
                assertEquals(2, nbUserTokensFound);
                assertTrue(nbAdminTokensFound >= 1);
                assertTrue(apiTokens.size() >= 3);
            }
            if (authentication == SecurityTest.Authentication.TOKEN_AUTH_ADMIN) {
                assertEquals(3, nbUserTokensFound);
                assertTrue(nbAdminTokensFound >= 1);
                assertTrue(apiTokens.size() >= 4);
            }
            if (authentication == SecurityTest.Authentication.TOKEN_AUTH) {
                assertEquals(0, nbUserTokensFound);
                assertTrue(nbAdminTokensFound >= 2);
                assertTrue(apiTokens.size() >= 2);
            }
        }
    }
}
