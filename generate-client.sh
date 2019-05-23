#!/usr/bin/env bash
# Use this script to generate Java test/client code from Woleet.ID Server OpenAPI documentation.
# ==============================================================================================

OPENAPI_CODEGEN='java -jar openapi-generator-cli.jar'

# Generation of the Java client used for tests
rm -rf tests/java/src/main
rm -rf tests/java/docs
$OPENAPI_CODEGEN generate -i swagger.yaml -g java -D hideGenerationTimestamp=true -Djava8=true -DdateLibrary=java8 -o tests/java --api-package io.woleet.idserver.api --artifact-id woleet-idserver-api-client --group-id io.woleet.idserver --model-package io.woleet.idserver.api.model --artifact-version 1.0.0

