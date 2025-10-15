variable "ec2_instance_type" {
  description = "ec2_instance_type"
  type        = string
  default     = "t2.nano"
}

variable "github_username" {
  description = "GitHub username"
  type        = string
  default     = "BerdinClement"
}
variable "github_token" {
  sensitive = true
  description = "GitHub token"
  type        = string
  default     = "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"
}
