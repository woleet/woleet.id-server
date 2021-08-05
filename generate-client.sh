#!/usr/bin/env bash
# Use this script to generate Java test/client code from Woleet.ID Server OpenAPI documentation.
# ==============================================================================================

OPENAPI_CODEGEN='npx --package @openapitools/openapi-generator-cli@1.0.18-4.3.1 openapi-generator'

# Clean previously generated code
rm -rf tests/java/src/main
rm -rf tests/java/docs

# Configure Java generation
export JAVA_OPTS='-Djava8=true -DmodelTests=false -DdateLibrary=java8'

# Generation of the Java client used for tests
$OPENAPI_CODEGEN generate -p hideGenerationTimestamp=true -i swagger.yaml -g java -o tests/java --api-package io.woleet.idserver.api --artifact-id woleet-idserver-api-client --group-id io.woleet.idserver --model-package io.woleet.idserver.api.model --artifact-version 1.0.0
