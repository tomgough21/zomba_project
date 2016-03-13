import os

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "zomba_project.settings")

    from django.core.management import execute_from_command_line
    try:
        os.remove("db.sqlite3")
    except:
        pass
    execute_from_command_line(["manage.py", "migrate"])

    execfile("populate.py")