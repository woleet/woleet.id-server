package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.api.model.*;
import org.junit.Ignore;
import org.junit.Test;

import java.util.UUID;

/**
 * API tests for KeyApi
 */
@Ignore
public class KeyApiTest {

    private final KeyApi api = new KeyApi();

    /**
     * Create a new key for a user.
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void createKeyTest() throws ApiException {
        UUID userId = null;
        KeyPost keyPost = null;
        Key response = api.createKey(userId, keyPost);

        // TODO: test validations
    }

    /**
     * Deletes a key
     * <p>
     * This can only be done by an admin.
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void deleteKeyTest() throws ApiException {
        UUID keyId = null;
        Key response = api.deleteKey(keyId);

        // TODO: test validations
    }

    /**
     * Get the mnemonic words associated to a key.
     * <p>
     * Returns a list of mnemonic words used to recover or import a key.
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void exportKeyTest() throws ApiException {
        UUID keyId = null;
        Mnemonics response = api.exportKey(keyId);

        // TODO: test validations
    }

    /**
     * List all keys of a user.
     * <p>
     * Returns a key.
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void getAllUserKeysTest() throws ApiException {
        UUID userId = null;
        Boolean full = null;
        KeyArray response = api.getAllUserKeys(userId, full);

        // TODO: test validations
    }

    /**
     * Get a key by its identifier.
     * <p>
     * Returns a key.
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void getKeyByIdTest() throws ApiException {
        UUID keyId = null;
        Key response = api.getKeyById(keyId);

        // TODO: test validations
    }

    /**
     * Update an existing key.
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void updateKeyTest() throws ApiException {
        UUID keyId = null;
        KeyPut keyPut = null;
        Key response = api.updateKey(keyId, keyPut);

        // TODO: test validations
    }
}
