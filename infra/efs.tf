resource "aws_efs_file_system" "mongo" {
  encrypted = true
  lifecycle_policy {
    transition_to_archive = "AFTER_90_DAYS"
    transition_to_ia      = "AFTER_30_DAYS"
  }
  throughput_mode = "elastic"
  protection {
    replication_overwrite = "ENABLED"
  }
}

resource "aws_efs_mount_target" "mongo-mount" {
  file_system_id  = aws_efs_file_system.mongo.id
  subnet_id       = aws_subnet.subnet.id
  security_groups = [aws_security_group.efs.id]
}

resource "aws_efs_mount_target" "mongo-mount2" {
  file_system_id  = aws_efs_file_system.mongo.id
  subnet_id       = aws_subnet.subnet2.id
  security_groups = [aws_security_group.efs.id]
}