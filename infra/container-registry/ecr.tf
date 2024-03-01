terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.38.0"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}
resource "aws_ecr_repository" "api" {
    name = "social_media_app_api"
}

resource "aws_ecr_repository" "mongo" {
    name = "social_media_app_mongo"
}