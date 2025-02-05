# schoolErp
Erp Sofware development
This School Erp is authorised by only OPTMS Tech.
"# README" 
# README
# README
/project-root
│── 📂 assets/                 # Static files (images, CSS, JavaScript, etc.)
│   ├── 📂 css/                # CSS files
│   ├── 📂 js/                 # JavaScript files
│   ├── 📂 img/                # Images
│── 📂 config/                 # Configuration files
│   ├── database.php           # Database connection using PDO
│   ├── config.php             # General configuration settings
│── 📂 api/                    # API endpoints (secured with authentication)
│   ├── 📂 user/               # User-related APIs
│   │   ├── get_users.php      # Fetch user list (secured)
│   │   ├── update_user.php    # Update user status (secured)
│   │   ├── delete_user.php    # Delete user (secured)
│   │   ├── suspend_user.php   # Suspend user (secured)
│   │   ├── activate_user.php  # Activate user (secured)
│   │   ├── send_credential.php # Send credentials (secured)
│   ├── check-session.php      # Check if session is still active
│── 📂 includes/               # Helper functions
│   ├── session_handler.php    # Handles session management
│   ├── api_key_auth.php       # API key authentication logic
│   ├── rate_limiter.php       # Rate limiting logic
│   ├── utils.php              # Utility functions (e.g., password hashing)
│── 📂 php/                    # Traditional PHP scripts (if needed)
│   ├── login.php              # User login script
│   ├── register.php           # User registration script
│   ├── logout.php             # User logout script
│── 📂 database/               # Database scripts
│   ├── schema.sql             # Database schema file
│── 📂 views/                  # Frontend HTML pages
│   ├── index.php              # Homepage
│   ├── login.html             # Login page
│   ├── dashboard.php          # Admin dashboard
│── 📂 logs/                   # Logs for debugging
│   ├── api_errors.log         # API error logs
│── .env                       # Environment variables (store secrets like DB credentials)
│── .htaccess                  # Apache config for security (if using Apache)
│── README.md                  # Documentation
