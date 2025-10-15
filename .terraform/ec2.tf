resource "tls_private_key" "key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "deployer" {
  key_name   = "deployer-key-berdin"
  public_key = tls_private_key.key.public_key_openssh
}

resource "local_file" "private_key" {
  content         = tls_private_key.key.private_key_pem
  filename        = "${path.module}/deployer-key.pem"
  file_permission = "0600"
}

data "aws_ami" "amazon_linux_2" {
  most_recent = true

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "owner-alias"
    values = ["amazon"]
  }

  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm-*-x86_64-ebs"]
  }

  owners = ["amazon"]
}

resource "aws_instance" "berdin-forum-thread" {
  ami             = data.aws_ami.amazon_linux_2.id
  instance_type   = var.ec2_instance_type
  security_groups = [aws_security_group.sg_berdin_forum.name]
  key_name        = aws_key_pair.deployer.key_name

  user_data = <<-EOF
              #!/bin/bash
              set -e

              # Update system
              yum update -y

              # Install Docker
              amazon-linux-extras install -y docker
              systemctl enable docker
              systemctl start docker

              # (Optionnel) installer docker-compose
              curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose
              # Small pause to ensure Docker is ready
              sleep 5

              # Determine latest commit SHA from GitHub and use it as image tag
              LATEST_SHA=$(curl -s -H "Authorization: token ${var.github_token}" "https://api.github.com/repos/${var.github_username}/anonymous-forum/commits?per_page=1" | grep -m1 '"sha":' | sed -E 's/.*"([0-9a-f]{40})".*/\1/')
              SHORT_SHA=$${LATEST_SHA:0:7}
              USER_LOWER=$(echo "${var.github_username}" | tr '[:upper:]' '[:lower:]')
              THREAD_IMAGE="ghcr.io/$${USER_LOWER}/anonymous-forum-thread:$${SHORT_SHA}"

              # Login to GHCR and pull image
              echo "${var.github_token}" | docker login ghcr.io -u ${var.github_username} --password-stdin
              docker pull $${THREAD_IMAGE}

              # Generate initial config.js file for thread app (will be updated later)
              mkdir -p /tmp/config
              cat > /tmp/config/config.js << 'CONFIG_EOF'
              export const config = {
                apiUrl: "http://localhost:3000",
                senderAppUrl: "http://localhost:8080"
              }
              CONFIG_EOF

              # Run container with mounted config
              docker run -d \
                --name forum-thread \
                -p 80:80 \
                -v /tmp/config/config.js:/app/config.js \
                $${THREAD_IMAGE}
              EOF


  tags = {
    Name = "berdin-forum-thread"
  }
}

resource "aws_instance" "berdin-forum-sender" {
  ami             = data.aws_ami.amazon_linux_2.id
  instance_type   = var.ec2_instance_type
  security_groups = [aws_security_group.sg_berdin_forum.name]
  key_name        = aws_key_pair.deployer.key_name

  user_data = <<-EOF
              #!/bin/bash
              set -e

              # Update system
              yum update -y

              # Install Docker
              amazon-linux-extras install -y docker
              systemctl enable docker
              systemctl start docker

              # Login GHCR
              # Small pause to ensure Docker is ready
              sleep 5

              # Determine latest commit SHA from GitHub and use it as image tag
              LATEST_SHA=$(curl -s -H "Authorization: token ${var.github_token}" "https://api.github.com/repos/${var.github_username}/anonymous-forum/commits?per_page=1" | grep -m1 '"sha":' | sed -E 's/.*"([0-9a-f]{40})".*/\1/')
              SHORT_SHA=$${LATEST_SHA:0:7}
              USER_LOWER=$(echo "${var.github_username}" | tr '[:upper:]' '[:lower:]')
              SENDER_IMAGE="ghcr.io/$${USER_LOWER}/anonymous-forum-sender:$${SHORT_SHA}"

              # Login to GHCR and pull image
              echo "${var.github_token}" | docker login ghcr.io -u ${var.github_username} --password-stdin
              docker pull $${SENDER_IMAGE}

              # Generate initial config.js file for sender app (will be updated later)
              mkdir -p /tmp/config
              cat > /tmp/config/config.js << 'CONFIG_EOF'
              export const config = {
                apiUrl: "http://localhost:3000",
                threadAppUrl: "http://localhost:80"
              }
              CONFIG_EOF

              # Run sender container with mounted config
              docker run -d \
                --name forum-sender \
                -p 8080:8080 \
                -v /tmp/config/config.js:/app/config.js \
                $${SENDER_IMAGE}
              EOF

  tags = {
    Name = "berdin-forum-sender"
  }
}

resource "aws_instance" "berdin-forum-api" {
  ami             = data.aws_ami.amazon_linux_2.id
  instance_type   = var.ec2_instance_type
  security_groups = [aws_security_group.sg_berdin_forum.name]
  key_name        = aws_key_pair.deployer.key_name

  user_data = <<-EOF
              #!/bin/bash
              set -e

              # Update system
              yum update -y

              # Install Docker
              amazon-linux-extras install -y docker
              systemctl enable docker
              systemctl start docker

              # Login GHCR
              # Small pause to ensure Docker is ready
              sleep 5

              # Determine latest commit SHA from GitHub and use it as image tag
              LATEST_SHA=$(curl -s -H "Authorization: token ${var.github_token}" "https://api.github.com/repos/${var.github_username}/anonymous-forum/commits?per_page=1" | grep -m1 '"sha":' | sed -E 's/.*"([0-9a-f]{40})".*/\1/')
              SHORT_SHA=$${LATEST_SHA:0:7}
              USER_LOWER=$(echo "${var.github_username}" | tr '[:upper:]' '[:lower:]')
              API_IMAGE="ghcr.io/$${USER_LOWER}/anonymous-forum-api:$${SHORT_SHA}"

              # Login to GHCR and pull image
              echo "${var.github_token}" | docker login ghcr.io -u ${var.github_username} --password-stdin
              docker pull $${API_IMAGE}

              # Run API container
              docker run -d \
                --name forum-api \
                -p 3000:3000 \
                -e POSTGRES_HOST="${aws_instance.berdin-forum-db.public_ip}" \
                -e POSTGRES_PORT="5432" \
                -e POSTGRES_USER="forum_user" \
                -e POSTGRES_PASSWORD="forum_pass" \
                -e POSTGRES_DB="forum" \
                -e PORT="3000" \
                $${API_IMAGE}
              EOF

  tags = {
    Name = "berdin-forum-api"
  }

  depends_on = [ aws_instance.berdin-forum-db ]
}

resource "aws_instance" "berdin-forum-db" {
  ami             = data.aws_ami.amazon_linux_2.id
  instance_type   = var.ec2_instance_type
  security_groups = [aws_security_group.sg_berdin_forum.name]
  key_name        = aws_key_pair.deployer.key_name

  user_data = <<-EOF
              #!/bin/bash
              set -e

              yum update -y

              # Install Docker
              amazon-linux-extras install -y docker
              systemctl enable docker
              systemctl start docker

              # Pull postgres image
              docker pull postgres:15

              # Run postgres container
              docker run -d \
                --name forum-db \
                -p 5432:5432 \
                -e POSTGRES_USER="forum_user" \
                -e POSTGRES_PASSWORD="forum_pass" \
                -e POSTGRES_DB="forum" \
                -v /var/lib/postgresql/data:/var/lib/postgresql/data \
                postgres:15
              EOF

  tags = {
    Name = "berdin-forum-db"
  }
}
