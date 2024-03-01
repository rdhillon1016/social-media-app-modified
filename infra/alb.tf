resource "aws_lb" "lb" {
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb.id]
  subnets            = [aws_subnet.subnet.id, aws_subnet.subnet2.id]
}

resource "aws_lb_target_group" "lb_tg" {
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.vpc.id

  health_check {
    path = "/health"
    port = 3002
  }
}

resource "aws_lb_listener" "lb_https" {
  load_balancer_arn = aws_lb.lb.arn
  certificate_arn   = aws_acm_certificate.cert.arn
  port              = "443"
  protocol          = "HTTPS"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.lb_tg.arn
  }
}