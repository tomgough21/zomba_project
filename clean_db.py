import os

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "zomba_project.settings")

    from django.core.management import execute_from_command_line
    try:
        os.remove("db.sqlite3")
    except:
        pass
    execute_from_command_line(["manage.py", "migrate"])
    # load default admin user to avoid having to input password
    execute_from_command_line(["manage.py", "createsuperuser", "--username=admin", "--email=admin.null.com"])
    execfile("populate.py")