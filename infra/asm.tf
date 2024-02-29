resource "aws_secretsmanager_secret" "mongo-uri" {
  name = "mongouri"
}

resource "aws_secretsmanager_secret" "jwt-secret" {
  name = "jwtsecret"
}

resource "aws_secretsmanager_secret_version" "mongo-uri" {
  secret_id     = aws_secretsmanager_secret.mongo-uri.id
  secret_string = "{\"MONGO_URI\": \"${var.mongo_uri}\"}"
}

resource "aws_secretsmanager_secret_version" "jwt-secret" {
  secret_id     = aws_secretsmanager_secret.jwt-secret.id
  secret_string = "{\"SECRET\": \"${var.jwt_secret}\"}"
}