package io.woleet.idserver.api;

import io.woleet.idserver.ApiException;
import io.woleet.idserver.api.model.ServerEventArray;
import io.woleet.idserver.api.model.ServerEventGet;
import org.junit.Ignore;
import org.junit.Test;

import java.util.UUID;

/**
 * TODO: API tests for ServerEventApi
 */
@Ignore
public class ServerEventApiTest {

    private final ServerEventApi api = new ServerEventApi();

    /**
     * Get a server event by its identifier.
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void getServerEventByIdTest() throws ApiException {
        UUID serverEventId = null;
        ServerEventGet response = api.getServerEventById(serverEventId);

        // TODO: test validations
    }

    /**
     * List all Server Events.
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void getServerEventListTest() throws ApiException {
        ServerEventArray response = api.getServerEventList();

        // TODO: test validations
    }
}
