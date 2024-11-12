# Secure Password Manager

A user-friendly password manager built with Node.js and Express, designed to securely store, manage, and retrieve passwords for various websites. This application provides strong data security with encrypted password storage, user authentication, and intuitive CRUD operations for an easy and streamlined experience.

## Features

- **User Authentication**: Each user has a unique, secure account to store and access their passwords.
- **Encrypted Password Storage**: All passwords are securely encrypted, ensuring that they remain confidential and protected.
- **CRUD Operations**: Users can create, view, and delete their passwords with ease.
- **Intuitive Interface**: The design and functionality prioritize simplicity, making it easy to manage your passwords securely.

## Getting Started

### Prerequisites

- **Node.js**: Ensure Node.js is installed on your system.
- **Express**: Install Express if not already included in the project dependencies.

### Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   cd <project_directory>

2. **Install Dependencies**:
   ```bash
   npm install
   
3. **Set Up Environmental Variables**:
   - Create a .env file in the root directory.
   - Define the necessary variables
   
   ```bash
   PORT=3000
   DB_URI=your_database_url
   SECRET_KEY=your_secret_key

4. **Run the Application**:
   ```bash
   npm start

5. **Access the Application**

## Usage

### Sign Up and Login
- Register a new account or log in with existing credentials to access your password manager.

### Add a New Password
- Click "Add Password" and enter the site name, URL, username, and password.
- Your password will be securely encrypted before storage.

### View Saved Passwords
- Access saved passwords in a secure, decrypted format by selecting "View Passwords."
- Sensitive data remains encrypted and is only decrypted when viewed.

### Update or Delete Passwords
- Easily update details or delete stored passwords using the edit or delete options.

## Security

- **Encryption**: Passwords are encrypted with strong algorithms, keeping them secure and inaccessible to unauthorized users.
- **Authentication**: Only authenticated users can access stored passwords, providing an additional layer of security.
- **Environment Security**: Sensitive data, such as database URLs and secret keys, are managed through environment variables in a `.env` file, ensuring they are not exposed in the codebase.

## API Endpoints

### Authentication
- `POST /api/register`: Register a new user
- `POST /api/login`: Log in a user

### Password Management
- `POST /api/passwords`: Create a new password entry
- `GET /api/passwords`: Retrieve all passwords
- `DELETE /api/passwords/:id`: Delete a password entry

## Future Improvements

- **Multi-factor Authentication (MFA)**: Adding an extra layer of security with MFA.
- **Password Strength Checker**: Provide feedback to users on password strength.
- **Secure Sharing Options**: Allow secure sharing of specific passwords with trusted contacts.

## License

This project is licensed under the MIT License

---

<h3 align="left">Languages and Tools:</h3>
<p align="left"> <a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> <a href="https://www.mysql.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="40" height="40"/> </a> <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a> </p>

## Answers to Project Questions

### 1. How does the password manager prevent the adversary from learning about password lengths?

To protect against leaking password lengths, we use padding and encryption methods that obscure the actual length of each stored password. By keeping password storage uniform in structure and using AES-GCM encryption, the manager prevents attackers from discerning password lengths, even if they gain access to encrypted data.

### 2. How does the password manager prevent swap attacks?

The password manager uses HMAC hashing to authenticate each domain-password pair, ensuring data integrity. When a domain is stored, it's hashed with HMAC, which serves as an integrity check. If a swap attack is attempted, the mismatched HMAC values will cause the integrity check to fail, alerting us to tampered data.

### 3. Is it necessary to assume a trusted location exists to defend against rollback attacks?

Yes, a trusted location for the SHA-256 hash helps strengthen rollback attack defenses, as it allows us to check if the stored data matches previous versions. Without this trusted hash, while we can still perform data checks and HMAC validation to some extent, having a secure, unaltered copy of the hash makes rollback defenses much stronger and more reliable.

### 4. How would lookups work with a randomized MAC instead of HMAC, and is there a performance penalty?

If we used a randomized MAC, each time we hashed a domain it would produce a different tag, making it difficult to locate specific entries. To address this, we’d need to store each tag individually, which would increase storage requirements and decrease lookup efficiency. This would indeed introduce a performance penalty since lookups would no longer be a direct comparison.

### 5. How can information leakage about the number of records be minimized?

One way to reduce leakage about the number of records is to use padding or a fixed structure that obscures minor changes in the count. By ensuring that the storage structure only leaks information on a logarithmic scale, attackers can’t accurately detect small changes, making it harder to guess the true number of stored passwords.

### 6. How can multi-user support be added without compromising security?

For multi-user support, the system could generate unique encryption keys for each user based on their master password, allowing shared entries (like a password for a team account) to be securely accessed by multiple users. Each user would have a separate, user-specific encryption context, so accessing one user’s data would not compromise another’s.
