# ITP4523M_Project

## Overview

1. [For Developer](#for-developer)
2. [Database Setup](#database-setup)
3. [Git Setup](#git-setup)
4. [UI Object Naming](#ui-object-naming)
5. [Webpage Icon](#webpage-icon)
6. [PHP Script](#php-script)
7. [API](#api)
8. [Access Points](#access-points)

## For Developer

I recommend using Postman to test the API or PHP script

Postman [link](https://www.postman.com/)

## Database Setup

### Windows

Download the Docker Desktop for Windows

[Link to download](https://www.docker.com/products/docker-desktop)

### Linux

Download the Docker Desktop for Linux

[Link to download](https://www.docker.com/products/docker-desktop)

### Mac

Download the orbstack for Mac

[Link to download](https://orbstack.dev/download)

```bash
brew install orbstack
```

## Git Setup

Instructions for setting up git.

```cmd
git config --global user.name "John Doe"
git config --global user.email "johndoe@email.com"
```

## About xmapp

Instructions for using xmapp.

please use project root folder as the working directory
and use the setup.sql file as the database file on root folder

## About Docker

Instructions for using Docker.

please use project root folder as the working directory
and use the setup.sql file as the database file on sql-scripts folder

### Starting the Docker Container
```cmd
docker compose up -d
```

### Stopping the Docker Container
```cmd
docker compose down
```

## UI Object Naming

Please refer to the naming convention for the object for UI

[Link to naming convention](https://jeffpar.github.io/kbarchive/kb/173/Q173738/)

## Webpage Icon

Please refer to the icon of the webpage

[Link to icons](https://heroicons.com/)

## PHP Script

Instructions for connecting to the database.

```php
// Add your PHP database connection script here
```

## API

Instructions for using the API, including dev token, login details, and endpoints.

### Dev Token

```
aab012e9-ae5d-4c74-adc0-ce4f9b9b7d8c
```

To Test, it

```
http://localhost/ITP4523M_Project/resources/php/api.php
```

### API Usage in HTML/JavaScript

Include the following JavaScript function in your HTML file to make API calls:

```javascript
async function callApi(action, data = {}) {
  const url = 'http://localhost/ITP4523M_Project/resources/php/api.php';
  const token = localStorage.getItem('token'); // Assuming token storage in localStorage
  
  try {
    const response = await fetch(`${url}?action=${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

### Login

```javascript
async function login(username, password) {
  try {
    const result = await callApi('login', { username, password });
    if (result.result && result.result.token) {
      localStorage.setItem('token', result.result.token);
      console.log('Login successful');
    } else {
      console.error('Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
}
```

#### Dealer Account

username: `alex@auto-racing.com`
password: `itp4523m`

#### Sales Manager Account

username: `kit@slms.com`
password: `itp4523m`

### Get Spare Part List

```javascript
async function getSparePartList() {
  try {
    const result = await callApi('getSparePartList');
    if (result.result) {
      displaySparePartList(result.result);
    }
  } catch (error) {
    console.error('Error fetching spare part list:', error);
  }
}
```

### Other API Actions

For other API actions like updating dealer profile, adding orders, etc., follow a similar pattern:

```javascript
async function performAction(actionName, actionData) {
  try {
    const result = await callApi(actionName, actionData);
    console.log(`${actionName} result:`, result);
  } catch (error) {
    console.error(`Error in ${actionName}:`, error);
  }
}
```

## Access Points

### Web Application

Access the web application at:

```
http://localhost/
```

### Database (Read-only)

Access the database (read-only) at:

```
http://localhost:8090/
```

### API

Access the API at:

```
http://localhost:8080/
```

Note: The database is accessible for viewing purposes only and cannot be edited directly through this interface.

### How to use the Cart API

#### Create a new cart

```js

```js

```

3 account for register and login

