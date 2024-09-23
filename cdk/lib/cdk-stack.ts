import { Construct } from "constructs";
import {
  Stack,
  StackProps,
  SecretValue,
  aws_codepipeline as codepipeline,
  aws_codepipeline_actions as codepipelineActions,
  aws_codebuild as codebuild,
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cfOrigins,
  RemovalPolicy,
  CfnOutput,
} from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();

    const sourceAction = new codepipelineActions.GitHubSourceAction({
      actionName: "GithubSource",
      owner: "philspaces",
      repo: "portfolio",
      oauthToken: SecretValue.secretsManager("github_token2", {
        jsonField: "github_token2",
      }),
      output: sourceOutput,
      branch: "main",
    });

    const buildAction = new codepipelineActions.CodeBuildAction({
      actionName: "Build",
      project: new codebuild.PipelineProject(this, "ViteSiteBuildProject", {
        buildSpec: codebuild.BuildSpec.fromObject({
          version: "0.2",
          phases: {
            install: {
              "runtime-versions": {
                nodejs: "20.x",
              },
              commands: ["npm install pnpm -g", "pnpm install"],
            },
            build: {
              commands: ["pnpm run build"],
            },
          },
          artifacts: {
            files: ["**/*"],
            "base-directory": "dist",
          },
        }),
        environment: {
          buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_5,
        },
      }),
      input: sourceOutput,
      outputs: [buildOutput],
    });

    const bucket = new s3.Bucket(this, "ViteSiteBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html", // SPA routing fallback
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // Automatically delete objects when stack is deleted
      publicReadAccess: false, // No public access, served through CloudFront,
    });

    const viteSiteOAI = new cloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity",
      {
        comment: "Vite site OAI",
      },
    );

    // Grant CloudFront OAI access to the S3 bucket
    bucket.grantRead(viteSiteOAI);
    bucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [bucket.bucketArn + "/*"],
        principals: [viteSiteOAI.grantPrincipal],
        sid: "AllowLegacyOAIReadOnly",
      }),
    );

    const distribution = new cloudfront.Distribution(
      this,
      "ViteSiteDistribution",
      {
        defaultBehavior: {
          origin: new cfOrigins.S3Origin(bucket, {
            originAccessIdentity: viteSiteOAI,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        },
        defaultRootObject: "index.html",
        errorResponses: [
          {
            httpStatus: 403,
            responsePagePath: "/error.html",
            responseHttpStatus: 200,
          },
        ],
      },
    );

    // Output the CloudFront distribution domain name
    new CfnOutput(this, "DistributionDomainName", {
      description: "The CloudFront URL:",
      value: distribution.distributionDomainName,
    });

    const deployAction = new codepipelineActions.S3DeployAction({
      actionName: "S3Deploy",
      input: buildOutput,
      bucket,
    });

    const pipeline = new codepipeline.Pipeline(this, "ViteSitePipeline", {
      pipelineName: "ViteSitePipeline",
      // let's save CMK since we're not doing any cross-account deployments
      crossAccountKeys: false,
    });

    pipeline.addStage({
      stageName: "Source",
      actions: [sourceAction],
    });

    pipeline.addStage({
      stageName: "Build",
      actions: [buildAction],
    });

    pipeline.addStage({
      stageName: "Deploy",
      actions: [deployAction],
    });
  }
}
