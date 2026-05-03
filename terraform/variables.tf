variable "aws_region" {
  description = "AWS region where resources will be created"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Short project name used as a prefix for all resources"
  type        = string
  default     = "shopsmart"
}

variable "container_port" {
  description = "Port the container listens on"
  type        = number
  default     = 5001
}

variable "desired_count" {
  description = "Number of ECS tasks to run"
  type        = number
  default     = 1
}

variable "task_cpu" {
  description = "Fargate task CPU units (256 = 0.25 vCPU)"
  type        = string
  default     = "256"
}

variable "task_memory" {
  description = "Fargate task memory (MiB)"
  type        = string
  default     = "512"
}

variable "image_tag" {
  description = "Container image tag to deploy. Pipeline overrides this with the commit SHA."
  type        = string
  default     = "latest"
}

variable "mongodb_uri" {
  description = "MongoDB connection string passed as an env var to the task. Empty string disables DB connection."
  type        = string
  default     = ""
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret passed as an env var to the task"
  type        = string
  default     = "change-me-in-production"
  sensitive   = true
}
