# THIS IS NOT INTENDED FOR PRODUCTION
# This self-provided certificate resource is only intended for testing
# provider "tls" {
#   # Configuration options
# }

# resource "tls_private_key" "example" {
#   algorithm = "RSA"
# }

# resource "tls_self_signed_cert" "example" {
#   private_key_pem = tls_private_key.example.private_key_pem

#   subject {
#     common_name = "*.amazonaws.com"
#   }

#   validity_period_hours = 36

#   allowed_uses = [
#     "key_encipherment",
#     "digital_signature",
#     "server_auth",
#   ]
# }

resource "aws_acm_certificate" "cert" {
  # private_key      = tls_private_key.example.private_key_pem
  # certificate_body = tls_self_signed_cert.example.cert_pem
  private_key      = file(var.private_key)
  certificate_body = file(var.self_signed_cert)
}