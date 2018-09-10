package io.woleet.idserver;

import io.woleet.idserver.api.ApiTokenApi;
import io.woleet.idserver.api.AuthenticationApi;
import io.woleet.idserver.api.UserApi;
import io.woleet.idserver.api.model.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;

public class Config {

    private static final Logger logger = LoggerFactory.getLogger(Config.class);

    private static ApiClient adminAuthApiClient;

    // List of test mode
    public enum TestMode {
        LOCAL,  // Use the local platform (https://api.woleet.localhost/v1)
        DEV,    // Use the dev platform (https://api-dev.woleet.io/v1/)
        HA,     // Use the HA platform (https://api-ha.woleet.io/v1/)
        PREPROD // Use the preprod platform (https://api-preprod.woleet.io/v1/)
    }

    // Current test mode
    private static final TestMode testMode = TestMode.DEV;

    // True if tests are to be debugged
    private static final boolean debug = true;

    // Initialize data needed to test users
    public static final String TEST_USERS_COMMONNAME_PREFIX = "#tester#-";
    public static final String TEST_USERS_USERNAME_PREFIX = "tester_";
    public static final String TEST_APITOKENS_NAME_PREFIX = "#tester#-";

    /**
     * Return a new API client with no credential.
     */
    public static ApiClient getNoAuthApiClient() {
        ApiClient apiClient = new ApiClient();
        apiClient.setDebugging(debug);
        apiClient.setVerifyingSsl(false);
        apiClient.setBasePath(getBasePath());
        return apiClient;
    }

    /**
     * Return a new API client with credentials set for a specific user.
     *
     * @param user The user name/email for which to create an API client
     * @param pass The user password
     * @return a new API client for the given user
     */
    public static ApiClient getAuthApiClient(String user, String pass) throws ApiException {

        // Get a new authenticated API client
        ApiClient apiClient = getNoAuthApiClient();
        apiClient.setUsername(user);
        apiClient.setPassword(pass);

        // Login and set the session cookie for future calls
        AuthenticationApi authenticationApi = new AuthenticationApi(apiClient);
        ApiResponse<UserInfo> apiResponse = authenticationApi.loginWithHttpInfo();
        String sessionCookie = apiResponse.getHeaders().get("Set-Cookie").get(0).split(";")[0];
        apiClient.addDefaultHeader("Cookie", sessionCookie);
        return apiClient;
    }

    /**
     * Return a singleton API client with credentials set for the platform admin.
     */
    public static ApiClient getAdminAuthApiClient() throws ApiException {
        if (adminAuthApiClient == null) {
            switch (testMode) {
                case LOCAL:
                    adminAuthApiClient = getAuthApiClient("admin", "pass");
                    break;
                case DEV:
                    adminAuthApiClient = getAuthApiClient("admin", "pass");
                    break;
                case HA:
                    assert false;
                case PREPROD:
                    assert false;
                default:
                    assert false;
                    return null;
            }
        }
        return adminAuthApiClient;
    }

    private static String getBasePath() {
        switch (testMode) {
            case LOCAL:
                return "http:/localhost:3000";
            case DEV:
                return "http://dev2.woleet.io:4220/api";
            case HA:
                assert false;
            case PREPROD:
                assert false;
            default:
                assert false;
                return null;
        }
    }

    /**
     * Create a new random SHA256 hash.
     */
    public static String randomHash() {
        return DigestUtils.sha256Hex(randomUUID().toString());
    }

    /**
     * Create a new random UUID.
     */
    public static UUID randomUUID() {
        return UUID.randomUUID();
    }

    /**
     * Create a new random string of a given length.
     */
    public static String randomString(int length) {
        return randomHash().substring(0, length - 1);
    }

    /**
     * Create a new random user name.
     */
    public static String randomUsername() {
        return Config.TEST_USERS_USERNAME_PREFIX + randomHash().substring(0, 9);
    }

    /**
     * Create a new random common name.
     */
    public static String randomCommonName() {
        return Config.TEST_USERS_COMMONNAME_PREFIX + randomString(32);
    }

    /**
     * Create a new random name (for token and keys).
     */
    public static String randomName() {
        return Config.TEST_USERS_COMMONNAME_PREFIX + randomString(32);
    }

    /*
     * Test users
     */

    public static void deleteAllTestUsers() throws ApiException {
        UserApi userApi = new UserApi(getAdminAuthApiClient());
        UserArray users = userApi.getAllUsers(false);
        for (User user : users) {
            if (user.getIdentity().getCommonName().startsWith(TEST_USERS_COMMONNAME_PREFIX))
                userApi.deleteUser(user.getId());
        }
    }

    public static User createTestUser(UserApi userApi) throws ApiException {
        UserPost userPost = new UserPost();
        String USERNAME = randomUsername();
        String EMAIL = USERNAME + "@woleet.com";
        userPost.email(EMAIL).username(USERNAME).role(UserRoleEnum.USER).status(UserStatusEnum.ACTIVE);
        userPost.password("pass");
        FullIdentity fullIdentity = new FullIdentity();
        fullIdentity.commonName(randomCommonName());
        return userApi.createUser((UserPost) userPost.identity(fullIdentity));
    }

    public static User createTestUser() throws ApiException {
        return createTestUser(new UserApi(getAdminAuthApiClient()));
    }

    /*
     * Test API tokens
     */

    public static void deleteAllTestAPITokens() throws ApiException {
        ApiTokenApi apiTokenApi = new ApiTokenApi(getAdminAuthApiClient());
        APITokenArray apiTokens = apiTokenApi.getAllAPITokens(false);
        for (APIToken apiToken : apiTokens) {
            if (apiToken.getName().startsWith(TEST_APITOKENS_NAME_PREFIX))
                apiTokenApi.deleteAPIToken(apiToken.getId());
        }
    }

    public static APIToken createTestAPIToken(ApiTokenApi apiTokenApi) throws ApiException {
        APITokenPost apiTokenPost = new APITokenPost();
        String NAME = randomName();
        apiTokenPost.name(NAME).status(APITokenStatusEnum.ACTIVE);
        return apiTokenApi.createAPIToken((APITokenPost) apiTokenPost);
    }

    public static APIToken createTestAPIToken() throws ApiException {
        return createTestAPIToken(new ApiTokenApi(getAdminAuthApiClient()));
    }
}

