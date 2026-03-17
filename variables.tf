variable "key_name" {
  description = "Name of the AWS key pair"
  type        = string
  default     = "terra-key-ec2"
}

variable "public_key_path" {
  description = "Path to the public key file"
  type        = string
  default     = "terra-key-ec2.pub"
}

variable "instance_ami" {
  description = "AMI ID for EC2 instance"
  type        = string
  default     = "ami-0b6c6ebed2801a5cb"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "instance_name" {
  description = "Name tag for EC2 instance"
  type        = string
  default     = "Automate-EC2"
}

variable "volume_size" {
  description = "Root volume size in GB"
  type        = number
  default     = 15
}

variable "volume_type" {
  description = "Root volume type"
  type        = string
  default     = "gp3"
}