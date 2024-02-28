variable "github_access_token" {
  description = "Access token to github repo for your Amplify app"
  type        = string
  sensitive   = true
}

variable "github_repo" {
  description = "URL of repo for Amplify app"
  type        = string
  sensitive   = true
}

variable "mongo_uri" {
  description = "mongo uri"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "key used to sign/verify JWT tokens"
  type        = string
  sensitive   = true
}

variable "google_client_id" {
  description = "client Id for google OAuth"
  type        = string
  sensitive   = true
  default     = "something"
}

variable "google_secret" {
  description = "key google OAuth"
  type        = string
  sensitive   = true
  default     = "something"
}

variable "api_image_uri" {
  description = "API image URI"
  type        = string
  sensitive   = true
}

variable "mongo_image_uri" {
  description = "Mongo image URI"
  type        = string
  sensitive   = true
}

variable "self_signed_cert" {
  description = "Self signed cert for testing"
  type        = string
  sensitive   = true
}

variable "private_key" {
  description = "private key for cert"
  type        = string
  sensitive   = true
}
