# Deployment Notes

We have chosen AWS Amplify to provide the frontend and a combination of AWS ECS and ALB for the backend.

## Backend

We can't just deploy our app on an ec2 instance since we need HTTPS. If you try to obtain a free TLS certificate (like from Let's Encrypt using certbot) for a default ec2 FQDN, you can't. Let's Encrypt has blacklisted ec2 domain names. Since I don't have my own domain to associate with the ec2 instance IP, this option is ruled out.

An alternative solution is to use an AWS ALB with a TLS certificate obtained through AWS ACM, and have that forward requests to our application.

Lastly, we package our application into a docker image and run a container on AWS ECS.

## Database

MongoDB Atlas (free tier).