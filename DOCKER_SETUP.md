# Art Log - Docker Setup Guide
This guide will help you run the Art Log application locally using Docker.

## Prerequisites
You will need Docker Desktop installed to run Docker commands in your CLI. After installation, make sure Docker Desktop is open and running! You can verify you have installed Docker through the command:
```bash
docker -v
```
And receive an output similar to ```Docker version 29.1.3```.

## Running the Application
### Step 1: Clone the repository
```bash
git clone https://github.com/JolieeZhuu/art-log.git
cd art-log
```
You can verify that you are in the same folder as `docker-compose.prod.yml` by prompting your shell with:
```bash
ls
```

### Step 2: Create a .env file
A sample of the format, `.env.example`, is given in the root directory. You can access these credentials either by communicating with me, or creating your own Supabase database and Google App Password, and generating your own JWT token! The `.env` file must be in the same directory as you are currently (parallel to `.env.example` and `docker-compose.prod.yml`).

### Step 3: Run Docker Compose
Run the command below in the same folder:
```bash
docker-compose -f docker-compose.prod.yml up
```
You will see that the frontend and backend containers are running. Optionally, you can add the `-d` tag (detached mode) at the end if you are experienced with Docker (so the logs don't fill up your terminal).

### Step 4: Accessing the application
Open your browser to access the application at http://localhost

### Step 5: Stopping the application
In your terminal, simply enter `Ctrl+C` to stop the container from running. If you ran the container in detached mode, then prompt the shell with this:
```bash
docker-compose -f docker-compose.prod.yml down
```

## Troubleshooting
If you run into any errors, let me know through my Linkedin, which you can access in my profile. Thanks! :)
