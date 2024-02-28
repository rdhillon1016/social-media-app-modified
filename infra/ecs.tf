# modify execution role to pull secrets
# resource "aws_iam_role" "ecs-with-secrets" {
#   name = "ecs-with-secrets"
#   assume_role_policy = jsonencode({
#     Version = "2008-10-17",
#     Statement = [
#       {
#         Sid    = ""
#         Effect = "Allow"
#         Principal = {
#           Service = "ecs-tasks.amazonaws.com"
#         }
#         Action = "sts:AssumeRole"
#       }
#     ]
#   })

#   inline_policy {
#     name = "secrets_inline"

#     policy = jsonencode({
#       Version = "2012-10-17"
#       Statement = [
#         {
#           Effect = "Allow"
#           Action = [
#             "secretsmanager:GetSecretValue",
#             "kms:Decrypt"
#           ]
#           Resource : [
#             aws_secretsmanager_secret.mongo-uri.arn,
#             aws_secretsmanager_secret.jwt-secret.arn
#           ]
#         }
#       ]
#     })
#   }

#   managed_policy_arns = ["arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"]
# }

# tasks
# resource "aws_ecs_task_definition" "backend" {
#   family = "Backend"

#   cpu                      = 256
#   memory                   = 512
#   requires_compatibilities = ["FARGATE"]
#   execution_role_arn       = aws_iam_role.ecs-with-secrets.arn
#   task_role_arn            = aws_iam_role.ecs-with-secrets.arn
#   network_mode             = "awsvpc"

#   container_definitions = jsonencode([
#     {
#       name      = "api"
#       image     = var.api_image_uri
#       cpu       = 128
#       memory    = 256
#       essential = false
#       portMappings = [
#         {
#           containerPort = 3002
#           hostPort      = 3002
#         }
#       ]
#       environment = [
#         {
#           name  = "NODE_ENV"
#           value = "production"
#         },
#         {
#           name  = "FE_URL"
#           value = "https://${aws_amplify_app.frontend.default_domain}"
#         },
#         {
#           name  = "DB_NAME"
#           value = "test"
#         },
#         {
#           name  = "GOOGLE_CLIENT_ID"
#           value = "${var.google_client_id}"
#         },
#         {
#           name  = "GOOGLE_SECRET"
#           value = "${var.google_secret}"
#         }
#       ]
#       secrets = [
#         {
#           name      = "MONGO_URI"
#           valueFrom = "${aws_secretsmanager_secret.mongo-uri.arn}"
#         },
#         {
#           name      = "SECRET"
#           valueFrom = "${aws_secretsmanager_secret.jwt-secret.arn}"
#         }
#       ]
#       dependsOn = [
#         {
#           containerName = "mongo"
#           condition     = "START"
#         }
#       ]
#     },
#     {
#       name      = "mongo"
#       image     = var.mongo_image_uri
#       cpu       = 128
#       memory    = 256
#       essential = true
#       portMappings = [
#         {
#           containerPort = 27017
#           hostPort      = 27017
#         }
#       ]
#       mountPoints = [
#         {
#           containerPath = "/db/data"
#           sourceVolume  = "mongodb"
#         }
#       ]
#     }
#   ])

#   volume {
#     name = "mongodb"

#     efs_volume_configuration {
#       file_system_id = aws_efs_file_system.mongo.id
#     }
#   }
# }

# # service
# resource "aws_ecs_service" "service" {
#   name = "backend"
#   cluster = aws_ecs_cluster.main.id
#   task_definition = aws_ecs_task_definition.backend.arn
#   desired_count = 1
#   launch_type = "FARGATE"
#   deployment_maximum_percent = 200
#   deployment_minimum_healthy_percent = 100

#   # load_balancer {

#   # }

#   # network_configuration {

#   # }
# }

# # cluster

# resource "aws_ecs_cluster" "main" {
#   name = "SocialMediaApp"
# }

# # resource "aws_ecs_cluster_capacity_providers" "providers" {
# #   capacity_providers = ["FARGATE", "FARGATE_SPOT"]
# #   cluster_name       = "SocialMediaApp"
# # }