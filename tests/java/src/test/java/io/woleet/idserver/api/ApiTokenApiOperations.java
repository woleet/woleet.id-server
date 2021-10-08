package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.Config;
import io.woleet.idserver.api.model.*;
import org.apache.http.HttpStatus;

import java.util.List;

import static org.junit.Assert.*;

public class ApiTokenApiOperations {

    public static abstract class ApiTokenApiOperation extends SecurityTest.Operation {

        ApiTokenApi apiTokenApi = null;
        UserGet userGet = null;

        void init(SecurityTest.Authentication authentication) throws ApiException {
            this.authentication = authentication;
            switch (authentication) {
                case NO_AUTH:
                    apiTokenApi = new ApiTokenApi(Config.getNoAuthApiClient());
                    break;

                case COOKIE_AUTH_USER:
                    userGet = Config.createTestUser(UserRoleEnum.USER);
                case COOKIE_AUTH_MANAGER:
                    if (userGet == null)
                        userGet = Config.createTestUser(UserRoleEnum.MANAGER);
                case COOKIE_AUTH_ADMIN:
                    if (userGet == null)
                        userGet = Config.createTestUser(UserRoleEnum.ADMIN);
                    apiTokenApi = new ApiTokenApi(Config.getAuthApiClient(userGet.getUsername(), "pass"));
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
                    apiTokenApi = new ApiTokenApi(Config.getNoAuthApiClient()
                            .addDefaultHeader("Authorization", "Bearer " + apiTokenGet.getValue()));
                    break;

                case TOKEN_AUTH:
                    apiTokenGet = Config.createTestApiToken(null);
                    apiTokenApi = new ApiTokenApi(Config.getNoAuthApiClient()
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

    static class CreateUserApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            apiTokenApi.createAPIToken(new APITokenPost().name("test-user").userId(userGet.getId()));
        }
    }

    static class CreateManagerApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            apiTokenApi.createAPIToken(new APITokenPost().name("test-manager").userId(userGet.getId()));
        }
    }

    static class CreateAdminApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            apiTokenApi.createAPIToken(new APITokenPost().name("test-admin").userId(userGet.getId()));
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

    static class GetUserApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            apiTokenApi.getAPITokenById(apiTokenGet.getId());
        }
    }

    static class GetManagerApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            apiTokenApi.getAPITokenById(apiTokenGet.getId());
        }
    }

    static class GetAdminApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            apiTokenApi.getAPITokenById(apiTokenGet.getId());
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

    static class UpdateUserApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            APITokenPut apiTokenPut = new APITokenPut();
            apiTokenPut.name("test-updated");
            apiTokenApi.updateAPIToken(apiTokenGet.getId(), apiTokenPut);
        }
    }

    static class UpdateManagerApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            APITokenPut apiTokenPut = new APITokenPut();
            apiTokenPut.name("test-updated");
            apiTokenApi.updateAPIToken(apiTokenGet.getId(), apiTokenPut);
        }
    }

    static class UpdateAdminApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            APITokenPut apiTokenPut = new APITokenPut();
            apiTokenPut.name("test-updated");
            apiTokenApi.updateAPIToken(apiTokenGet.getId(), apiTokenPut);
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

    static class DeleteUserApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.USER, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            apiTokenApi.deleteAPIToken(apiTokenGet.getId());
        }
    }

    static class DeleteManagerApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.MANAGER, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            apiTokenApi.deleteAPIToken(apiTokenGet.getId());
        }
    }

    static class DeleteAdminApiToken extends ApiTokenApiOperation {
        void run() throws ApiException {
            UserGet userGet = Config.createTestUser(UserRoleEnum.ADMIN, UserModeEnum.ESIGN);
            APITokenGet apiTokenGet = Config.createTestApiToken(userGet.getId());
            apiTokenApi.deleteAPIToken(apiTokenGet.getId());
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

    static class ListApiTokens extends ApiTokenApiOperation {
        void run() throws ApiException {

            // Create 1 admin token (with no user)
            Config.createTestApiToken(null);

            // Create 2 tokens for the authenticated user
            if (userGet != null) {
                Config.createTestApiToken(userGet.getId());
                Config.createTestApiToken(userGet.getId());
            }

            // Get all tokens
            List<APITokenGet> apiTokens = apiTokenApi.getAPITokens();

            // Count the number of tokens belonging to the admin or the authenticated user
            int nbAdminTokensFound = 0;
            int nbUserTokensFound = 0;
            for (APITokenGet apiToken : apiTokens) {

                // One more admin token found (with no user)
                if (apiToken.getUserId() == null)
                    nbAdminTokensFound++;

                // One more token found for the authenticated user
                if (userGet != null && userGet.getId().equals(apiToken.getUserId()))
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
