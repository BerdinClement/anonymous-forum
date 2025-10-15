# Null resource pour mettre à jour les configurations après création des instances
resource "null_resource" "update_configs" {
  depends_on = [
    aws_instance.berdin-forum-thread,
    aws_instance.berdin-forum-sender,
    aws_instance.berdin-forum-api,
    aws_instance.berdin-forum-db
  ]

  # Trigger sur les changements d'IP des instances
  triggers = {
    thread_ip = aws_instance.berdin-forum-thread.public_ip
    sender_ip = aws_instance.berdin-forum-sender.public_ip
    api_ip    = aws_instance.berdin-forum-api.public_ip
  }

  # Mise à jour de la config de l'instance thread
  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = tls_private_key.key.private_key_pem
      host        = aws_instance.berdin-forum-thread.public_ip
    }

    inline = [
      "sudo docker stop forum-thread || true",
      "sudo mkdir -p /tmp/config",
      "sudo tee /tmp/config/config.js > /dev/null << 'CONFIG_EOF'",
      "export const config = {",
      "  apiUrl: \"http://${aws_instance.berdin-forum-api.public_ip}:3000\",",
      "  senderAppUrl: \"http://${aws_instance.berdin-forum-sender.public_ip}:8080\"",
      "}",
      "CONFIG_EOF",
      "sudo docker start forum-thread || echo 'Container already running'"
    ]
  }

  # Mise à jour de la config de l'instance sender
  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = tls_private_key.key.private_key_pem
      host        = aws_instance.berdin-forum-sender.public_ip
    }

    inline = [
      "sudo docker stop forum-sender || true",
      "sudo mkdir -p /tmp/config",
      "sudo tee /tmp/config/config.js > /dev/null << 'CONFIG_EOF'",
      "export const config = {",
      "  apiUrl: \"http://${aws_instance.berdin-forum-api.public_ip}:3000\",",
      "  threadAppUrl: \"http://${aws_instance.berdin-forum-thread.public_ip}\"",
      "}",
      "CONFIG_EOF",
      "sudo docker start forum-sender || echo 'Container already running'"
    ]
  }
}