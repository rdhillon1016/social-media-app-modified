# THIS IS NOT INTENDED FOR PRODUCTION

resource "aws_acm_certificate" "cert" {
  private_key      = file(var.private_key)
  certificate_body = file(var.self_signed_cert)
}