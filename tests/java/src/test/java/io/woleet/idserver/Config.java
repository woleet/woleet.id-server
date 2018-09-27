package io.woleet.idserver;

import io.woleet.idserver.api.AuthenticationApi;
import io.woleet.idserver.api.UserApi;
import io.woleet.idserver.api.model.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.bitcoinj.core.Address;
import org.bitcoinj.core.AddressFormatException;
import org.bitcoinj.core.Base58;
import org.bitcoinj.core.ECKey;

import java.util.Random;
import java.util.UUID;

public class Config {

    //private static final Logger logger = LoggerFactory.getLogger(Config.class);

    private static ApiClient adminAuthApiClient;

    // List of test mode
    public enum TestMode {
        LOCAL,  // Use the local platform (https://api.woleet.localhost/v1)
        DEV,    // Use the dev platform (https://api-dev.woleet.io/v1/)
        HA,     // Use the HA platform (https://api-ha.woleet.io/v1/)
        PREPROD // Use the preprod platform (https://api-preprod.woleet.io/v1/)
    }

    // Current test mode
    private static final TestMode testMode = Config.getTestMode();

    // True if tests are to be debugged
    private static final boolean debug = false;

    // Initialize data needed to test users
    public static final String TEST_USERS_COMMONNAME_PREFIX = "#tester#-";
    private static final String TEST_USERS_USERNAME_PREFIX = "tester_";

    private static TestMode getTestMode() {
        String value = System.getenv("TESTMODE");
        switch (value != null ? value : "default") {
            case "LOCAL":
                return TestMode.LOCAL;
            case "DEV":
            default:
                return TestMode.DEV;
        }
    }

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
                //return "https://localhost:4220/api";
                return "http://localhost:3000";
            case DEV:
                return "https://dev2.woleet.io:4220/api";
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
     * Create a new random boolean.
     */
    public static boolean randomBoolean() {
        return new Random().nextBoolean();
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

    /**
     * Delete all users created by the tests.
     */
    public static void deleteAllTestUsers() throws ApiException {
        UserApi userApi = new UserApi(getAdminAuthApiClient());
        UserArray users = userApi.getAllUsers(false);
        for (UserGet user : users) {
            if (user.getIdentity().getCommonName().startsWith(TEST_USERS_COMMONNAME_PREFIX))
                userApi.deleteUser(user.getId());
        }
    }

    /**
     * Create a user that can be used for testing.
     *
     * @param userApi User API to use to create the user
     * @return a user
     */
    private static UserGet createTestUser(UserApi userApi) throws ApiException {
        UserPost userPost = new UserPost();
        String USERNAME = randomUsername();
        String EMAIL = USERNAME + "@woleet.com";
        userPost.email(EMAIL).username(USERNAME).role(UserRoleEnum.USER).status(UserStatusEnum.ACTIVE);
        userPost.password("pass");
        FullIdentity fullIdentity = new FullIdentity();
        fullIdentity.commonName(randomCommonName());
        return userApi.createUser((UserPost) userPost.identity(fullIdentity));
    }

    public static UserGet createTestUser() throws ApiException {
        return createTestUser(new UserApi(getAdminAuthApiClient()));
    }

    /**
     * Check if a signature is valid.
     *
     * @param address   bitcoin address
     * @param signature Signature content
     * @param message   Signed message
     * @return true if the signature of the message by the address is correct.
     */
    public static boolean isValidSignature(String address, String signature, String message) {
        try {
            return ECKey.signedMessageToKey(message, signature).toAddress(Address.fromBase58(null, address)
                    .getParameters()).toString().equals(address);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if a bitcoin address is valid.
     *
     * @param address bitcoin address
     * @return true if the address is a valid bitcoin address.
     */
    public static boolean isValidPubKey(String address) {
        try {
            Base58.decodeChecked(address);
            return true;
        } catch (AddressFormatException e) {
            return false;
        }
    }
}

