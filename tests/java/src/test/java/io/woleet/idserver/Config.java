package io.woleet.idserver;

import io.woleet.idserver.api.AuthenticationApi;
import io.woleet.idserver.api.UserApi;
import io.woleet.idserver.api.model.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.bitcoinj.core.Address;
import org.bitcoinj.core.AddressFormatException;
import org.bitcoinj.core.Base58;
import org.bitcoinj.core.ECKey;

import java.util.List;
import java.util.Random;
import java.util.UUID;

public class Config {

    //private static final Logger logger = LoggerFactory.getLogger(Config.class);

    // True if tests are to be debugged
    private static final boolean debug = false;

    // Initialize data needed to test users
    public static final String TEST_USERS_COMMONNAME_PREFIX = "#tester#-";
    private static final String TEST_USERS_USERNAME_PREFIX = "tester_";

    // Get API base path from the environment
    public static String WOLEET_ID_SERVER_API_BASEPATH = System.getenv("WOLEET_ID_SERVER_API_BASEPATH");

    static {
        if (WOLEET_ID_SERVER_API_BASEPATH == null)
            WOLEET_ID_SERVER_API_BASEPATH = "https://localhost:3000";
    }

    /**
     * Return a new API client with no credential.
     */
    public static ApiClient getNoAuthApiClient() {
        ApiClient apiClient = new ApiClient();
        apiClient.setDebugging(debug);
        apiClient.setVerifyingSsl(false);
        apiClient.setBasePath(WOLEET_ID_SERVER_API_BASEPATH);
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
        StringBuilder cookies = new StringBuilder();
        for (String cookie : apiResponse.getHeaders().get("Set-Cookie"))
            cookies.append(cookie).append(";");
        apiClient.addDefaultHeader("Cookie", cookies.toString());
        return apiClient;
    }

    /**
     * Return a singleton API client with credentials set for the platform admin.
     */
    public static ApiClient getAdminAuthApiClient() throws ApiException {
        String login = System.getenv("WOLEET_ID_SERVER_ADMIN_LOGIN");
        if (login == null)
            login = "admin";
        String password = System.getenv("WOLEET_ID_SERVER_ADMIN_PASSWORD");
        if (password == null)
            password = "pass";
        return getAuthApiClient(login, password);
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
     * Create a new random UTF8 string of a given length.
     */
    public static String randomString(int length) {
        Random random = new Random();
        char[] charSet = {'a', 'z', '0', '9', 'é', 'à', '京', '都'};
        String s = new String();
        while (length-- > 0)
            s += charSet[random.nextInt(charSet.length)];
        return s;
    }

    /**
     * Compute the SHA256 hash of a string.
     *
     * @return the SHA256 hash of the provided string
     */
    public static String sha256(String data) {
        return DigestUtils.sha256Hex(data);
    }

    /**
     * Create a new random user name.
     */
    public static String randomUsername() {
        return Config.TEST_USERS_USERNAME_PREFIX + randomHash().substring(0, 8);
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
     * Create a new random address (for keys).
     */
    public static String randomAddress() {
        byte[] a = new byte[]{(byte) 0x00};
        byte[] b = new byte[24];
        new Random().nextBytes(b);
        byte[] c = new byte[a.length + b.length];
        System.arraycopy(a, 0, c, 0, a.length);
        System.arraycopy(b, 0, c, a.length, b.length);
        return Base58.encode(c);
    }

    /**
     * Get the current timestamp.
     */
    public static Long currentTimestamp() {
        return System.currentTimeMillis();
    }

    /**
     * Delete all users created by the tests.
     */
    public static void deleteAllTestUsers() throws ApiException {
        UserApi userApi = new UserApi(getAdminAuthApiClient());
        List<UserGet> users = userApi.getAllUsers(null, null, null, null, null,
            null, null, null, null, null, null, null);
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
    public static UserGet createTestUser(UserApi userApi, UserRoleEnum userRoleEnum, UserModeEnum userModeEnum)
        throws ApiException {
        UserPost userPost = new UserPost();
        String USERNAME = randomUsername();
        String EMAIL = USERNAME + "@woleet.com";
        userPost.email(EMAIL).username(USERNAME).role(userRoleEnum).status(UserStatusEnum.ACTIVE);
        userPost.password("pass");
        userPost.setMode(userModeEnum);
        FullIdentity fullIdentity = new FullIdentity();
        fullIdentity.commonName(randomCommonName());
        fullIdentity.organization("WOLEET SAS");
        userPost.setCreateDefaultKey(true);
        return userApi.createUser((UserPost) userPost.identity(fullIdentity));
    }

    public static UserGet createTestUser() throws ApiException {
        return createTestUser(new UserApi(getAdminAuthApiClient()), UserRoleEnum.USER, UserModeEnum.SEAL);
    }

    public static UserGet createTestUser(UserRoleEnum userRoleEnum) throws ApiException {
        return createTestUser(new UserApi(getAdminAuthApiClient()), userRoleEnum, UserModeEnum.SEAL);
    }

    public static UserGet createTestUser(UserModeEnum userModeEnum) throws ApiException {
        return createTestUser(new UserApi(getAdminAuthApiClient()), UserRoleEnum.USER, userModeEnum);
    }

    public static UserGet createTestUser(UserRoleEnum userRoleEnum, UserModeEnum userModeEnum) throws ApiException {
        return createTestUser(new UserApi(getAdminAuthApiClient()), userRoleEnum, userModeEnum);
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
        }
        catch (Exception e) {
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
        }
        catch (AddressFormatException e) {
            return false;
        }
    }
}

