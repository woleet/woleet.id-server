package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.api.model.SignatureResult;
import org.junit.Ignore;
import org.junit.Test;

import java.util.UUID;

/**
 * API tests for SignatureApi
 */
@Ignore
public class SignatureApiTest {

    private final SignatureApi api = new SignatureApi();

    /**
     * Sign some data using a user key.
     * <p>
     * Use this endpoint to sign some data using one of the keys of a given user. &lt;br&gt;Compute the SHA256 hash of the data to sign (client side) and provide it in the &#x60;hashToSign&#x60; parameter. &lt;br&gt;Specify the user using either the &#x60;userId&#x60;, &#x60;customUserId&#x60; or the &#x60;pubKey&#x60; parameter. &lt;br&gt;The signature produced is the signature of the hash using the referred key or using the user&#39;s default key. &lt;br&gt;This endpoint is protected using an API token. It is recommended not to expose it publicly.
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void getSignatureTest() throws ApiException {
        String hashToSign = null;
        UUID userId = null;
        String customUserId = null;
        String pubKey = null;
        SignatureResult response = api.getSignature(hashToSign, userId, customUserId, pubKey);

        // TODO: test validations
    }
}
