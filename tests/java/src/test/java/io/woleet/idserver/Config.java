package io.woleet.idserver;

import io.woleet.idserver.api.AuthenticationApi;
import io.woleet.idserver.api.UserApi;
import io.woleet.idsever.api.model.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;

public class Config {

    private static final Logger logger = LoggerFactory.getLogger(Config.class);

    // List of test mode
    public enum TestMode {
        LOCAL,  // Use the local platform (https://api.woleet.localhost/v1)
        DEV,    // Use the dev platform (https://api-dev.woleet.io/v1/)
        HA,     // Use the HA platform (https://api-ha.woleet.io/v1/)
        PREPROD // Use the preprod platform (https://api-preprod.woleet.io/v1/)
    }

    // Current test mode
    public static final TestMode testMode = TestMode.DEV;

    // True if tests are to be debugged
    private static final boolean debug = false;

    // Initialize data needed to test users
    public static final String TEST_USERS_PREFIX = "#tester#-";

    // Initialize data needed to test signatures
    public static final String TEST_HASH = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

    /**
     * Return a new API client with credentials set for a given user.
     *
     * @param user The user name/email for which to create an API client
     * @param pass The user password
     * @return a new API client for the given user
     */
    public static ApiClient getUserApiClient(String user, String pass) throws ApiException {
        ApiClient apiClient = getNoAuthApiClient();
        apiClient.setUsername(user);
        apiClient.setPassword(pass);
        AuthenticationApi authenticationApi = new AuthenticationApi(apiClient);
        ApiResponse<UserInfo> apiResponse = authenticationApi.loginWithHttpInfo();
        String sessionCookie = apiResponse.getHeaders().get("Set-Cookie").get(0).split(";")[0];
        apiClient.addDefaultHeader("Cookie", sessionCookie);
        return apiClient;
    }

    /**
     * Return a new API client with credentials set for the platform admin.
     */
    public static ApiClient getAdminApiClient() throws ApiException {
        switch (testMode) {
            case LOCAL:
                return getUserApiClient("admin", "pass");
            case DEV:
                return getUserApiClient("admin", "pass");
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
     * Return a new API client with credentials set for the tester.
     */
    public static ApiClient getTesterApiClient() throws ApiException {
        switch (testMode) {
            case LOCAL:
                return getUserApiClient("tester", "pass");
            case DEV:
                return getUserApiClient("tester", "pass");
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
     * Return a new configured but non authenticated API client.
     */
    public static ApiClient getNoAuthApiClient() {
        ApiClient apiClient = new ApiClient();
        apiClient.setDebugging(debug);
        apiClient.setVerifyingSsl(false);
        apiClient.setBasePath(getBasePath());
        return apiClient;
    }

    private static String getBasePath() {
        switch (testMode) {
            case LOCAL:
                return "http://localhost:4220/api";
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

    private static ApiClient setBasePath(ApiClient apiClient) {
        return apiClient;
    }

    /**
     * Create a new random SHA256 hash.
     *
     * @return a random SHA256 hash
     */
    public static String randomHash() {
        return DigestUtils.sha256Hex(randomUUID());
    }

    /**
     * Create a new random UUID.
     *
     * @return a random UUID
     */
    public static String randomUUID() {
        return UUID.randomUUID().toString();
    }

    /**
     * Hash some data.
     *
     * @return the SHA256 hash of the provide data
     */
    public static String hashData(String data) {
        return DigestUtils.sha256Hex(data);
    }

    public static void deleteAllTestUsers() throws ApiException {
        UserApi userApi = new UserApi(getAdminApiClient());
        UserArray users = userApi.getAllUsers(true);
        for (User user : users) {
            if (user.getIdentity().getCommonName().startsWith(TEST_USERS_PREFIX))
                userApi.deleteUser(user.getId());
        }
    }

    public static User createTestUser() throws ApiException {
        UserApi userApi = new UserApi(getAdminApiClient());
        UserPost userPost = new UserPost();
        FullIdentity fullIdentity = new FullIdentity();
        fullIdentity.commonName(TEST_USERS_PREFIX + UUID.randomUUID().toString());
        return userApi.createUser((UserPost) userPost.identity(fullIdentity));
    }
}

