#!/bin/bash

MYDIR="$(dirname "$(which "$0")")"
MONGO_DIR=$MYDIR/../../mongo-test
API_DIR=$MYDIR/../../api
REGION=$1
ACCOUNT_ID=$2
ECR_URL=$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
MONGO_IMAGE_TAG=$ECR_URL/social_media_app_mongo:latest
API_IMAGE_TAG=$ECR_URL/social_media_app_api:latest

aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_URL

docker build -f $MONGO_DIR/Dockerfile -t $MONGO_IMAGE_TAG $MONGO_DIR
docker build -f $API_DIR/Dockerfile -t $API_IMAGE_TAG $API_DIR

docker push $MONGO_IMAGE_TAG
docker push $API_IMAGE_TAG