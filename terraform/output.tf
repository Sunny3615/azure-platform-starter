output "web_app_name" {
  description = "Name of the Azure Linux Web App"
  value       = "azurerm_linux_web_app.webapp.name"
}

output "web_app_url" {
  description = "Public URL of the Azure Linux Web App"
  value       = "https://${azurerm_linux_web_app.webapp.default_hostname}"
}