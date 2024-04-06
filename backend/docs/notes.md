# Notes

## Setup

Project:

```bash
pipenv install # create virtual env
pipenv shell # activate virtual env
pipenv install django djangorestframework # install django and djangorestframework
exit # deactivate virtual env
```

Django:

```bash
django-admin startproject camps_for_champs # create project
djanog-admin startapp api # create app

cd api
django-admin startapp users # create users app inside api
```

## Django User Model

- `AbstractUser` -- This class inherits the `User` class and is used to add additional fields required for your `User` in database itself.
- `AbstractBaseUser` -- This class is used to create a custom user model where you can define your own fields and methods. It only has the authentication functionality.
- `PermissionsMixin` -- This class is used to add the `is_superuser` and `is_staff` fields to your custom user model. It also provides the methods to check the permissions of the user.
