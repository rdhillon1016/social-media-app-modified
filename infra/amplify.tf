resource "aws_amplify_app" "frontend" {
  name         = "frontend"
  repository   = var.github_repo
  access_token = var.github_access_token

  build_spec = <<-EOT
    version: 1
    applications:
      - frontend:
          phases:
            preBuild:
              commands:
                - npm ci
            build:
              commands:
                - npm run build
          artifacts:
            baseDirectory: build
            files:
              - '**/*'
          cache:
            paths:
              - node_modules/**/*
        appRoot: frontend
  EOT

  environment_variables = {
    REACT_APP_API_URL         = "https://${aws_lb.lb.dns_name}/"
    AMPLIFY_MONOREPO_APP_ROOT = "frontend"
    AMPLIFY_DIFF_DEPLOY       = "false"
  }
}

resource "aws_amplify_branch" "main" {
  app_id            = aws_amplify_app.frontend.id
  branch_name       = "main"
  enable_auto_build = true
}
