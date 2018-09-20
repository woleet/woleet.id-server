package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.api.model.ServerConfig;
import org.junit.Ignore;
import org.junit.Test;

/**
 * API tests for ServerConfigApi
 */
@Ignore
public class ServerConfigApiTest {

    private final ServerConfigApi api = new ServerConfigApi();

    /**
     * Get the current server configuration.
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void getServerConfigTest() throws ApiException {
        ServerConfig response = api.getServerConfig();

        // TODO: test validations
    }

    /**
     * Update the server&#39;s configuration.
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void updateServerConfigTest() throws ApiException {
        ServerConfig serverConfig = null;
        ServerConfig response = api.updateServerConfig(serverConfig);

        // TODO: test validations
    }
}
