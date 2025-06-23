provider "aws" {
  region     = "us-east-2"
  access_key = "test123"
  secret_key = "test123"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    s3 = "http://localhost:4566"
  }

  s3_use_path_style = true
}

resource "aws_s3_bucket" "my_s3_bucket" {
  bucket = "s3-file-storage"
}