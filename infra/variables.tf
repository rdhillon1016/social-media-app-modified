variable "vpc_cidr_block" {
  description = "CIDR block for our VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidr_block" {
  description = "CIDR block for our subnet"
  type = string
  default = "10.0.1.0/24"
}

