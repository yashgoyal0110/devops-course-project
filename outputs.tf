output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.my_instance.id
}

output "instance_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.my_instance.public_ip
}

output "instance_public_dns" {
  description = "Public DNS of the EC2 instance"
  value       = aws_instance.my_instance.public_dns
}

output "security_group_id" {
  description = "Security Group ID"
  value       = aws_security_group.my_security_group.id
}

output "key_pair_name" {
  description = "Key pair name"
  value       = aws_key_pair.my_key_pair.key_name
}