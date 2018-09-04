package io.woleet.idserver;

import io.woleet.idserver.api.UserApi;
import io.woleet.idsever.api.model.User;
import io.woleet.idsever.api.model.UserPost;
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
    public static final TestMode testMode = TestMode.LOCAL;

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
    public static ApiClient getUserApiClient(String user, String pass) {
        ApiClient apiClient = getNoAuthApiClient();
        apiClient.setUsername(user);
        apiClient.setPassword(pass);
        apiClient.setVerifyingSsl(false);
        return apiClient;
    }

    /**
     * Return a new API client with credentials set for the platform admin.
     */
    public static ApiClient getAdminApiClient() {
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
    public static ApiClient getTesterApiClient() {
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
     * Return a new non authenticated API client with base path set given the platform to hit.
     */
    public static ApiClient getNoAuthApiClient() {

        // Create new API client
        ApiClient apiClient = new ApiClient();

        // Configure debugging
        apiClient.setDebugging(debug);

        // Set the base path
        return setBasePath(apiClient);
    }

    private static String getBasePath() {
        switch (testMode) {
            case LOCAL:
                return "http://localhost:4220/api/";
            case DEV:
                return "http://dev2.woleet.io:4220/api/";
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
        apiClient.setBasePath(getBasePath());
        return apiClient;
    }

    /**
     * Create a new random SHA256 hash.
     *
     * @return a random SHA256 hash
     */
    public static String randomHash() {
        return DigestUtils.sha256Hex(UUID.randomUUID().toString());
    }

    /**
     * Hash some data.
     *
     * @return the SHA256 hash of the provide data
     */
    public static String hashData(String data) {
        return DigestUtils.sha256Hex(data);
    }

    public static User createTestUser() throws ApiException {
        UserApi userApi = new UserApi(getAdminApiClient());
        UserPost user = new UserPost();
        // TODO
        return userApi.createUser(user);
    }
}

