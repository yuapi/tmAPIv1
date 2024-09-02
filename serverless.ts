import type { AWS } from "@serverless/typescript";

const config: AWS = {
  org: "yuapi",
  app: "travelmakers",
  service: "v1",
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "ap-northeast-2",
    deploymentBucket: {
      name: "travelmakersbucket"
    }
  },
  functions: {
    hello: {
      handler: "handler.hello",
      events: [
        {
          http: {
            path: "/v1/hello",
            method: "GET"
          }
        }
      ]
    }
  }
}

export = config;