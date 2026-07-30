variable "resource_group_location" {
  type        = string
  default     = "West Europe"
  description = "Location of the resource group."
}

variable "resource_group_name" {
  type        = string
  default     = "rg-doc-platform-dev"
  description = "The name of the resource group."
}

# West europe doesn't accept new customers,
variable "app_service_location" {
  type    = string
  default = "Canada Central"
}