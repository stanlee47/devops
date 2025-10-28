variable "resource_group_name" {
  description = "The name of the resource group."
  default     = "taskflow-rg"
}

variable "location" {
  description = "The location of the resources."
  default     = "East US"
}

variable "cluster_name" {
  description = "The name of the AKS cluster."
  default     = "taskflow-aks"
}

variable "dns_prefix" {
  description = "The DNS prefix for the AKS cluster."
  default     = "taskflow-aks"
}
