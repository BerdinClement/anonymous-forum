output "ssh_command" {
  description = "SSH command to connect to the forum-thread instance"
  value       = "ssh -i deployer-key.pem ec2-user@${aws_instance.berdin-forum-thread.public_ip}"
}

output "thread_ip" {
  description = "Thread instance public IP"
  value       = aws_instance.berdin-forum-thread.public_ip
}

output "sender_ip" {
  description = "Sender instance public IP"
  value       = aws_instance.berdin-forum-sender.public_ip
}

output "api_ip" {
  description = "API instance public IP"
  value       = aws_instance.berdin-forum-api.public_ip
}

output "db_ip" {
  description = "Database instance public IP"
  value       = aws_instance.berdin-forum-db.public_ip
}


