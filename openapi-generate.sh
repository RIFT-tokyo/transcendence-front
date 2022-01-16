#!/bin/bash

docker run --rm -v $(pwd)/..:/local \
  openapitools/openapi-generator-cli:v5.3.1 generate \
  -i /local/docs/openapi.yaml \
  -g typescript-axios \
  -o /local/front/src/api/generated \
  --additional-properties=modelPropertyNaming=camelCase,supportsES6=true,withInterfaces=true,typescriptThreePlus=true
