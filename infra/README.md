# Deployment Notes

We have chosen AWS Amplify to provide the frontend and a combination of AWS ECS and ALB for the backend. The API and the Mongo instance are both hosted on ECS (with EFS used for storage). **Note that this is just a testing environment and is not meant for an actual production version of the application.**

## Challenges

The original plan to host the API was to provision a EC2 t2.micro instance, run the express app on it, run an nginx reverse proxy on it, and provide a TLS certificate to nginx by using certbox to get a free certificate from Let's Encrypt. The problem with this approach is that Let's Encrypt, reasonably so, does not issue certificates for default aws domain names. Since I don't have my own domain name (I'm not spending the 3 dollars), I had to switch approaches.

The solution I had in mind was to run the express app on ECS, put an AWS Application Load Balancer infront of it, and use AWS Certificate Manager to obtain a TLS certificate for the load balancer. However, AWS also doesn't issue certificates for default load balancer domain names. So, instead of getting an actual certificate from a CA, I just used a self-signed certificate for testing purposes and to demonstrate the infrastructure setup and application deployment.

## Cleanup

If you want to cleanup your entire account rather than just the resources defined by the Terraform, you can use gruntwork-io/cloud-nuke to nuke all the resources on your AWS account.

## Prerequisites

The terraform in this directory assumes you have images in some container registry already. I've included the folder `./container-registry` for an example of how to do this for ECR. You can run the following after `cd`ing into the directory.

`terraform init`

`terraform apply`

`./setup-registry.sh <region-name> <aws-account-id>`